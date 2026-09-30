"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function PatientProfilePage() {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const loadScript = (src: string) =>
      new Promise((resolve, reject) => {
        // Avoid double loading
        if (document.querySelector(`script[src="${src}"]`)) {
          return resolve(true);
        }
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });

    async function initPhaser() {
      try {
        await loadScript("/js/core-state.js");
        await loadScript("/js/phaser.min.js");
        // Only load the game script once Phaser is ready
        await loadScript("/js/virtual-room.js");
      } catch (e) {
        console.error("Failed to load Phaser prerequisites", e);
      }
    }

    initPhaser();

    return () => {
      // @ts-ignore
      if (window.phaserGame) {
        // @ts-ignore
        window.phaserGame.destroy(true);
        // @ts-ignore
        window.phaserGame = null;
      }
    };
  }, []);

  return (
    <main
      style={{
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>Virtual Room</h1>
      <p style={{ marginBottom: "30px", opacity: 0.7 }}>
        Use arrow keys to move. Walk up to furniture zones to purchase items with your Rehab Tokens!
      </p>

      <div
        id="phaser-game"
        style={{
          width: 800,
          height: 400,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          border: "2px solid rgba(255,255,255,0.1)",
        }}
      ></div>

      <Link
        href="/patient/dashboard"
        style={{
          marginTop: "40px",
          padding: "12px 24px",
          background: "#2563eb",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Return to Dashboard
      </Link>
    </main>
  );
}