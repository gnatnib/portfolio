let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Lets a build run against a scratch directory while `next dev` holds .next
     (on Windows the two collide with EPERM on .next/trace). */
  distDir: process.env.NEXT_DIST_DIR || '.next',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    /* Local assets (certificates, CV pages, project shots) are large PNGs and
       now go through the optimizer, which serves resized AVIF/WebP instead.
       Remote Spotify/GitHub art passes `unoptimized` per-<Image> and is
       unaffected. */
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'mosaic.scdn.co' },
      { protocol: 'https', hostname: 'image-cdn-ak.spotifycdn.com' },
      { protocol: 'https', hostname: 'image-cdn-fa.spotifycdn.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  experimental: {
    /* react-icons and lucide-react ship huge barrel files; without this the
       bundler pulls the whole icon set in for a handful of glyphs. */
    optimizePackageImports: ['react-icons', 'lucide-react'],
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        /* Fingerprint-free static assets that rarely change */
        source: '/cv/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
    ]
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
