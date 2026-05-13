import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Skill Issue",
    short_name: "Skill Issue",
    description: "Lern Skills, halt dich accountable.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: "#FF6B6B",
    icons: [
      {
        src: "/api/pwa-icon?size=192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/api/pwa-icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
