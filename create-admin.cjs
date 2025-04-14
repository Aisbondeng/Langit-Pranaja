// Program kecil untuk membuat akun admin
const crypto = require('crypto');
const fs = require('fs');

// Fungsi hash password
async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${derivedKey.toString('hex')}.${salt}`);
    });
  });
}

// Data pengguna admin
async function createAdmin() {
  const hashedPassword = await hashPassword('adminpass');
  
  // Format data untuk menyimpan ke database in-memory
  const admin = {
    id: 1,
    username: 'admin',
    password: hashedPassword,
    email: 'admin@pranajaarishaf.com',
    userType: 'admin',
    registeredAt: new Date().toISOString(),
  };

  console.log('Admin account created with:');
  console.log('Username:', admin.username);
  console.log('Password: adminpass');
  console.log('Hashed Password:', admin.password);
  
  // Menyimpan informasi untuk digunakan
  fs.writeFileSync('admin-info.json', JSON.stringify(admin, null, 2));
  console.log('Admin info saved to admin-info.json');
}

createAdmin().catch(console.error);