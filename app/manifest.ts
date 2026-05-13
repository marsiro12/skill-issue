import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Skill Issue",
    short_name: "Skill Issue",
    description: "Lern Skills, halt dich accountable.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: "#FF6B6B",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
