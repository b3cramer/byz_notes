#!/bin/bash

#####################################################################
# Full Deployment Script for Byzantine Paralage App
#
# This script:
# 1. Builds the React application
# 2. Deploys the infrastructure using AWS CDK
#
# Usage:
#   ./deploy-full.sh [environment]
#
# Examples:
#   ./deploy-full.sh              # Deploy to default environment
#   ./deploy-full.sh production   # Deploy to production
#####################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-production}"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
APP_DIR="$PROJECT_ROOT/app"

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo_step() {
    echo -e "\n${BLUE}==>${NC} $1\n"
}

# Check prerequisites
check_prerequisites() {
    echo_step "Checking prerequisites..."

    if ! command -v node &> /dev/null; then
        echo_error "Node.js is not installed. Please install it first."
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        echo_error "npm is not installed. Please install it first."
        exit 1
    fi

    if ! command -v aws &> /dev/null; then
        echo_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi

    if ! command -v cdk &> /dev/null; then
        echo_error "AWS CDK is not installed. Install with: npm install -g aws-cdk"
        exit 1
    fi

    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        echo_error "AWS credentials not configured. Run 'aws configure' first."
        exit 1
    fi

    echo_info "All prerequisites satisfied"
}

# Build the React application
build_app() {
    echo_step "Building React application..."

    cd "$APP_DIR"

    echo_info "Installing dependencies..."
    npm install

    echo_info "Building production bundle..."
    npm run build

    if [ ! -d "dist" ]; then
        echo_error "Build failed - dist directory not found"
        exit 1
    fi

    echo_info "Application built successfully"
    cd "$SCRIPT_DIR"
}

# Deploy infrastructure with CDK
deploy_infrastructure() {
    echo_step "Deploying infrastructure with AWS CDK..."

    # Set environment variable
    export ENVIRONMENT="$ENVIRONMENT"

    # Check if CDK is bootstrapped
    echo_info "Checking CDK bootstrap status..."
    if ! aws cloudformation describe-stacks --stack-name CDKToolkit &> /dev/null; then
        echo_warn "CDK not bootstrapped in this account/region"
        echo_info "Running CDK bootstrap..."
        npm run bootstrap
    fi

    # Deploy the stack
    echo_info "Deploying CDK stack..."
    npm run deploy -- --require-approval never

    echo_info "Infrastructure deployed successfully"
}

# Display outputs
display_outputs() {
    echo_step "Deployment Complete!"

    echo_info "Fetching stack outputs..."

    # Get CloudFormation outputs
    WEBSITE_URL=$(aws cloudformation describe-stacks \
        --stack-name ByzantineParalageStack \
        --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
        --output text 2>/dev/null || echo "N/A")

    CF_DOMAIN=$(aws cloudformation describe-stacks \
        --stack-name ByzantineParalageStack \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomain`].OutputValue' \
        --output text 2>/dev/null || echo "N/A")

    BUCKET_NAME=$(aws cloudformation describe-stacks \
        --stack-name ByzantineParalageStack \
        --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
        --output text 2>/dev/null || echo "N/A")

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          Byzantine Paralage - Deployment Summary          ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  ${BLUE}Environment:${NC}        $ENVIRONMENT"
    echo -e "  ${BLUE}Website URL:${NC}        $WEBSITE_URL"
    echo -e "  ${BLUE}CloudFront:${NC}         $CF_DOMAIN"
    echo -e "  ${BLUE}S3 Bucket:${NC}          $BUCKET_NAME"
    echo ""
    echo -e "${GREEN}Access your application at:${NC}"
    echo -e "  ${YELLOW}$WEBSITE_URL${NC}"
    echo ""
}

# Main execution
main() {
    echo_info "Starting full deployment for Byzantine Paralage App"
    echo_info "Environment: $ENVIRONMENT"

    check_prerequisites
    build_app
    deploy_infrastructure
    display_outputs

    echo_info "Deployment completed successfully! 🎉"
}

# Run main function
main "$@"
