# Email and AI Integration Guide

This guide demonstrates how to properly set up email and AI integrations in n8n, specifically for connecting email accounts with Perplexity AI.

## Overview

n8n provides robust support for both email operations and AI services like Perplexity. This guide shows how to:

1. Configure email credentials (SMTP, IMAP)
2. Set up Perplexity AI credentials
3. Create workflows that combine email and AI functionality

## Prerequisites

- n8n instance (self-hosted or cloud)
- Email account with SMTP/IMAP access
- Perplexity AI API key

## 1. Setting Up Email Credentials

### SMTP Configuration (for sending emails)

1. Navigate to **Settings** > **Credentials** in your n8n instance
2. Click **Create Credential** and select **SMTP**
3. Configure the following:
   - **User**: Your email address (e.g., your.email@gmail.com)
   - **Password**: Your email password or app-specific password
   - **Host**: SMTP server (e.g., smtp.gmail.com for Gmail)
   - **Port**: 587 (for STARTTLS) or 465 (for SSL)
   - **SSL/TLS**: Enable for secure connections

### Example Gmail SMTP Settings
```
Host: smtp.gmail.com
Port: 587
SSL/TLS: true
User: your.email@gmail.com
Password: your-app-password
```

### IMAP Configuration (for reading emails)

1. Create a new credential and select **IMAP**
2. Configure:
   - **User**: Your email address
   - **Password**: Your email password or app-specific password
   - **Host**: IMAP server (e.g., imap.gmail.com for Gmail)
   - **Port**: 993 (SSL) or 143 (STARTTLS)
   - **Secure**: Enable for SSL connections

## 2. Setting Up Perplexity AI Credentials

1. Go to [Perplexity AI API](https://www.perplexity.ai/) and get your API key
2. In n8n, create a new credential and select **Perplexity API**
3. Enter your API key in the **API Key** field

## 3. Example Workflows

### Workflow 1: AI-Powered Email Response

This workflow reads incoming emails and generates AI responses using Perplexity.

```json
{
  "name": "AI Email Assistant",
  "nodes": [
    {
      "name": "Email Trigger",
      "type": "n8n-nodes-base.emailReadImap",
      "parameters": {
        "mailbox": "INBOX",
        "format": "simple"
      },
      "credentials": {
        "imap": "your-imap-credential"
      }
    },
    {
      "name": "Perplexity Analysis",
      "type": "n8n-nodes-base.perplexity",
      "parameters": {
        "model": "sonar-pro",
        "messages": [
          {
            "role": "system",
            "content": "You are a helpful email assistant. Provide concise, professional responses."
          },
          {
            "role": "user",
            "content": "{{ $json.text }}"
          }
        ]
      },
      "credentials": {
        "perplexityApi": "your-perplexity-credential"
      }
    },
    {
      "name": "Send Response",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "toEmail": "{{ $('Email Trigger').first().json.from }}",
        "subject": "Re: {{ $('Email Trigger').first().json.subject }}",
        "text": "{{ $json.choices[0].message.content }}"
      },
      "credentials": {
        "smtp": "your-smtp-credential"
      }
    }
  ]
}
```

### Workflow 2: Email Content Summarization

This workflow processes emails and creates AI-generated summaries.

```json
{
  "name": "Email Summarizer",
  "nodes": [
    {
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger"
    },
    {
      "name": "Read Emails",
      "type": "n8n-nodes-base.emailReadImap",
      "parameters": {
        "mailbox": "INBOX",
        "format": "simple",
        "options": {
          "downloadAttachments": false
        }
      }
    },
    {
      "name": "Summarize with AI",
      "type": "n8n-nodes-base.perplexity",
      "parameters": {
        "model": "sonar-reasoning",
        "messages": [
          {
            "role": "system",
            "content": "Summarize the following email content in 2-3 sentences, highlighting key points and action items."
          },
          {
            "role": "user",
            "content": "Subject: {{ $json.subject }}\nFrom: {{ $json.from }}\nContent: {{ $json.text }}"
          }
        ],
        "options": {
          "temperature": 0.3,
          "maxTokens": 150
        }
      }
    }
  ]
}
```

## 4. Security Best Practices

- **Never hardcode credentials** in workflows or configuration files
- Use **app-specific passwords** for email accounts when possible
- Store credentials securely using n8n's credential management system
- Regularly rotate API keys and passwords
- Use environment variables for sensitive configuration in self-hosted instances

## 5. Advanced Features

### Using Perplexity Features
- **Citations**: Enable `return_related_questions` for additional context
- **Domain Filtering**: Use `search_domain_filter` to limit sources
- **Recency**: Set `search_recency` for time-sensitive queries

### Email Processing
- **Filters**: Use email filters to process specific types of messages
- **Attachments**: Handle file attachments in email workflows
- **Batch Processing**: Process multiple emails efficiently

## 6. Troubleshooting

### Common Issues

**Email Connection Failed**
- Verify SMTP/IMAP settings
- Check if 2FA requires app-specific passwords
- Ensure less secure app access is enabled (if required)

**Perplexity API Errors**
- Verify API key is correct and active
- Check API rate limits and usage
- Ensure model availability

**Workflow Execution Issues**
- Check credential permissions
- Verify node configuration
- Review execution logs for specific error messages

## Conclusion

This guide provides a foundation for integrating email and AI functionality in n8n. The combination of email processing and AI analysis opens up many possibilities for automation, from intelligent email responses to content analysis and workflow optimization.

Remember to always follow security best practices and test workflows thoroughly before deploying them in production environments.