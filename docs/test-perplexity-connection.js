#!/usr/bin/env node
/**
 * Simple test script to verify Perplexity API credentials
 * Usage: node test-perplexity-connection.js <your-api-key>
 */

const https = require('https');

function testPerplexityConnection(apiKey) {
  if (!apiKey) {
    console.error('Usage: node test-perplexity-connection.js <your-api-key>');
    process.exit(1);
  }

  const data = JSON.stringify({
    model: 'sonar',
    messages: [
      {
        role: 'user',
        content: 'Hello, this is a connection test. Please respond with "Connection successful!"'
      }
    ],
    max_tokens: 10
  });

  const options = {
    hostname: 'api.perplexity.ai',
    port: 443,
    path: '/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': data.length
    }
  };

  console.log('Testing Perplexity API connection...');

  const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(responseData);
        
        if (res.statusCode === 200) {
          console.log('✅ Connection successful!');
          console.log('Model:', response.model);
          console.log('Response:', response.choices?.[0]?.message?.content);
        } else {
          console.log('❌ Connection failed!');
          console.log('Status:', res.statusCode);
          console.log('Error:', response.error?.message || responseData);
        }
      } catch (error) {
        console.log('❌ Failed to parse response:', error.message);
        console.log('Raw response:', responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request failed:', error.message);
  });

  req.write(data);
  req.end();
}

// Get API key from command line argument
const apiKey = process.argv[2];
testPerplexityConnection(apiKey);