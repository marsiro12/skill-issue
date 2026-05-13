import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const size = Number(request.nextUrl.searchParams.get("size") ?? "512");

  const scale = size / 24;
  const pad = size * 0.22;

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FF6B6B 0%, #FFA552 100%)",
          borderRadius: size * 0.22,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width={size - pad * 2}
          height={size - pad * 2}
          fill="none"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M13 2 L4 14 L11 14 L11 22 L20 10 L13 10 Z" fill="white" stroke="none" />
        </svg>
      </div>
    ),
    { width: size, height: size }
  );
}
