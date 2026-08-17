# Deployment Guide

This guide explains how to deploy the AfreshTrip frontend application to different platforms: Firebase for international users and Aliyun OSS for Chinese users.

## Overview

The application supports two deployment targets:

- **International Deployment**: Uses Firebase Hosting for global users outside China.
- **Chinese Deployment**: Uses Aliyun OSS for users in China.

The deployment process is automated via the `deploy.sh` script, which builds the application twice with different environment configurations and deploys to the respective platforms.

## Prerequisites

Before deploying, ensure you have the following tools installed and configured:

- **Node.js** and **npm**: Required for building the application.
- **Firebase CLI**: For deploying to Firebase Hosting.
  - Install: `npm install -g firebase-tools`
  - Login: `firebase login`
- **ossutil**: Aliyun's OSS command-line tool for uploading to OSS.
  - Download and install from [Aliyun OSS documentation](https://help.aliyun.com/document_detail/50452.html).
  - Configure with your Aliyun credentials.

## Environment Configuration

The deployment uses different environment files for each target:

- **`.env.international`**: For international deployment (`VITE_IS_CHINESE_VERSION=false`)
- **`.env.chinese`**: For Chinese deployment (`VITE_IS_CHINESE_VERSION=true`)

Both files contain the same base configuration:

### API Base URLs
- **Development**: `VITE_API_BASE_URL=http://localhost:8080`
- **Production International**: `VITE_GCP_BACKEND_URL=https://afreshtrip-backend-550030138351.europe-west1.run.app`
- **Production China**: `VITE_ALIYUN_BACKEND_URL=no_backend_deployed_yet`

### Firebase Configuration
- `VITE_FIREBASE_API_KEY=AIzaSyBM6Htztx2-Vt4J5kvp966KN7lL_Rjy7dM`
- `VITE_FIREBASE_AUTH_DOMAIN=afreshtrip.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID=afreshtrip`
- `VITE_FIREBASE_STORAGE_BUCKET=afreshtrip.firebasestorage.app`
- `VITE_FIREBASE_MESSAGING_SENDER_ID=550030138351`
- `VITE_FIREBASE_APP_ID=1:550030138351:web:de958330ece3ad157a741a`
- `VITE_FIREBASE_MEASUREMENT_ID=G-HWJEQR0BTG`

The deploy script automatically switches to the appropriate `.env` file before building.

## Deployment Process

Run the `deploy.sh` script from the project root:

```bash
./deploy.sh
```

The script performs the following steps:

### 1. International Deployment (Firebase)

1. **VPN Check**: If you're in China, activate your VPN to access Firebase services.
2. **Environment Setup**: Copies `.env.international` to `.env`.
3. **Build**: Builds the application using the international environment configuration.
   - Command: `npm run build`
4. **Deploy**: Deploys the `dist` directory to Firebase Hosting.
   - Command: `firebase deploy --only hosting`
5. **URL**: The application will be available at `https://afreshtrip.firebaseapp.com`

### 2. Chinese Deployment (Aliyun OSS)

1. **VPN Check**: If you're in China, deactivate your VPN to avoid issues with Aliyun services.
2. **Environment Setup**: Copies `.env.chinese` to `.env`.
3. **Build**: Builds the application using the Chinese environment configuration.
   - Command: `npm run build`
4. **Upload**: Uploads the `dist` directory to the Aliyun OSS bucket.
   - Bucket: `oss://afreshtrip-frontend/`
   - Command: `ossutil cp -r "./dist" "oss://afreshtrip-frontend/" -f -u`
5. **Serving**: The application is served via the OSS bucket. If using a CDN, invalidate the cache for changed files.

## Manual Deployment

If you need to deploy manually:

### Firebase Deployment
```bash
cp .env.international .env
npm run build
firebase deploy --only hosting
```

### OSS Deployment
```bash
cp .env.chinese .env
npm run build
ossutil cp -r "./dist" "oss://afreshtrip-frontend/" -f -u
```

## Troubleshooting

- **Firebase Deployment Issues**: Ensure you're logged in to Firebase CLI and have access to the project. If in China, use a VPN.
- **OSS Upload Issues**: Verify your ossutil configuration and Aliyun credentials. Deactivate VPN if in China.
- **Build Failures**: Check that all environment variables are set correctly and dependencies are installed (`npm install`).

## Post-Deployment

- **International**: Access at `afreshtrip.com`
- **China**: Served via Aliyun OSS bucket (`oss://afreshtrip-frontend/`) associated with the domain name `afreshtrip.cn`. We used CDN on aliyun to map the domain form http to https because OSS can't be configured for https support. We aalso need to make sure that www.afreshtrip.cn is mapped to the same bucket currently only afreshtrip.cn redirect to our site.
- Remember to invalidate the cache for updated files.

For more details on the application architecture or other documentation, refer to other files in the `docs/` folder.