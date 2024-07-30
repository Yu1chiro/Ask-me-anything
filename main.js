import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js"; 

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
const database = getDatabase(app);

// Helper function to sanitize input
function sanitizeInput(input) {
    // Remove potentially dangerous HTML tags and content
    let sanitized = input.replace(/<script.*?>.*?<\/script>/gi, '')
                         .replace(/<iframe.*?>.*?<\/iframe>/gi, '')
                         .replace(/<object.*?>.*?<\/object>/gi, '')
                         .replace(/<embed.*?>.*?<\/embed>/gi, '')
                         .replace(/<applet.*?>.*?<\/applet>/gi, '')
                         .replace(/<\/?(?:form|input|button|textarea|select|style)[^>]*>/gi, '')
                         .replace(/<\/?[^>]+>/gi, ''); // Remove remaining HTML tags
    
    // Encode special characters to prevent XSS
    sanitized = sanitized.replace(/&/g, '&amp;')
                         .replace(/</g, '&lt;')
                         .replace(/>/g, '&gt;')
                         .replace(/"/g, '&quot;')
                         .replace(/'/g, '&#39;');
    
    return sanitized;
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-message');
    const submitButton = document.getElementById('send-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        let message = document.getElementById('message').value;

        // Sanitize input
        message = sanitizeInput(message);

        // Validate input
        if (!message) {
            Swal.fire({
                icon: 'error',
                title: 'Your message has been blocked',
                text: 'Hayo lho mau nyoba XSS kan?😁 Jangan gtu lah ngab, ga asik kali kau',
                showConfirmButton: false
            });
            return;
        }

        // Add loading animation to submit button
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        // Generate a unique ID based on timestamp
        const timestamp = Date.now(); // Current timestamp in milliseconds

        // Send data to Firebase
        try {
            await set(ref(database, 'Ask-yui/' + timestamp), {
                Message: message
            });
            
            // Stop loading animation and reset form
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            form.reset();
            
            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Thankyou!',
                text: 'Sending Successfully!',
                timer: 1000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error writing to Firebase Database', error);
            alert('Gagal mengirim aspirasi. Silakan coba lagi.');
            
            // Stop loading animation in case of error
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    });
});
