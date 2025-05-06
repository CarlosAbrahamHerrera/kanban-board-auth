import crypto from 'crypto';

// Generate a random 64-character hex string for use as a JWT secret
const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

const secret = generateSecret();
console.log('Generated JWT Secret:');
console.log(secret);
console.log('\nAdd this to your .env file:');
console.log(`JWT_SECRET=${secret}`);

// Run this file with: node src/utils/generateSecret.js 