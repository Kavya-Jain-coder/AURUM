/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Three.js GLSL shader imports
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader'],
    });
    // Ensure Three.js works properly with Next.js
    config.externals = config.externals || [];
    return config;
  },
  // Transpile Three.js packages
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
  // Allow images from Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
