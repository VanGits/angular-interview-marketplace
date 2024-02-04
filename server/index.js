const express = require('express');
const cors = require('cors');
const { initializeApp } = require("firebase/app")
const { getDatabase, ref, push, set, child, get  } = require("firebase/database");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");

// var admin = require("firebase-admin");
// var serviceAccount = require("./keys/serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://interview-marketplace-c1e0f-default-rtdb.firebaseio.com"
// });

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

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
 
// Initialize firebase app

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(firebaseApp);

app.use(express.json());


// Routes


// ------------ AUTH  ------------

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
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

// ------------ AUTH  ------------

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
