# Email and AI Integration for n8n

This directory contains documentation and examples for integrating email functionality with AI services (specifically Perplexity AI) in n8n.

## 🚀 Quick Start

### Problem Statement Solution

If you're looking to connect your email account with AI functionality in n8n, this guide provides the complete solution. **Important**: Credentials should never be hardcoded in the source code - they are configured through n8n's secure credential management system.

### What's Included

1. **[Integration Guide](./email-ai-integration-guide.md)** - Complete setup instructions
2. **[Example Workflow](./email-ai-workflow-example.json)** - Ready-to-import workflow
3. **[Test Scripts](./test-perplexity-connection.js)** - Credential validation tools
4. **Security Best Practices** - How to safely configure credentials

## 📋 Prerequisites

- n8n instance (self-hosted or cloud)
- Email account with SMTP/IMAP access
- Perplexity AI Pro account and API key

## 🔧 How to Configure Your Credentials

### For Email (example: Gmail)

1. **Generate App Password** (if using 2FA):
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password

2. **Configure SMTP in n8n**:
   - Go to Settings > Credentials
   - Create new "SMTP" credential
   - Use your email and app password (NOT your regular password)

3. **Configure IMAP in n8n**:
   - Create new "IMAP" credential
   - Use the same email and app password

### For Perplexity AI

1. **Get API Key**:
   - Visit [Perplexity AI](https://www.perplexity.ai/)
   - Go to your account settings
   - Generate an API key

2. **Configure in n8n**:
   - Create new "Perplexity API" credential
   - Enter your API key

### 🧪 Test Your Credentials

Before setting up in n8n, you can test your credentials using the provided scripts:

```bash
# Test Perplexity API connection
node test-perplexity-connection.js your-api-key-here

# Test email SMTP connection
node test-email-connection.js your.email@gmail.com your-app-password smtp.gmail.com 587
```

**Note**: These scripts require Node.js and the `nodemailer` package for email testing.

## 📤 Import Example Workflow

1. Copy the content of `email-ai-workflow-example.json`
2. In n8n, go to Workflows > Import from File
3. Paste the JSON content
4. Update the credential references to your actual credentials
5. Test the workflow

## 🛡️ Security Notes

- **Never commit real credentials to version control**
- **Use app-specific passwords for email accounts**
- **Regularly rotate API keys**
- **Test credentials in a safe environment first**

## 📧 Example Use Cases

1. **Automated Email Analysis**: Analyze incoming emails for sentiment and priority
2. **AI-Powered Responses**: Generate draft responses using AI
3. **Email Summarization**: Create summaries of long email threads
4. **Smart Notifications**: Send alerts for urgent or important emails
5. **Content Extraction**: Extract and process specific information from emails

## 🔍 Troubleshooting

### Email Connection Issues
- Check SMTP/IMAP settings
- Verify app passwords are used correctly
- Ensure 2FA is properly configured

### AI API Issues
- Verify API key is active
- Check rate limits and quotas
- Ensure model availability

### Workflow Issues
- Check node connections
- Verify credential assignments
- Review execution logs

## 📚 Additional Resources

- [n8n Email Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.emailsend/)
- [Perplexity AI API Documentation](https://docs.perplexity.ai/)
- [n8n Workflow Examples](https://n8n.io/workflows/)

## 🤝 Contributing

If you have improvements or additional examples, please contribute them back to the community following n8n's contribution guidelines.

---

**Note**: This integration demonstrates how to properly connect email and AI services in n8n without compromising security. Always follow best practices for credential management.