import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, set, ref, update, get, child } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyDaOtiESsSL_uU8fayZWRfWhdSXghSrCE8",
    authDomain: "portal-aspirasi.firebaseapp.com",
    projectId: "portal-aspirasi",
    storageBucket: "portal-aspirasi.appspot.com",
    messagingSenderId: "302052118377",
    appId: "1:302052118377:web:e24e63611072c43c92f7f8",
    measurementId: "G-ZKJ9KETMSG"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

let signinButton = document.getElementById("signin-button");
let signupButton = document.getElementById("signup-button");

signupButton.addEventListener("click", (e) => {
  let name = document.getElementById("name").value;
  let nohp = document.getElementById("nohp").value;
  let emailSignup = document.getElementById("email_signup").value;
  let passwordSignup = document.getElementById("psw_signup").value;

  createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      set(ref(database, "admin/" + user.uid), {
        name: name,
        nohp: nohp,
        email: emailSignup,
        password: passwordSignup,
        admin: true // Set admin flag to true
      })
        .then(() => {
          // Data saved successfully!
         Swal.fire({
                icon: 'success',
                text: 'Success Create the Role'
         });
        })
        .catch((error) => {
          // The write failed
          alert(error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});

signinButton.addEventListener("click", (e) => {
  let emailSignin = document.getElementById("email_signin").value;
  let passwordSignin = document.getElementById("psw_signin").value;

  signInWithEmailAndPassword(auth, emailSignin, passwordSignin)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      // Check if user is admin from database
      const dbRef = ref(database);
      get(child(dbRef, `admin/${user.uid}`)).then((snapshot) => {
        if (snapshot.exists() && snapshot.val().admin === true) {
          Swal.fire({
            icon: 'success',
            title: 'Hello Hera 👋',
          }).then(() => {
            // Redirect after the alert is closed
            // location.href = "";
            location.href = "http://127.0.0.1:5500/admin/heraa.html";
          });
        } else {
          alert("Access Denied. Admins only.");
          signOut(auth).catch((error) => console.log("Sign out error:", error));
        }
      }).catch((error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to check admin status'
        });
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Oops! Email & Password Salah'
      });
    });
});

