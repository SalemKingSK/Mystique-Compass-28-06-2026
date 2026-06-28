import React from "react";
import { X, Download } from "lucide-react";
import type { PwaInstallState } from "@/hooks/use-pwa-install";

interface Props {
  pwa: PwaInstallState;
  onOpenPrompt: () => void;
}

export function PwaInstallBanner({ pwa, onOpenPrompt }: Props) {
  const show =
    !pwa.isInstalled &&
    !pwa.isDismissed &&
    (pwa.canInstall || pwa.isIOS);

  if (!show) return null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        background:
          "linear-gradient(135deg, rgba(20,8,50,0.97) 0%, rgba(30,12,65,0.97) 100%)",
        borderBottom: "1px solid rgba(212,175,55,0.28)",
        backdropFilter: "blur(12px)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
          padding: "0.6rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {/* Icon */}
        <img
          src="/icon.svg"
          alt="Mystique Compass"
          style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0 }}
        />

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#d4af37",
              margin: 0,
              lineHeight: 1,
              marginBottom: "0.18rem",
            }}
          >
            Mystique Compass
          </p>
          <p
            style={{
              fontSize: "0.68rem",
              color: "rgba(210,195,250,0.72)",
              margin: 0,
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Install for your cosmic experience
          </p>
        </div>

        {/* Install button */}
        <button
          onClick={onOpenPrompt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            background: "linear-gradient(135deg, #d4af37, #b8941f)",
            border: "none",
            borderRadius: 20,
            padding: "0.38rem 0.85rem",
            color: "#0d0820",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "0 2px 12px rgba(212,175,55,0.35)",
          }}
        >
          <Download size={10} />
          Install
        </button>

        {/* Dismiss */}
        <button
          onClick={pwa.dismiss}
          style={{
            background: "none",
            border: "none",
            color: "rgba(180,160,220,0.5)",
            cursor: "pointer",
            padding: "0.25rem",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
