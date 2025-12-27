# Byzantine Paralage - AWS Infrastructure

AWS CDK infrastructure for deploying the Byzantine Paralage Teaching App to AWS using S3 + CloudFront.

## Architecture

The infrastructure uses:
- **S3 Bucket**: Hosts the static website files
- **CloudFront**: CDN for fast global delivery with HTTPS
- **Origin Access Identity**: Secure access from CloudFront to S3

## Prerequisites

1. **AWS Account**: You need an AWS account
2. **AWS CLI**: Installed and configured with credentials
   ```bash
   aws configure
   ```
3. **Node.js**: Version 18.x or higher
4. **AWS CDK CLI**: Install globally
   ```bash
   npm install -g aws-cdk
   ```

## Setup

### 1. Install Dependencies

```bash
cd infrastructure
npm install
```

### 2. Bootstrap CDK (First Time Only)

Bootstrap your AWS account for CDK deployments:

```bash
npm run bootstrap
```

Or with specific account/region:

```bash
cdk bootstrap aws://ACCOUNT-NUMBER/REGION
```

### 3. Build the Application

Before deploying, build the React app:

```bash
cd ../app
npm install
npm run build
cd ../infrastructure
```

## Deployment

### Deploy the Stack

```bash
npm run deploy
```

Or use the CDK CLI directly:

```bash
cdk deploy
```

This will:
1. Create an S3 bucket
2. Deploy the built application files
3. Create a CloudFront distribution
4. Output the website URL

### View the Diff

To see what changes will be made before deploying:

```bash
npm run diff
```

### Synthesize CloudFormation Template

To generate the CloudFormation template without deploying:

```bash
npm run synth
```

## Accessing the Application

After deployment, the CloudFormation outputs will show:
- **WebsiteURL**: The HTTPS URL to access your application
- **CloudFrontDomain**: The CloudFront domain name
- **BucketName**: The S3 bucket hosting your files
- **DistributionId**: The CloudFront distribution ID

Example output:
```
Outputs:
ByzantineParalageStack.WebsiteURL = https://d1234abcd.cloudfront.net
ByzantineParalageStack.CloudFrontDomain = d1234abcd.cloudfront.net
ByzantineParalageStack.BucketName = byzantine-paralage-123456789012
ByzantineParalageStack.DistributionId = E1234ABCD5678
```

## Updating the Application

To deploy updates:

1. Build the updated application:
   ```bash
   cd ../app
   npm run build
   cd ../infrastructure
   ```

2. Deploy the changes:
   ```bash
   npm run deploy
   ```

CloudFront cache will be automatically invalidated during deployment.

## Cost Estimation

### AWS Free Tier
- **S3**: 5GB storage, 20,000 GET requests, 2,000 PUT requests per month
- **CloudFront**: 1TB data transfer out, 10,000,000 HTTP/HTTPS requests per month
- **Route53**: Not included (if you add custom domain)

### After Free Tier
- **S3**: ~$0.023 per GB/month
- **CloudFront**: ~$0.085 per GB for first 10TB
- **Request Pricing**: Minimal for a small static site

For a small educational app with moderate traffic, expect $1-5/month.

## Destroying the Stack

To remove all resources:

```bash
npm run destroy
```

Or:

```bash
cdk destroy
```

⚠️ **Warning**: This will delete the S3 bucket and all files. Make sure you have backups if needed.

## Customization

### Custom Domain

To add a custom domain:

1. Update `lib/byzantine-paralage-stack.ts`:
   ```typescript
   new ByzantineParalageStack(app, 'ByzantineParalageStack', {
     domainName: 'paralage.yourdomain.com',
     // ... other props
   });
   ```

2. Add Route53 hosted zone and ACM certificate configuration in the stack

### Environment Variables

Set environment variables for different deployments:

```bash
export ENVIRONMENT=production
export AWS_REGION=us-east-1
npm run deploy
```

### Multiple Environments

Deploy to different environments:

```bash
# Development
cdk deploy ByzantineParalageDev --context environment=dev

# Production
cdk deploy ByzantineParalageProd --context environment=prod
```

## Project Structure

```
infrastructure/
├── bin/
│   └── app.ts              # CDK app entry point
├── lib/
│   └── byzantine-paralage-stack.ts  # Main stack definition
├── cdk.json                # CDK configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # npm dependencies and scripts
└── README.md              # This file
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run watch` | Watch for changes and compile |
| `npm run deploy` | Deploy the stack to AWS |
| `npm run destroy` | Remove the stack from AWS |
| `npm run diff` | Compare deployed stack with current state |
| `npm run synth` | Emit the synthesized CloudFormation template |
| `npm run bootstrap` | Bootstrap CDK in your AWS account |

## Troubleshooting

### "Need to perform AWS calls for account"

Run `cdk bootstrap` first to set up CDK in your AWS account.

### "Unable to resolve AWS account"

Make sure your AWS CLI is configured:
```bash
aws configure
aws sts get-caller-identity
```

### CloudFront Distribution Not Updating

CloudFront caching can take time. Manually invalidate if needed:
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Build Errors

Make sure the app is built before deploying:
```bash
cd ../app
npm run build
cd ../infrastructure
```

## Security

- S3 bucket blocks all public access
- CloudFront uses HTTPS only
- Origin Access Identity restricts S3 access to CloudFront only
- No secrets or credentials stored in the infrastructure code

## Monitoring

View CloudFront metrics in AWS Console:
- Requests
- Bytes downloaded
- Error rates
- Cache hit ratio

Enable CloudFront access logs for detailed analytics (additional cost).

## Support

For issues with:
- **Infrastructure**: Check CloudFormation console for stack events
- **Application**: See the main project README
- **AWS Costs**: Use AWS Cost Explorer in the AWS Console
