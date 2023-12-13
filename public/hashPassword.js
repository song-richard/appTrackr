// const saltRounds = 10;



// //Login Values
// const loginEmailVal = document.querySelector('#loginEmail').value;
// const loginPwVal = document.querySelector('#loginPassword').value;
// const loginBtn = document.querySelector('#loginBtn');

// async function hashPassword(plainPassword) {
//     try {
//         await bcrypt.hashSync(plainPassword, saltRounds);
//     } catch (err) {
//         console.error(err)
//     }
// }

// function handleLogin() {
//     const plainPassword = document.getElementById('password').value;

//     const hashedPassword = hashPassword(plainPassword);

//     console.log('Hashed Password:', hashedPassword);

// }

registerBtn.addEventListener('click', async function () {
    //Register Values
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;
    const registerBtn = document.querySelector('#registerBtn');
    try {
        await axios.post('/register', { email, password });
    } catch (err) {
        console.error(err)
    }
})