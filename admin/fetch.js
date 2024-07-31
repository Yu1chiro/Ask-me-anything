import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, get, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

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
const database = getDatabase(app);

const tableBody = document.getElementById('aspirasi-table-body');

// Function to format timestamp
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
};

// Function to show the modal
const showModal = (message) => {
    const modal = document.getElementById('detail-modal');
    const modalMessage = document.getElementById('modal-message');
    const downloadBtn = document.getElementById('download-btn');
    
    modalMessage.textContent = message;
    modal.classList.remove('hidden');
    
    // Setup download button
downloadBtn.addEventListener('click', () => {
    html2canvas(modal).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'secret-message.png';
        link.click();
        
        // Wait for 1 second before redirecting to Instagram
        setTimeout(() => {
            // Attempt to open Instagram app using the URI scheme
            
            window.location.href = 'https://www.instagram.com/';
            // Fallback to open Instagram website if the app is not installed
            setTimeout(() => {
                window.location.href = 'instagram://user?username=';
            }, 2000);
        }, 2000);
    });
});

};

// Function to hide the modal
const hideModal = () => {
    const modal = document.getElementById('detail-modal');
    modal.classList.add('hidden');
};

// Add event listener to the close button
document.getElementById('close-modal-btn').addEventListener('click', hideModal);

// Fetch data from Firebase and populate table
const aspirasiRef = ref(database, 'Ask-yui');
onValue(aspirasiRef, (snapshot) => {
    tableBody.innerHTML = ''; // Clear the table body
    const data = snapshot.val();
    if (data) {
        Object.keys(data).forEach((key) => {
            const item = data[key];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="py-2 px-4 border-b border-gray-200 text-black text-start">${formatTimestamp(Number(key))}</td>
                <td class="py-2 px-4 border-b border-gray-200 text-black text-start">${item.Message}</td>
                <td class="py-2 px-4 border-b border-gray-200">
                    <h3 class="text-red-500 text-center font-bold cursor-pointer rounded delete-btn" data-id="${key}">Hapus</h3>
                    <button class="text-blue-500 text-center font-bold cursor-pointer rounded detail-btn" data-message="${item.Message}" data-id="${key}">Detail</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach((button) => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                try {
                    await remove(ref(database, `Ask-yui/${id}`));
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Data telah dihapus.',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } catch (error) {
                    console.error('Error deleting data:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Gagal menghapus data.',
                        icon: 'error',
                        showConfirmButton: true
                    });
                }
            });
        });

        // Add event listeners to detail buttons
        document.querySelectorAll('.detail-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const message = button.getAttribute('data-message');
                showModal(message);
            });
        });
    }
});

