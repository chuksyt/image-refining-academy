import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      // Uploaded images (Vercel Blob) + any image URL the director pastes into
      // the editor. Broad by design so non-technical edits "just work".
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig
