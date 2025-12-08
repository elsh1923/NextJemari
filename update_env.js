const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const newDbUrl = 'postgresql://neondb_owner:npg_MJ8vkN1qusyw@ep-divine-dew-a4iekcpi-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const authUrl = 'http://localhost:3000';

try {
  let content = '';
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8');
    console.log('Read existing .env');
  } else {
    console.log('Creating new .env');
  }

  // Helper to update or add a key
  const updateKey = (key, value) => {
    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}="${value}"`);
      console.log(`Updated ${key}`);
    } else {
      content += `\n${key}="${value}"`;
      console.log(`Added ${key}`);
    }
  };

  updateKey('DATABASE_URL', newDbUrl);
  updateKey('BETTER_AUTH_URL', authUrl);
  
  // Also add NEXTAUTH_URL since they are using next-auth
  updateKey('NEXTAUTH_URL', authUrl);
  // And NEXTAUTH_SECRET if missing (generate random one if needed, but for now just leave if exists, or warn)
  
  // Ensure we don't have multiple newlines
  content = content.replace(/\n\n\n+/g, '\n\n');

  fs.writeFileSync(envPath, content.trim() + '\n');
  console.log('Successfully updated .env');

} catch (err) {
  console.error('Error updating .env:', err);
}
