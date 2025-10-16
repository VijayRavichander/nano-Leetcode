/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['litecode.vijayravichander.com'],
    
    // Memory optimization for VM environments
    experimental: {
        // Reduce memory usage during build
        workerThreads: false,
        cpus: 1,
    },
    
    // Optimize build output
    output: 'standalone',
    
    // Reduce bundle size
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    
    // Webpack optimizations for memory-constrained environments
    webpack: (config, { isServer }) => {
        // Reduce memory usage
        config.optimization = {
            ...config.optimization,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        maxSize: 244000, // Smaller chunks for better memory management
                    },
                },
            },
        };

        // Limit parallel processing to reduce memory usage
        config.parallelism = 1;
        
        return config;
    },
};

export default nextConfig;
