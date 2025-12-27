#!/bin/bash

#####################################################################
# AWS Lightsail Deployment Script for Byzantine Paralage App
#
# This script deploys the static site to AWS Lightsail
# Prerequisites:
# - AWS CLI installed and configured
# - Lightsail container service created
# - Docker installed (for container deployment)
#####################################################################

set -e

# Configuration
APP_NAME="byzantine-paralage"
AWS_REGION="${AWS_REGION:-us-east-1}"
LIGHTSAIL_SERVICE_NAME="${LIGHTSAIL_SERVICE_NAME:-byzantine-paralage-service}"
CONTAINER_NAME="app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    echo_info "Checking prerequisites..."

    if ! command -v aws &> /dev/null; then
        echo_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi

    if ! command -v docker &> /dev/null; then
        echo_error "Docker is not installed. Please install it first."
        exit 1
    fi

    echo_info "Prerequisites check passed"
}

# Build the application
build_app() {
    echo_info "Building application..."
    cd ../../app
    npm install
    npm run build
    cd -
    echo_info "Application built successfully"
}

# Build Docker image
build_docker_image() {
    echo_info "Building Docker image..."
    # Navigate to project root where Dockerfile is located
    cd ../../
    docker build -t ${APP_NAME}:latest -f Dockerfile .
    cd infrastructure/lightsail
    echo_info "Docker image built successfully"
}

# Push to Lightsail
push_to_lightsail() {
    echo_info "Pushing image to Lightsail..."

    # Push the image to Lightsail
    aws lightsail push-container-image \
        --region ${AWS_REGION} \
        --service-name ${LIGHTSAIL_SERVICE_NAME} \
        --label ${CONTAINER_NAME} \
        --image ${APP_NAME}:latest

    echo_info "Image pushed successfully"
}

# Deploy to Lightsail
deploy_to_lightsail() {
    echo_info "Deploying to Lightsail..."

    # Get the latest image tag
    IMAGE_TAG=$(aws lightsail get-container-images \
        --region ${AWS_REGION} \
        --service-name ${LIGHTSAIL_SERVICE_NAME} \
        --query 'containerImages[0].image' \
        --output text)

    # Create deployment using containers.json
    aws lightsail create-container-service-deployment \
        --region ${AWS_REGION} \
        --service-name ${LIGHTSAIL_SERVICE_NAME} \
        --containers file://containers.json \
        --public-endpoint file://public-endpoint.json

    echo_info "Deployment initiated successfully"
}

# Main execution
main() {
    echo_info "Starting deployment to AWS Lightsail..."

    check_prerequisites
    build_app
    build_docker_image
    push_to_lightsail
    deploy_to_lightsail

    echo_info "Deployment completed successfully!"
    echo_info "Check your Lightsail console for deployment status"
}

# Run main function
main "$@"
