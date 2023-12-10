/** @type {import('next').NextConfig} */

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first")

const nextConfig = {
       images: {
              remotePatterns: [
                     {
                            protocol: 'https',
                            hostname: 'crahe-arthur.com',
                            pathname: '/public_files/img/**',
                     },
              ],
       },
}

module.exports = nextConfig;