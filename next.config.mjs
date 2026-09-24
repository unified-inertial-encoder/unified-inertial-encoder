/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.GITHUB_PAGES === "true" ? "/unified-inertial-encoder" : "",
};

export default nextConfig;
