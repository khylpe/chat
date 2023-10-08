/** @type {import('next').NextConfig} */
const nextConfig = {
       webpack: (config, { isServer }) => {
              if (!isServer) {
                     config.resolve.alias['bufferutil'] = false;
                     config.resolve.alias['utf-8-validate'] = false;
              }
              return config;
       }
}

module.exports = nextConfig;