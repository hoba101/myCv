import Image from "next/image";
import { Sparkles } from "lucide-react";

/**
 * Brand mark. Uses the uploaded logo when one exists, otherwise the
 * Sparkles glyph. Always paired with the handle text.
 */
export default function Logo({
  logoUrl,
  handle,
  size = 18,
  className = "",
}: {
  logoUrl?: string;
  handle: string;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          width={size}
          height={size}
          className="object-contain"
          style={{ width: size, height: size }}
          unoptimized
        />
      ) : (
        <Sparkles size={size} className="shrink-0" />
      )}
      <span>{handle}</span>
    </span>
  );
}