# Offline Deployment Guide

This guide explains how to deploy and run n8n in offline or air-gapped environments where internet connectivity is limited or unavailable.

## Overview

n8n can be configured to run in offline mode for environments that require air-gapped deployment or have limited internet connectivity. This is particularly useful for:

- Enterprise environments with strict security policies
- Government or regulated industries
- Development environments without internet access
- Mobile or edge deployments with unreliable connectivity

## Configuration

### Enable Offline Mode

Set the following environment variable to enable offline mode:

```bash
N8N_OFFLINE_MODE=true
```

This will:
- Disable automatic version checks
- Skip external service integrations that require internet
- Use local resources wherever possible
- Disable telemetry and analytics

### Docker Deployment

For offline Docker deployment:

```bash
# Create a local volume for data persistence
docker volume create n8n_data

# Run n8n in offline mode
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e N8N_OFFLINE_MODE=true \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

### Docker Compose

For production offline deployment with docker-compose:

```yaml
version: '3.8'

services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_OFFLINE_MODE=true
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=n8n
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=n8n
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  n8n_data:
  postgres_data:
```

## Offline Installation

### Prerequisites

1. Pre-download Docker images in an environment with internet access
2. Transfer images to the offline environment
3. Load images into Docker

### Steps

1. **Download images** (on a machine with internet):
```bash
docker pull docker.n8n.io/n8nio/n8n:latest
docker pull postgres:13
docker save -o n8n-offline-images.tar docker.n8n.io/n8nio/n8n:latest postgres:13
```

2. **Transfer to offline environment**:
```bash
# Copy the tar file to your offline environment
scp n8n-offline-images.tar user@offline-server:/tmp/
```

3. **Load images** (on offline machine):
```bash
docker load -i /tmp/n8n-offline-images.tar
```

4. **Deploy using docker-compose** as shown above.

## Limitations in Offline Mode

When running in offline mode, the following features will be disabled or limited:

### Disabled Features
- Automatic version update notifications
- Community node installation from npm registry
- External webhook testing tools
- Cloud-based integrations that require internet access
- Telemetry and usage analytics

### Limited Features
- Some nodes may have reduced functionality if they rely on external APIs
- Documentation links may not work
- Template sharing and import from community

### Workarounds
- **Custom nodes**: Install custom nodes by mounting them as volumes or including them in a custom Docker image
- **Documentation**: Host local documentation or use offline copies
- **Templates**: Export and import workflows manually

## Best Practices

1. **Database**: Use a local database (PostgreSQL/MySQL) instead of SQLite for production
2. **Backups**: Regularly backup the `/home/node/.n8n` directory
3. **Security**: Ensure proper network isolation and access controls
4. **Monitoring**: Implement local monitoring solutions
5. **Updates**: Plan for manual updates by rebuilding images

## Troubleshooting

### Common Issues

1. **Node installation fails**:
   - Pre-install required community nodes in a custom Docker image
   - Use only built-in nodes in offline environments

2. **Webhook testing not working**:
   - Use local testing tools or curl commands
   - Set up local webhook endpoints for testing

3. **Templates not loading**:
   - Export templates from an online environment
   - Import manually using the n8n interface

### Support

For offline deployment support:
- Check the [n8n documentation](https://docs.n8n.io)
- Visit the [community forum](https://community.n8n.io) (when online)
- Review [server setup examples](https://docs.n8n.io/hosting/installation/server-setups/)