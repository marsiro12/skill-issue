import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FF6B6B 0%, #FFA552 100%)",
          borderRadius: "40px",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="110"
          height="110"
          fill="none"
          stroke="white"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M13 2 L4 14 L11 14 L11 22 L20 10 L13 10 Z" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
