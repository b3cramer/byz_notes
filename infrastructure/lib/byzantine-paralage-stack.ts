/**
 * Byzantine Paralage CDK Stack
 *
 * This stack creates the infrastructure for hosting the Byzantine Paralage app on AWS
 * Uses S3 + CloudFront for static site hosting (Lightsail doesn't have direct CDK support)
 */

import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

/**
 * Props for the Byzantine Paralage Stack
 */
export interface ByzantineParalageStackProps extends cdk.StackProps {
  /**
   * Custom domain name for the application (optional)
   */
  domainName?: string;
}

/**
 * Main stack for the Byzantine Paralage application
 * Creates S3 bucket, CloudFront distribution, and deploys the static site
 */
export class ByzantineParalageStack extends cdk.Stack {
  /**
   * The S3 bucket hosting the static website
   */
  public readonly websiteBucket: s3.Bucket;

  /**
   * The CloudFront distribution for CDN delivery
   */
  public readonly distribution: cloudfront.Distribution;

  /**
   * Constructor for the Byzantine Paralage Stack
   * @param scope - CDK app scope
   * @param id - Stack identifier
   * @param props - Stack properties
   */
  constructor(scope: Construct, id: string, props?: ByzantineParalageStackProps) {
    super(scope, id, props);

    /**
     * Create S3 bucket for hosting static website
     * Configured with:
     * - Versioning enabled for rollback capability
     * - Encryption at rest
     * - Block public access (CloudFront will access via OAI)
     * - Automatic deletion on stack destroy (for dev/staging)
     */
    this.websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `byzantine-paralage-${this.account}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
    });

    /**
     * Create Origin Access Identity for CloudFront to access S3
     */
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'OriginAccessIdentity',
      {
        comment: 'OAI for Byzantine Paralage CloudFront distribution',
      }
    );

    /**
     * Grant CloudFront read access to the S3 bucket
     */
    this.websiteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [this.websiteBucket.arnForObjects('*')],
        principals: [
          new iam.CanonicalUserPrincipal(
            originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    /**
     * Create CloudFront distribution for CDN delivery
     * Configured with:
     * - HTTPS redirect
     * - Gzip compression
     * - Caching optimized for static assets
     * - Custom error pages for SPA routing
     */
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(this.websiteBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // Use only North America and Europe
      comment: 'Byzantine Paralage Teaching App CDN',
    });

    /**
     * Deploy the built application to S3
     * Source: ../app/dist (Vite build output)
     */
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../app/dist'))],
      destinationBucket: this.websiteBucket,
      distribution: this.distribution,
      distributionPaths: ['/*'],
      prune: true, // Remove old files
      memoryLimit: 512,
    });

    /**
     * CloudFormation Outputs
     */

    // S3 Bucket Name
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.websiteBucket.bucketName,
      description: 'S3 Bucket hosting the static website',
      exportName: 'ByzantineParalageBucketName',
    });

    // CloudFront Distribution ID
    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront Distribution ID',
      exportName: 'ByzantineParalageDistributionId',
    });

    // Website URL
    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://${this.distribution.distributionDomainName}`,
      description: 'Byzantine Paralage App URL',
      exportName: 'ByzantineParalageURL',
    });

    // CloudFront Domain Name
    new cdk.CfnOutput(this, 'CloudFrontDomain', {
      value: this.distribution.distributionDomainName,
      description: 'CloudFront distribution domain name',
      exportName: 'ByzantineParalageCFDomain',
    });
  }
}
