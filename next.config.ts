import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      // Les actions serveur plafonnent le corps de requête à 1 Mo par défaut;
      // les photos d'œuvres peuvent atteindre 15 Mo (+ surcoût multipart).
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
