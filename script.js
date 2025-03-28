import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCVYxh3Hxj5grdfG_lyY3VCYJWhBg2TD1g",
    authDomain: "cybersecurity-cd1df.firebaseapp.com",
    projectId: "cybersecurity-cd1df",
    storageBucket: "cybersecurity-cd1df.appspot.com",
    messagingSenderId: "39065253699",
    appId: "1:39065253699:web:a06f04d09084dd8638a1f6",
    measurementId: "G-R7DLQ3NWYC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; // Export auth and db for use in other files

// Login
document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("logemail").value;
    const password = document.getElementById("logpassword").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
            alert(`Welcome back, ${docSnap.data().fullName}!`);
            window.location.href = "dashboard.html";
        } else {
            alert("No user data found!");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert(error.message);
    }
});

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("You have been logged out successfully.");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Logout Error:", error);
        alert("Failed to log out. Please try again.");
    }
});

onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes("dashboard.html")) {
        document.getElementById("userEmail").textContent = `Logged in as: ${user.email}`;
    } else if (!user && !window.location.pathname.includes("index.html")) {
        window.location.href = "index.html";
    }
});