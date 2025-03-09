
const firebaseConfig = {
    apiKey: "AIzaSyCVYxh3Hxj5grdfG_lyY3VCYJWhBg2TD1g",
    authDomain: "cybersecurity-cd1df.firebaseapp.com",
    projectId: "cybersecurity-cd1df",
    storageBucket: "cybersecurity-cd1df.appspot.com",
    messagingSenderId: "39065253699",
    appId: "1:39065253699:web:a06f04d09084dd8638a1f6",
    measurementId: "G-R7DLQ3NWYC"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById("signupForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const fullName = document.getElementById("signupFullName").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            return db.collection("users").doc(user.uid).set({
                fullName: fullName,
                email: email
            });
        })
        .then(() => {
            alert("Signup successful! You can now log in.");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});

document.getElementById("loginForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Fetch user details from Firestore
            return db.collection("users").doc(user.uid).get();
        })
        .then((doc) => {
            if (doc.exists) {
                alert(`Welcome back, ${doc.data().fullName}!`);
                window.location.href = "dashboard.html";
            } else {
                alert("No user data found!");
            }
        })
        .catch((error) => {
            alert(error.message);
        });
});

document.getElementById("logoutBtn")?.addEventListener("click", function () {
    auth.signOut().then(() => {
        alert("Logged out!");
        window.location.href = "index.html";
    }).catch((error) => {
        alert(error.message);
    });
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                document.getElementById("userEmail").textContent = `Logged in as: ${doc.data().fullName} (${doc.data().email})`;
            }
        });
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
  
  
  