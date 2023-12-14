//Testing Password Hashing
registerBtn.addEventListener('click', async function () {
    //Register Values
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;
    const registerBtn = document.querySelector('#registerBtn');
    try {
        await axios.post('/register', { email, password });
    } catch (err) {
        console.error(err);
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
    }
});