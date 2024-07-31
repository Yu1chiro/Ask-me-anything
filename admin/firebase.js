import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCc4JaU5heWBY4rGElHwDJIpEx_L7s7I9M",
    authDomain: "ask-yui.firebaseapp.com",
    projectId: "ask-yui",
    storageBucket: "ask-yui.appspot.com",
    messagingSenderId: "774250078141",
    appId: "1:774250078141:web:d2fa75a1da5c4261967cd4",
    measurementId: "G-7D3CWJPGK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

let signinButton = document.getElementById("signin-button");
let signupButton = document.getElementById("signup-button");

// Function to show loading spinner in a button
function showLoading(button) {
  // Save original button content
  button.originalText = button.innerHTML;

  // Add spinner inside the button and hide text
  button.innerHTML = '<div class="spinner"></div>';
}

// Function to hide loading spinner in a button
function hideLoading(button) {
  // Restore original button content
  button.innerHTML = button.originalText;
}

signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    showLoading(signupButton);
  
    let name = document.getElementById("name").value;
    let nohp = document.getElementById("nohp").value;
    let emailSignup = document.getElementById("email_signup").value;
    let passwordSignup = document.getElementById("psw_signup").value;
  
    createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
      .then((userCredential) => {
        const user = userCredential.user;
  
        set(ref(database, "admin/" + user.uid), {
          name: name,
          nohp: nohp,
          email: emailSignup,
          password: passwordSignup,
          admin: true
        })
          .then(() => {
            Swal.fire({
              icon: 'success',
              text: 'Success Create the Role'
            }).then(() => {
              // Toggle between pages after successful signup
              document.getElementById('page-register').classList.remove('active');
              document.getElementById('page-login').classList.add('active');
            });
          })
          .catch((error) => {
            alert(error);
          })
          .finally(() => {
            hideLoading(signupButton);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
        hideLoading(signupButton);
      });
  });
  

signinButton.addEventListener("click", (e) => {
  e.preventDefault();
  showLoading(signinButton);

  let emailSignin = document.getElementById("email_signin").value;
  let passwordSignin = document.getElementById("psw_signin").value;

  signInWithEmailAndPassword(auth, emailSignin, passwordSignin)
    .then((userCredential) => {
      const user = userCredential.user;

      const dbRef = ref(database);
      get(child(dbRef, `admin/${user.uid}`))
        .then((snapshot) => {
          if (snapshot.exists() && snapshot.val().admin === true) {
            Swal.fire({
              icon: 'success',
              title: 'ようこそ👋',
            }).then(() => {
            //   location.href = "http://127.0.0.1:5500/admin/Yui.html";
              location.href = "https://askyui-anything.vercel.app/admin/Yui.html";
            });
          } else {
            alert("Access Denied. Admins only.");
            signOut(auth).catch((error) => console.log("Sign out error:", error));
          }
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to check admin status'
          });
        })
        .finally(() => {
          hideLoading(signinButton);
        });
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Oops! Email & Password Salah'
      });
      hideLoading(signinButton);
    });
});
// 
