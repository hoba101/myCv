import { ImageResponse } from "next/og";
import { getContent } from "./lib/content";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { profile, hero } = await getContent();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#1A0B2E",
          padding: "70px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "999px",
              background: "#A3E635",
            }}
          />
          <div style={{ color: "#A3E635", fontSize: 26, letterSpacing: 2 }}>
            {profile.role.toUpperCase()}
          </div>
        </div>

        <div
          style={{
            color: "#ffffff",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1,
          }}
        >
          {profile.name}
        </div>

        <div
          style={{
            color: "#a1a1aa",
            fontSize: 30,
            marginTop: "22px",
          }}
        >
          {hero.headline}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "40px",
          }}
        >
          {hero.typedWords.slice(0, 3).map((word) => (
            <div
              key={word}
              style={{
                display: "flex",
                border: "3px solid #3d2266",
                padding: "10px 20px",
                color: "#ffffff",
                fontSize: 22,
                borderRadius: 999,
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}