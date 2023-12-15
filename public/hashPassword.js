//Testing Password Hashing
const closeModalBtn = document.querySelector('#closeModalBtn');
const closeSuccessModalBtn = document.querySelector('#closeSuccessModalBtn');
const errorModal = document.querySelector('#errorModal');
const successModal = document.querySelector('#successModal');
const errorUserModal = document.querySelector('#errorUserModal');
const errorUserModalBtn = document.querySelector('#closeUserModalBtn');

registerBtn.addEventListener('click', async function () {
    //Register Values
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;
    const registerBtn = document.querySelector('#registerBtn');
    
    try {
        await axios.post('/register', { email, password });
        showSuccessModal();
        document.querySelector('#registerEmail').value = '';
        document.querySelector('#registerPassword').value = '';
    } catch (err) {
        console.error(err);
        showUserErrorModal()
    };
});

loginBtn.addEventListener('click', async function () {
    // Login Values
    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;

    console.log('Login Request - Email:', email, 'Password:', password);

    try {
        const response = await axios.post('/login', { email, password });
        console.log(response.data);

        window.location.href = '/home';

    } catch (err) {
        console.error(err);
        showErrorModal();
    }
});


//Modal Functions
closeModalBtn.addEventListener('click', function () {
    hideErrorModal();
});

function showErrorModal() {
    errorModal.classList.remove('hidden');
};

function hideErrorModal() {
    errorModal.classList.add('hidden');
};

function showUserErrorModal() {
    errorUserModal.classList.remove('hidden');
};

function hideUserErrorModal() {
    errorUserModal.classList.add('hidden');
};

function showSuccessModal() {
    successModal.classList.remove('hidden');
};

function hideSuccessModal() {
    successModal.classList.add('hidden');
};

closeSuccessModalBtn.addEventListener('click', function () {
    hideSuccessModal();
});

errorUserModalBtn.addEventListener('click', function() {
    hideUserErrorModal();
});