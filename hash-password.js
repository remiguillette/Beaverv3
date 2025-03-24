const crypto = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function main() {
  const adminPassword = 'password';
  const remiPassword = 'MC44rg99qc@';
  
  const adminHash = await hashPassword(adminPassword);
  const remiHash = await hashPassword(remiPassword);
  
  console.log('Admin password hash:', adminHash);
  console.log('Remiguillette password hash:', remiHash);
}

main().catch(console.error);