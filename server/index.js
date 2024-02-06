const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: "./.env" });
const { initializeApp } = require("firebase/app")
const { getDatabase, ref, push, set, child, get  } = require("firebase/database");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } = require("firebase/auth");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
 
// ------------ INITIALIZE FIREBASE APP  ------------

const firebaseConfig = {
  apiKey: "AIzaSyD3j2TJRCG4Lf1Ux7nzVBRCL8BXIUGZRTY",
  authDomain: "interview-marketplace-c1e0f.firebaseapp.com",
  databaseURL: "https://interview-marketplace-c1e0f-default-rtdb.firebaseio.com",
  projectId: "interview-marketplace-c1e0f",
  storageBucket: "interview-marketplace-c1e0f.appspot.com",
  messagingSenderId: "485022054230",
  appId: "1:485022054230:web:68830b0271d173677548f7",
  measurementId: "G-G983G0FXJN"
 };

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(firebaseApp);

app.use(express.json());



app.use(async (req, res, next) => {
  try {
    const user = await new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        resolve(user);
      });
    });

    req.user = user;
    console.log(req.user);
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ------------ AUTH  ------------

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    
    const userRef = ref(db, `users/${user.uid}`);
    await set(userRef, { email: user.email, balance: 0, paidInterviews: [] });

    res.status(201).json({ uid: user.uid, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// Login existing user
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    res.status(200).json({ uid: user.uid, email: user.email });

  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Login failed' });
    
  }
});

// ------------ GET USER INFORMATION  ------------


app.get('/user-info', async (req, res) => {
  try {
    if (req.user) {
      const userId = req.user.uid;

      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        const userBalance = userSnapshot.val().balance;
        const paidInterviews = userSnapshot.val().paidInterviews || [];

        const userInterviewsRef = ref(db, `users/${userId}/interviews`);
        const userInterviewsSnapshot = await get(userInterviewsRef);

        if (userInterviewsSnapshot.exists()) {
          let userInterviews = [];
          userInterviewsSnapshot.forEach((childSnapshot) => {
            userInterviews.push(childSnapshot.val());
          });

          const userInfo = {
            uid: req.user.uid,
            email: req.user.email,
            balance: userBalance,
            paidInterviews: paidInterviews,
            interviews: userInterviews,
          };

          res.status(200).json(userInfo);
        } else {
          const userInfo = {
            uid: req.user.uid,
            email: req.user.email,
            balance: userBalance,
            paidInterviews: paidInterviews,
            interviews: [],
          };

          res.status(200).json(userInfo);
        }
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      res.status(401).json({ error: 'User not authenticated' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// ------------ HANDLE INTERVIEWS  ------------

// Fetch all interviews
app.get('/interviews', async (req, res) => {
 try {
    const interviewsRef = ref(db, 'interviews');
    const snapshot = await get(interviewsRef);

    if (snapshot.exists()) {
      // Convert snapshot to array
      let interviews = [];
      snapshot.forEach((childSnapshot) => {
        interviews.push(childSnapshot.val());
      });
      
      res.status(200).json(interviews);
    } else {
      res.status(404).json({ message: 'No interviews found' });
    }
 } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
 }
});

// Fetch a specific interview by its ID
app.get('/interviews/:interviewId', async (req, res) => {
  try {
    const interviewId = req.params.interviewId;

    // Retrieve the specific interview from the database
    const interviewRef = ref(db, `interviews/${interviewId}`);
    const interviewSnapshot = await get(interviewRef);

    if (interviewSnapshot.exists()) {
      const interviewData = interviewSnapshot.val();
      res.status(200).json(interviewData);
    } else {
      res.status(404).json({ message: 'Interview not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});


// Create a new interview
app.post('/interviews', async (req, res) => {
  try {
      const { userId, title, author, price, questions, description } = req.body;

      // Save interview under user's interviews
      const newInterviewRef = push(child(ref(db), `users/${userId}/interviews`));
      set(newInterviewRef, { id: newInterviewRef.key, title, author, price, questions, description })

      // Save interview in overall interviews array
      const newOverallInterviewRef = push(child(ref(db), '/interviews'));
      set(newOverallInterviewRef, { id: newOverallInterviewRef.key, title, author, price, questions, description });

      res.status(201).json({ message: 'Interview created successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Not Authorized" });
  }
 });


 // ------------------------ HANDLE PAYMENT WITH STRIPE ------------------------

 app.post('/create-checkout-session', async (req, res) => {
  const { interviewId } = req.body;

  try {
    const interviewRef = ref(db, `interviews/${interviewId}`);
    const interviewSnapshot = await get(interviewRef);

    if (!interviewSnapshot.exists()) {
      return res.status(404).send('Interview not found');
    }

    const interviewData = interviewSnapshot.val();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: interviewData.title,
          },
          unit_amount: interviewData.price *  100, 
        },
        quantity:  1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/`,
      cancel_url: `${req.headers.origin}/`,
    });

    const userId = req.user.uid;
    const userPaidInterviewsRef = ref(db, `users/${userId}/paidInterviews`);
    const userPaidInterviewsSnapshot = await get(userPaidInterviewsRef);
    const paidInterviews = userPaidInterviewsSnapshot.val() || [];

    if (!paidInterviews.includes(interviewId)) {
      paidInterviews.push(interviewId);
      await set(userPaidInterviewsRef, paidInterviews);
    }

   
    const userRef = ref(db, `users/${userId}`);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
      const updatedUserInfo = {
        uid: req.user.uid,
        email: req.user.email,
        balance: userSnapshot.val().balance,
        paidInterviews: paidInterviews,
        interviews: userSnapshot.val().interviews || [],
      };

     
      res.json({
        sessionId: session.id,
        updatedUserInfo: updatedUserInfo,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

 // -----------------------------
 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});