import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCc4JaU5heWBY4rGElHwDJIpEx_L7s7I9M",
    authDomain: "ask-yui.firebaseapp.com",
    projectId: "ask-yui",
    storageBucket: "ask-yui.appspot.com",
    messagingSenderId: "774250078141",
    appId: "1:774250078141:web:d2fa75a1da5c4261967cd4",
    measurementId: "G-7D3CWJPGK6"
  };
  // Inisialisasi Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);

  const checkUserExists = (user) => {
      if (user) {
          const uid = user.uid;
          const usersRef = ref(database, `admin/${uid}`);
          return get(usersRef).then(snapshot => snapshot.exists());
      }
      return Promise.resolve(false);
  };

  const isAdminPage = window.location.href.includes("yui.html");
  const isLoginPage = window.location.href.includes("Sign.html");

  const loadingElement = document.getElementById('loading');
  const contentElement = document.getElementById('content');

  loadingElement.style.display = 'block';

  onAuthStateChanged(auth, (user) => {
      if (user) {
          checkUserExists(user).then(isAdmin => {
              if (isAdmin && isAdminPage) {
                  loadingElement.style.display = 'none';
                  contentElement.style.display = 'block';
              } else if (!isAdmin && isAdminPage) {
                  window.location.href = "https://askyui-anything.vercel.app/admin/Sign.html";
                //   window.location.href = "http://127.0.0.1:5500/admin/Sign.html";
              } else if (isAdmin && !isAdminPage) {
                // window.location.href = "http://127.0.0.1:5500/admin/Yui.html";
                  window.location.href = "https://askyui-anything.vercel.app/admin/yui.html";
              } else {
                  loadingElement.style.display = 'none';
                  contentElement.style.display = 'block';
              }
          });
      } else {
          if (!isLoginPage) {
            // window.location.href = "http://127.0.0.1:5500/admin/Sign.html";
              window.location.href = "https://askyui-anything.vercel.app/admin/Sign.html";
          } else {
              loadingElement.style.display = 'none';
              contentElement.style.display = 'block';
          }
      }
  });
  // Logout
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        signOut(auth).then(() => {
            Swal.fire({
                title: 'Logout successful',
                icon: 'success',
                timer: 5000,
                showConfirmButton: false
            }).then(() => {
                location.href = "https://askyui-anything.vercel.app/admin/Sign.html";
                // location.href = "http://127.0.0.1:5500/page-admin/admin/Sign.html";

            });
        }).catch(error => {
            console.error('Sign out error', error);
        });
    });
};