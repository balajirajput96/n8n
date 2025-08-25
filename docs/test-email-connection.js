#!/usr/bin/env node
/**
 * Simple test script to verify SMTP email credentials
 * Usage: node test-email-connection.js <email> <password> <smtp-host> <port>
 * Example: node test-email-connection.js test@gmail.com mypassword smtp.gmail.com 587
 */

const nodemailer = require('nodemailer');

function testEmailConnection(email, password, host, port) {
  if (!email || !password || !host || !port) {
    console.error('Usage: node test-email-connection.js <email> <password> <smtp-host> <port>');
    console.error('Example: node test-email-connection.js test@gmail.com mypassword smtp.gmail.com 587');
    process.exit(1);
  }

  console.log('Testing SMTP connection...');
  console.log(`Host: ${host}:${port}`);
  console.log(`Email: ${email}`);

  const transporter = nodemailer.createTransporter({
    host: host,
    port: parseInt(port),
    secure: port === '465', // true for 465, false for other ports
    auth: {
      user: email,
      pass: password,
    },
  });

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ SMTP connection failed!');
      console.log('Error:', error.message);
      
      // Provide helpful suggestions based on common errors
      if (error.message.includes('Invalid login')) {
        console.log('\n💡 Suggestions:');
        console.log('- For Gmail: Use an "App Password" instead of your regular password');
        console.log('- Enable 2-factor authentication and generate an app password');
        console.log('- Check if "Less secure app access" is enabled (if not using 2FA)');
      } else if (error.message.includes('ENOTFOUND')) {
        console.log('\n💡 Suggestions:');
        console.log('- Check the SMTP host address');
        console.log('- Verify internet connection');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.log('\n💡 Suggestions:');
        console.log('- Check the port number');
        console.log('- Try port 587 (STARTTLS) or 465 (SSL) for most providers');
      }
    } else {
      console.log('✅ SMTP connection successful!');
      console.log('Server is ready to take our messages');
      
      // Optionally send a test email
      console.log('\nTo send a test email, uncomment the sendTestEmail() call in the script');
    }
    
    transporter.close();
  });
}

function sendTestEmail(transporter, fromEmail, toEmail) {
  const mailOptions = {
    from: fromEmail,
    to: toEmail || fromEmail, // Send to self if no recipient specified
    subject: 'n8n Email Connection Test',
    text: 'This is a test email sent from the n8n email connection test script.',
    html: '<p>This is a test email sent from the <strong>n8n email connection test script</strong>.</p>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('❌ Failed to send test email:', error.message);
    } else {
      console.log('✅ Test email sent successfully!');
      console.log('Message ID:', info.messageId);
    }
  });
}

// Get credentials from command line arguments
const [, , email, password, host, port] = process.argv;
testEmailConnection(email, password, host, port);