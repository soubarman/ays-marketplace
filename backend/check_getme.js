const http = require('http');

async function testGetMe() {
  const loginData = JSON.stringify({
    email: 'soubarman62@gmail.com',
    password: 'password' // We will bypass password or just hope it's 'password'. Actually, let's login by generating our own token!
  });
}

testGetMe();
