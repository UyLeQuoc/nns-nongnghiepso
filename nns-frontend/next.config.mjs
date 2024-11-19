/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['techcrunch.com',"firebasestorage.googleapis.com", "developers.elementor.com", "scontent.fsgn15-1.fna.fbcdn.net"],
        unoptimized: true 
    },
    output: "export",
};

export default nextConfig;
