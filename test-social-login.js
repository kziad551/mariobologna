// test-social-login.js - A script to test the social login flow without using the frontend

const fetch = require('node-fetch');

// Function to simulate a Google user
function createMockGoogleUser(isNewUser = true) {
  // Generate a random email if testing a new user
  const email = isNewUser 
    ? `test${Date.now()}@example.com` 
    : 'your-existing-test@example.com'; // Use a known email for testing sign in
  
  return {
    uid: `google-uid-${Date.now()}`,
    email: email,
    displayName: 'Test User',
    getIdToken: async () => `mock-token-${Date.now()}`
  };
}

// Test signup flow
async function testSignup() {
  console.log('Testing signup flow...');
  const mockUser = createMockGoogleUser(true);
  
  try {
    const response = await fetch('http://localhost:3000/account/authentication/social_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName
        },
        isSignUp: true
      })
    });
    
    const data = await response.json();
    console.log('Signup Response:', data);
    console.log('Status:', response.status);
    console.log('Headers:', response.headers.get('Set-Cookie'));
    
    return data;
  } catch (error) {
    console.error('Signup Error:', error);
  }
}

// Test signin flow
async function testSignin() {
  console.log('Testing signin flow...');
  const mockUser = createMockGoogleUser(false);
  
  try {
    const response = await fetch('http://localhost:3000/account/authentication/social_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName
        },
        isSignUp: false
      })
    });
    
    const data = await response.json();
    console.log('Signin Response:', data);
    console.log('Status:', response.status);
    console.log('Headers:', response.headers.get('Set-Cookie'));
    
    return data;
  } catch (error) {
    console.error('Signin Error:', error);
  }
}

// Run the tests
async function runTests() {
  // Uncomment the test you want to run
  await testSignup();
  // await testSignin();
}

runTests(); 