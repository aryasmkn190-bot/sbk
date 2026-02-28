import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["better-sqlite3"],
    images: {
        unoptimized: true
    }
};

export default withNextIntl(nextConfig);
