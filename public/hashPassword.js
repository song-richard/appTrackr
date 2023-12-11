const saltRounds = 10;

function hashPassword(plainPassword) {
    return bcrypt.hashSync(plainPassword, saltRounds);
}

function handleLogin() {
    const plainPassword = document.getElementById('password').value;

    const hashedPassword = hashPassword(plainPassword);

    console.log('Hashed Password:', hashedPassword);

}

