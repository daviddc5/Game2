#!/bin/bash

# GCP Cloud Run Deployment Script for Shadows of Judgment
# Uses the FREE TIER of Cloud Run
# Free tier: 2M requests/mo, 360k GB-seconds, 180k vCPU-seconds

set -e

echo "🚀 Starting deployment to Google Cloud Run (free tier)..."

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SERVICE_NAME="shadows-of-judgment"
REGION="europe-west1"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install it first:${NC}"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | head -1 | grep -q .; then
    echo "❌ Not logged in to gcloud. Running 'gcloud auth login'..."
    gcloud auth login
fi

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
    echo -e "${RED}❌ No GCP project selected.${NC}"
    echo "Please run: gcloud config set project YOUR-PROJECT-ID"
    exit 1
fi

echo -e "${GREEN}✓${NC} Using project: $PROJECT_ID"
echo -e "${GREEN}✓${NC} Service: $SERVICE_NAME"
echo -e "${GREEN}✓${NC} Region: $REGION"

# Enable required APIs
echo ""
echo "📡 Enabling required GCP APIs..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --quiet 2>/dev/null || true

# Ask for confirmation
echo ""
echo -e "${YELLOW}This will deploy to Cloud Run (free tier).${NC}"
echo -e "${YELLOW}Estimated cost: \$0 (within free tier limits)${NC}"
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Deploy to Cloud Run (source-based deploy — builds via Cloud Build)
echo ""
echo "☁️  Building and deploying to Cloud Run..."
echo "   (This may take 3-5 minutes on first deploy)"
echo ""

gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --allow-unauthenticated \
    --session-affinity \
    --min-instances 0 \
    --max-instances 1 \
    --memory 256Mi \
    --cpu 1 \
    --port 8080 \
    --set-env-vars "NODE_ENV=production"

# Get the service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format="value(status.url)")

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "🌐 Your app is live at: ${GREEN}${SERVICE_URL}${NC}"
echo ""
echo -e "💰 Cost: ${GREEN}FREE${NC} (within Cloud Run free tier)"
echo ""
echo "Useful commands:"
echo "  View logs:    npm run deploy:logs"
echo "  Stream logs:  gcloud run services logs tail $SERVICE_NAME --region $REGION"
echo "  Delete:       gcloud run services delete $SERVICE_NAME --region $REGION"
echo ""
