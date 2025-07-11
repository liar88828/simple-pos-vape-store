import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    experimental: {
        useCache: true,

        // clientInstrumentationHook: true,
        // typedRoutes: true,
        viewTransition: true,
        serverActions: {
            // bodySizeLimit:'',
            allowedOrigins: [
                // 'http://localhost:3000',
                'localhost:3000',
                // 'http://localhost',
                // 'https://cs452n5c-3000.asse.devtunnels.ms',
                'cs452n5c-3000.asse.devtunnels.ms',
            ]
        }
    },
};

export default nextConfig;
