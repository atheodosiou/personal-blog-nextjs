import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anastasios Theodosiou",
    short_name: "A. Theodosiou",
    start_url: "/",
    display: "standalone",
    background_color: "#13161B",
    theme_color: "#13161B",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
