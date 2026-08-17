#!/bin/bash

# ==========================================
# Configuration
# ==========================================
DIST_DIR="./dist"
OSS_BUCKET="oss://afreshtrip-frontend/"
FIREBASE_SITE_URL="https://afreshtrip.firebaseapp.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==========================================
# Safety & Error Handling
# ==========================================
# -e: Exit immediately if a command exits with a non-zero status
# -u: Treat unset variables as an error
# -o pipefail: Return value of a pipeline is the status of the last command to exit with a non-zero status
set -euo pipefail

# Trap errors to provide a clean exit message
trap 'error_handler $? $LINENO' ERR

error_handler() {
    echo -e "${RED}❌ Error occurred in script at line $2 with exit code $1${NC}"
    exit "$1"
}

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_step() { echo -e "\n${YELLOW}🚀 $1${NC}"; }

# ==========================================
# Pre-checks
# ==========================================
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}❌ Error: $1 is not installed or not in PATH${NC}"
        exit 1
    fi
}

echo "📋 Checking prerequisites..."
check_command firebase
check_command ossutil
check_command npm
check_command node

# ==========================================
# 1. Firebase Deployment (International)
# ==========================================
echo -e "${YELLOW}⚠️  Before deploying to Firebase:${NC}"
echo "If you are in China, please activate your VPN."
echo "If not, you can continue without issue."
read -p "Are you ready to start the Firebase deployment? (y/n): " answer
if [[ $answer != "y" && $answer != "Y" ]]; then
    echo "Deployment cancelled."
    exit 0
fi
log_step "Starting International Deployment (Firebase)..."

log_info "Setting up International Environment..."
cp .env.international .env

log_info "Building International Version..."
npm run build

log_info "Deploying to Firebase..."
# We use --only hosting to avoid triggering unnecessary function/firestore deploys
firebase deploy --only hosting

log_success "Firebase deployment complete."

# ==========================================
# 2. Aliyun Deployment (Chinese)
# ==========================================
echo -e "${YELLOW}⚠️  Before deploying to OSS:${NC}"
echo "If you are in China, please deactivate your VPN to avoid issues."
read -p "Are you ready to start the OSS deployment? (y/n): " answer
if [[ $answer != "y" && $answer != "Y" ]]; then
    echo "Deployment cancelled."
    exit 0
fi
log_step "Starting China Deployment (Aliyun)..."

log_info "Setting up Chinese Environment..."
cp .env.chinese .env

log_info "Building Chinese Version..."
npm run build

log_info "Uploading to Aliyun OSS..."
# Flags explanation:
# -r: Recursive (upload directories)
# -f: Force (overwrite without asking)
# -u: Update (only upload if local file is newer)
ossutil cp -r "$DIST_DIR" "$OSS_BUCKET" -f -u

log_success "Aliyun OSS upload complete."

# ==========================================
# Summary
# ==========================================
echo -e "\n${GREEN}🎉 Deployment to both platforms completed successfully!${NC}"
echo ""
echo "📝 Deployment Details:"
echo -e "  - ${BLUE}International:${NC} $FIREBASE_SITE_URL"
echo -e "  - ${BLUE}China:${NC}         Served via Aliyun OSS Bucket ($OSS_BUCKET)"
echo ""
log_warn "If using an Aliyun CDN, don't forget to invalidate the cache for changed files!"