#!/usr/bin/env node

/**
 * CDK App Entry Point for Byzantine Paralage Infrastructure
 *
 * This file initializes the CDK app and creates the Lightsail stack
 */

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ByzantineParalageStack } from '../lib/byzantine-paralage-stack';

/**
 * Main application entry point
 * Creates and configures the CDK app and stacks
 */
const app = new cdk.App();

/**
 * Create the Lightsail stack for hosting the Byzantine Paralage app
 */
new ByzantineParalageStack(app, 'ByzantineParalageStack', {
  /**
   * Environment configuration
   * Set via AWS_ACCOUNT_ID and AWS_REGION environment variables
   * or use default values
   */
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID,
    region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || 'us-east-1',
  },

  /**
   * Stack description
   */
  description: 'Byzantine Paralage Teaching App - Static Site Hosting on AWS Lightsail',

  /**
   * Tags for resource organization and cost tracking
   */
  tags: {
    Project: 'ByzantineParalage',
    Environment: process.env.ENVIRONMENT || 'production',
    ManagedBy: 'CDK',
  },
});

// Synthesize the CloudFormation template
app.synth();
