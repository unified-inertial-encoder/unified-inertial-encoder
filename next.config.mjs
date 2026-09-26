const basePath = process.env.GITHUB_PAGES === "true" ? "/unified-inertial-encoder" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    // Raw <img>/<video> tags are not rewritten by Next; components prefix with this.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
