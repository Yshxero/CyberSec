// ✅ Import Firebase modules (Use this if script is in an HTML file with type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCVYxh3Hxj5grdfG_lyY3VCYJWhBg2TD1g",
    authDomain: "cybersecurity-cd1df.firebaseapp.com",
    projectId: "cybersecurity-cd1df",
    storageBucket: "cybersecurity-cd1df.appspot.com",
    messagingSenderId: "39065253699",
    appId: "1:39065253699:web:a06f04d09084dd8638a1f6",
    measurementId: "G-R7DLQ3NWYC"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Handle Signup
document.getElementById("signupForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const fullName = document.getElementById("signupFullName").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ✅ Store user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            email: email
        });

        alert("Signup successful! You can now log in.");
        window.location.href = "index.html";
    } catch (error) {
        alert(error.message);
    }
});

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
        alert(error.message);
    }
});

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Logged out!");
        window.location.href = "index.html";
    } catch (error) {
        alert(error.message);
    }
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
            document.getElementById("userEmail").textContent = `Logged in as: ${docSnap.data().fullName} (${docSnap.data().email})`;
        }
    } else {
        window.location.href = "index.html"; 
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("signupPassword");

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            if (passwordField.type === "password") {
                passwordField.type = "text";
                togglePassword.classList.replace("ion-md-eye-off", "ion-md-eye");
            } else {
                passwordField.type = "password";
                togglePassword.classList.replace("ion-md-eye", "ion-md-eye-off");
            }
        });
    }
});
