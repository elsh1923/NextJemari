const fetch = require('node-fetch'); // Assuming node-fetch is available or using built-in fetch in newer Node

async function testRegister() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_api_user@example.com',
        username: 'test_api_user',
        password: 'password123'
      })
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    const text = await response.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

// Check if node-fetch is needed or if global fetch exists (Node 18+)
if (!global.fetch) {
  console.log('Global fetch not found, this script might fail if node-fetch is not installed.');
  // You might want to use http module if fetch is not available
}

testRegister();
