const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '.env');
const secret = crypto.randomBytes(32).toString('hex');

try {
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  
  if (content.includes('NEXTAUTH_SECRET=')) {
    console.log('NEXTAUTH_SECRET already exists, not updating.');
  } else {
    content += `\nNEXTAUTH_SECRET="${secret}"\n`;
    fs.writeFileSync(envPath, content);
    console.log('Added NEXTAUTH_SECRET to .env');
  }
} catch (err) {
  console.error('Error updating .env:', err);
}
