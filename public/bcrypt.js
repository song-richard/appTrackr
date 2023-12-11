const bcrypt = require('bcrypt');

const saltRounds = 10;

bcrypt.hash('user_password', saltRounds, (err, hash) => {
    if (err) {
      console.error(err);
      return;
    }
  });