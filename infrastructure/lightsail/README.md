# AWS Lightsail Container Deployment

This directory contains scripts and configuration for deploying the Byzantine Paralage app to AWS Lightsail using containers.

## Overview

**Note**: We recommend using the CDK deployment (parent directory) for easier management. This Lightsail option is available if you specifically want to use Lightsail containers.

### Architecture

- **Container**: Nginx serving the static React app
- **Lightsail Container Service**: Managed container hosting
- **Public Endpoint**: HTTPS-enabled endpoint with health checks

## Prerequisites

1. **AWS Account** with Lightsail access
2. **AWS CLI** installed and configured
3. **Docker** installed locally
4. **Node.js** 18.x or higher

## Setup

### 1. Create Lightsail Container Service

First, create the container service in AWS:

```bash
aws lightsail create-container-service \
  --service-name byzantine-paralage-service \
  --power nano \
  --scale 1 \
  --region us-east-1
```

**Power options:**
- `nano`: 512 MB RAM, 0.25 vCPU - $7/month
- `micro`: 1 GB RAM, 0.5 vCPU - $10/month
- `small`: 2 GB RAM, 1 vCPU - $40/month

Wait for the service to be active:
```bash
aws lightsail get-container-services \
  --service-name byzantine-paralage-service \
  --query 'containerServices[0].state'
```

### 2. Configure Environment Variables

Set these environment variables (or edit deploy.sh):

```bash
export AWS_REGION="us-east-1"
export LIGHTSAIL_SERVICE_NAME="byzantine-paralage-service"
```

### 3. Deploy the Application

Run the deployment script:

```bash
cd infrastructure/lightsail
./deploy.sh
```

This will:
1. Build the React application
2. Create a Docker image with nginx
3. Push the image to Lightsail
4. Deploy the container
5. Configure the public endpoint

## Deployment Process

The deployment script performs these steps:

1. **Prerequisites Check** - Verifies AWS CLI and Docker are installed
2. **Build App** - Runs `npm run build` in the app directory
3. **Build Docker Image** - Creates optimized nginx container
4. **Push to Lightsail** - Uploads image to Lightsail registry
5. **Deploy** - Creates/updates the container deployment

## Configuration Files

### containers.json

Defines the container configuration:
- Container name: `app`
- Port mapping: 80 (HTTP)
- Environment variables

### public-endpoint.json

Configures the public endpoint:
- Health check path: `/health`
- Port: 80
- Health check intervals

## Accessing the Application

After deployment, get your application URL:

```bash
aws lightsail get-container-services \
  --service-name byzantine-paralage-service \
  --query 'containerServices[0].url' \
  --output text
```

The URL will be in format: `https://byzantine-paralage-service.xxxxx.us-east-1.cs.amazonlightsail.com`

## Updating the Application

To deploy updates:

```bash
cd infrastructure/lightsail
./deploy.sh
```

The script handles versioning automatically. Lightsail keeps the previous version for rollback.

## Monitoring

### View Container Logs

```bash
aws lightsail get-container-log \
  --service-name byzantine-paralage-service \
  --container-name app
```

### Check Service Status

```bash
aws lightsail get-container-services \
  --service-name byzantine-paralage-service
```

### View Metrics

Access the Lightsail console to view:
- CPU utilization
- Memory usage
- Network traffic
- HTTP response codes

## Rollback

If you need to rollback to a previous version:

```bash
# List deployments
aws lightsail get-container-service-deployments \
  --service-name byzantine-paralage-service

# Note the previous deployment version number, then redeploy it
aws lightsail create-container-service-deployment \
  --service-name byzantine-paralage-service \
  --containers file://containers.json \
  --public-endpoint file://public-endpoint.json
```

## Scaling

To scale up or down:

```bash
# Update to 2 instances
aws lightsail update-container-service \
  --service-name byzantine-paralage-service \
  --scale 2

# Change power level to micro
aws lightsail update-container-service \
  --service-name byzantine-paralage-service \
  --power micro
```

## Cost Estimation

**Container Service Costs** (per month):
- Nano (512 MB, 0.25 vCPU): $7
- Micro (1 GB, 0.5 vCPU): $10
- Small (2 GB, 1 vCPU): $40

**Data Transfer**:
- First 500 GB/month: Free
- Additional: $0.09/GB

**Typical cost for this app**: $7-10/month

## Cleanup

To delete the Lightsail service:

```bash
aws lightsail delete-container-service \
  --service-name byzantine-paralage-service
```

⚠️ This will delete all deployments and stop serving the application.

## Troubleshooting

### Container fails to start

Check the logs:
```bash
aws lightsail get-container-log \
  --service-name byzantine-paralage-service \
  --container-name app \
  --start-time $(date -u -d '5 minutes ago' '+%s')
```

### Health check failing

Verify the health check endpoint works:
```bash
# Get the service URL
URL=$(aws lightsail get-container-services \
  --service-name byzantine-paralage-service \
  --query 'containerServices[0].url' \
  --output text)

# Test health endpoint
curl ${URL}/health
```

### Deployment stuck

Force a new deployment:
```bash
aws lightsail create-container-service-deployment \
  --service-name byzantine-paralage-service \
  --containers file://containers.json \
  --public-endpoint file://public-endpoint.json
```

### Image push fails

Check your AWS credentials:
```bash
aws sts get-caller-identity
```

Verify the service exists:
```bash
aws lightsail get-container-services \
  --service-name byzantine-paralage-service
```

## Docker Image Details

The Docker image uses:
- **Base**: `node:18-alpine` for building
- **Server**: `nginx:alpine` for serving
- **Multi-stage build**: Optimized image size (~25 MB)
- **Health check**: Built-in health endpoint at `/health`
- **Compression**: Gzip enabled for all text assets
- **Caching**: Optimized cache headers for static assets

## Comparison: Lightsail vs CDK

| Feature | Lightsail | CDK (S3+CloudFront) |
|---------|-----------|---------------------|
| Monthly Cost | $7-10 | $1-5 |
| Setup Complexity | Medium | Low |
| Scaling | Manual | Automatic |
| Global CDN | No | Yes |
| Management | Container-based | Serverless |
| Best For | Simple apps | Production sites |

**Recommendation**: Use the CDK deployment in the parent directory for better cost efficiency and global performance.

## Additional Resources

- [AWS Lightsail Container Documentation](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-container-services.html)
- [Lightsail Pricing](https://aws.amazon.com/lightsail/pricing/)
- [Docker Documentation](https://docs.docker.com/)
