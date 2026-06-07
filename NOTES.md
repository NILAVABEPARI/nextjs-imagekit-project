# Project Notes

## Technologies

### Next.js
- notes here

### ImageKit
- ImageKit is a **cloud-based media management and optimization platform**. Think of it as a CDN specifically built for images and videos — but with powerful real-time transformation capabilities on top.

**The Core Problem it Solves**
Without ImageKit, handling media in a web app is painful:
- Raw images/videos are huge — slow to load, expensive to store
- Different devices need different sizes (mobile vs desktop)
- You'd have to manually resize, compress, and convert formats yourself
- Storing media on your own server doesn't scale well
- No CDN means slow delivery for users far from your server

**What ImageKit gives you**
**Storage**
- Upload and store images and videos in ImageKit's cloud
- Organizes files in folders, similar to Google Drive
**Real-time URL-based Transformations**
This is ImageKit's most powerful feature. You transform media just by modifying the URL:

```
// Original
https://ik.imagekit.io/your_id/photo.jpg

// Resize to 300x300
https://ik.imagekit.io/your_id/photo.jpg?tr=w-300,h-300

// Compress quality to 80%
https://ik.imagekit.io/your_id/photo.jpg?tr=q-80

// Convert to WebP format
https://ik.imagekit.io/your_id/photo.jpg?tr=f-webp

// Chain multiple transformations
https://ik.imagekit.io/your_id/photo.jpg?tr=w-300,h-300,q-80,f-webp
```
- No code changes needed — just URL parameters.

**CDN Delivery**
- Files are served from edge locations closest to the user
- Automatic caching for fast repeated loads
**Automatic Optimization**
- Detects the browser and serves the best format automatically (WebP for Chrome, HEIC for Safari, etc.)
- Lazy loading support out of the box

**Why it fits your project**
You're building a video platform with Mongoose storing `videoUrl` and `thumbnailUrl`. ImageKit is where those URLs actually point to. Your `transformation` field in the `IVideo` interface maps directly to ImageKit's transformation parameters:

```ts
transformation?: {
    height: number,   // tr=h-1920
    width: number,    // tr=w-1080
    quality?: number  // tr=q-80
}
```

### Mongoose
- notes here

### NextAuth
- NextAuth (now called Auth.js in v5) is an authentication library built specifically for Next.js. It handles the entire auth flow for you:
    1. Session management (JWT or database sessions)
    2. OAuth providers (Google, GitHub, Discord, etc.)
    3. Credentials-based login (email/password)
    4. CSRF protection
    5. Callbacks to customize token/session shape
    6. Route protection via middleware

- Essentially it abstracts away all the complexity of auth so you don't have to manually handle tokens, cookies, redirects, and provider integrations.

## Concepts Learned

## Gotchas / Bugs Fixed