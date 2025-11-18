# Cloudinary Setup Guide

## Overview

Cloudinary is integrated into Nextjemari for storing and optimizing images. It handles:
- Article cover images
- User avatars
- Automatic image optimization
- Format conversion (WebP, etc.)
- Responsive image delivery

## Setup Steps

### 1. Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email

### 2. Get Your Credentials

1. Log in to your Cloudinary dashboard
2. Go to **Settings** → **Security**
3. Copy the following:
   - **Cloud Name** (e.g., `my-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### 3. Add to Environment Variables

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Restart Development Server

After adding the credentials, restart your dev server:

```bash
npm run dev
```

## Usage

### Upload Article Cover Image

1. Go to `/write` or edit an article
2. In the "Cover Image" section, click "Choose Image"
3. Select an image file (max 10MB)
4. The image will be uploaded to Cloudinary automatically
5. The URL will be filled in automatically

You can also paste a URL directly if you prefer.

### Upload User Avatar

When profile editing is implemented:
1. Go to your profile settings
2. Click on your avatar
3. Select an image file
4. The image will be uploaded to Cloudinary automatically

## Image Optimization

Cloudinary automatically:
- Optimizes images for web (compression)
- Converts to modern formats (WebP when supported)
- Resizes images appropriately:
  - **Avatars**: 400x400px
  - **Cover Images**: 1200x630px (optimized for social sharing)
- Delivers images via CDN for fast loading

## File Structure in Cloudinary

Images are organized in folders:
- `nextjemari/articles/` - Article cover images
- `nextjemari/avatars/` - User avatars
- `nextjemari/general/` - Other images

## Free Tier Limits

Cloudinary free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- Unlimited transformations
- CDN delivery

For production apps with high traffic, consider upgrading to a paid plan.

## Troubleshooting

### Upload Not Working

1. **Check credentials**: Verify all three Cloudinary environment variables are set
2. **Check file size**: Maximum file size is 10MB
3. **Check file type**: Only image files are accepted
4. **Check console**: Look for error messages in browser console and server logs

### Images Not Displaying

1. **Check URL**: Verify the image URL is valid
2. **Check CORS**: Cloudinary handles CORS automatically
3. **Check network**: Verify your internet connection

### Rate Limiting

If you hit rate limits:
- Free tier has generous limits
- Consider upgrading if you need more
- Implement client-side caching for frequently accessed images

## Security

- API Secret should **never** be exposed to the client
- All uploads go through the server API route (`/api/upload`)
- Authentication is required for uploads
- File type and size validation is enforced

## API Endpoints

### POST /api/upload

Upload an image to Cloudinary.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: Image file
  - `folder`: (optional) Folder path
  - `type`: (optional) `avatar` | `cover` | `general`

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/..."
  }
}
```

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

