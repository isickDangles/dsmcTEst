const bcrypt = require('bcrypt');
const saltRounds = 10; // or your desired salt rounds

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(hash);
  return hash;
}


hashPassword("admin"); 