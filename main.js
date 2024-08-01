import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js"; 

const firebaseConfig = {
    apiKey: "AIzaSyCc4JaU5heWBY4rGElHwDJIpEx_L7s7I9M",
    authDomain: "ask-yui.firebaseapp.com",
    projectId: "ask-yui",
    storageBucket: "ask-yui.appspot.com",
    messagingSenderId: "774250078141",
    appId: "1:774250078141:web:d2fa75a1da5c4261967cd4",
    measurementId: "G-7D3CWJPGK6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function sanitizeInput(input) {
    let sanitized = input.replace(/<script.*?>.*?<\/script>/gi, '')
                         .replace(/<iframe.*?>.*?<\/iframe>/gi, '')
                         .replace(/<object.*?>.*?<\/object>/gi, '')
                         .replace(/<embed.*?>.*?<\/embed>/gi, '')
                         .replace(/<applet.*?>.*?<\/applet>/gi, '')
                         .replace(/<\/?(?:form|input|button|textarea|select|style)[^>]*>/gi, '')
                         .replace(/<\/?[^>]+>/gi, ''); 
    
    sanitized = sanitized.replace(/&/g, '&amp;')
                         .replace(/</g, '&lt;')
                         .replace(/>/g, '&gt;')
                         .replace(/"/g, '&quot;')
                         .replace(/'/g, '&#39;');
    
    return sanitized;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-message');
    const submitButton = document.getElementById('send-message');
    const messageInput = document.getElementById('message');

    messageInput.addEventListener('input', () => {
        if (messageInput.value.length > 100) {
            messageInput.value = messageInput.value.substring(0, 100);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let message = messageInput.value;

        message = sanitizeInput(message);

        if (!message) {
            Swal.fire({
                icon: 'error',
                title: 'Your message has been blocked',
                showConfirmButton: false
            });
            return;
        }

        submitButton.classList.add('loading');
        submitButton.disabled = true;

        const timestamp = Date.now(); 

        try {
            await set(ref(database, 'Ask-yui/' + timestamp), {
                Message: message
            });
            
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            form.reset();
            
            Swal.fire({
                icon: 'success',
                title: 'Sankyu!',
                timer: 1000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error writing to Firebase Database', error);
            alert('Gagal mengirim aspirasi. Silakan coba lagi.');
            
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    });
});
