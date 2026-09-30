"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./mission.module.css";

const missionExercises = ["Arm Raises", "Shoulder Rotation", "Stretch Hold"];
const exerciseInstructions = [
  "Follow the exercise and keep your movement steady.",
  "Rotate your shoulder gently through a comfortable range.",
  "Hold a gentle stretch without forcing the movement.",
];
const confettiColors = ["#e8c76f", "#79a98a", "#dd8b68", "#c7dfca", "#4f8769", "#f1dda0"];
const confettiShapes = ["rectangle", "circle", "diamond", "ribbon"] as const;
const confettiParticles = Array.from({ length: 36 }, (_, index) => {
  const distance = 22 + ((index * 11) % 25);
  const fall = 38 + ((index * 17) % 45);
  const spin = (index % 2 === 0 ? 1 : -1) * (210 + ((index * 71) % 360));

  return {
    side: index % 2 === 0 ? "left" : "right",
    shape: confettiShapes[index % confettiShapes.length],
    color: confettiColors[(index * 5) % confettiColors.length],
    top: 18 + ((index * 29) % 66),
    width: 5 + ((index * 3) % 7),
    height: 7 + ((index * 5) % 11),
    distance,
    midDistance: Math.round(distance * 0.58),
    fall,
    midFall: Math.round(fall * 0.46),
    spin,
    midSpin: Math.round(spin * 0.55),
    duration: 1500 + (index % 5) * 140,
    delay: (index % 6) * 45,
  };
});

function BrandMark() {
  return (
    <span className={styles.brand}>
      <span className={styles.brandIcon} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className={styles.brandName}>
        Re<span>:Vive</span>
      </span>
    </span>
  );
}

function MissionMap() {
  return (
    <svg className={styles.missionMap} viewBox="0 0 360 220" aria-hidden="true">
      <circle cx="274" cy="48" r="33" fill="#f1d47e" opacity=".82" />
      <path d="M0 133c54-34 99-31 151 3 53-47 111-40 149-7 20-11 39-17 60-16v107H0Z" fill="#9ec69e" />
      <path d="M0 165c53-28 97-29 153-2 56-35 112-25 151-3 20-11 39-17 56-17v77H0Z" fill="#659773" />
      <path d="M-25 237c65-65 118-55 169-77 42-18 47-59 92-69 47-10 75 11 126-43" fill="none" stroke="#bc9752" strokeWidth="34" strokeLinecap="round" opacity=".65" />
      <path d="M-25 237c65-65 118-55 169-77 42-18 47-59 92-69 47-10 75 11 126-43" fill="none" stroke="#f4dda0" strokeWidth="27" strokeLinecap="round" />
      <path d="M-25 237c65-65 118-55 169-77 42-18 47-59 92-69 47-10 75 11 126-43" fill="none" stroke="#fff6d5" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" />
      <circle cx="327" cy="47" r="20" fill="#f2d271" stroke="#fff3c8" strokeWidth="5" />
      <path d="m319 47 6 6 11-13" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MissionView() {
  const [completedCount, setCompletedCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<"requesting" | "ready" | "unavailable">("requesting");
  const [repCount, setRepCount] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const currentExercise = missionExercises[completedCount];

  useEffect(() => {
    let cancelled = false;

    function startWebSocket() {
      try {
        const ws = new WebSocket("ws://localhost:8765");
        wsRef.current = ws;

        ws.onopen = () => {
          if (!cancelled) setCameraStatus("ready");
        };

        ws.onmessage = (event) => {
          if (cancelled) return;
          try {
            const data = JSON.parse(event.data);
            if (data.event === "frame" && imageRef.current) {
              imageRef.current.src = "data:image/jpeg;base64," + data.image;
            } else if (data.event === "rep_counted") {
              setRepCount(data.reps);
              // Trigger Viora voice
              if (window.Viora && data.depth_ok) {
                window.Viora.say("Good form! Keep going.");
              } else if (window.Viora && !data.depth_ok) {
                window.Viora.say("Make sure to go all the way!");
              }
              // If reps reach a milestone like 5, proceed automatically
              if (data.reps >= 5 && data.reps % 5 === 0) {
                // The backend just keeps counting, so we increment session step
                setCompletedCount((count) => {
                  const next = count + 1;
                  if (next === missionExercises.length) {
                    setShowCelebration(true);
                    ws.close();
                  }
                  return next;
                });
                if (window.Viora) window.Viora.say("Great job! Moving to the next exercise.");
                setRepCount(0); // Reset UI rep count for next exercise
              }
            }
          } catch (e) {
            console.error("Failed to parse websocket message", e);
          }
        };

        ws.onerror = () => {
          if (!cancelled) setCameraStatus("unavailable");
        };

        ws.onclose = () => {
          if (!cancelled && !showCelebration) {
            setCameraStatus("unavailable");
          }
        };
      } catch {
        if (!cancelled) setCameraStatus("unavailable");
      }
    }

    startWebSocket();

    return () => {
      cancelled = true;
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [showCelebration]);

  function stopCamera() {
    if (wsRef.current) {
      wsRef.current.close();
    }
  }

  function completeCurrentExercise() {
    if (completedCount === missionExercises.length - 1) {
      stopCamera();
      setShowCelebration(true);
    }
    setCompletedCount((count) => count + 1);
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/patient/dashboard" aria-label="Return to Re:Vive dashboard">
            <BrandMark />
          </Link>
          <Link className={styles.backLink} href="/patient/dashboard">
            <span aria-hidden="true">←</span> Dashboard
          </Link>
        </div>
      </header>

      {completedCount === missionExercises.length ? (
        <>
          {showCelebration && (
            <div className={styles.confettiLayer} aria-hidden="true" data-testid="mission-confetti">
              {confettiParticles.map((particle, index) => (
                <span
                  className={styles.confettiParticle}
                  data-side={particle.side}
                  data-shape={particle.shape}
                  key={`${particle.side}-${index}`}
                  style={{
                    "--particle-color": particle.color,
                    "--particle-x-mid": particle.side === "left" ? `${particle.midDistance}vw` : `-${particle.midDistance}vw`,
                    "--particle-x": particle.side === "left" ? `${particle.distance}vw` : `-${particle.distance}vw`,
                    "--particle-y-mid": `${particle.midFall}vh`,
                    "--particle-y": `${particle.fall}vh`,
                    "--particle-spin-mid": `${particle.midSpin}deg`,
                    "--particle-spin": `${particle.spin}deg`,
                    "--particle-duration": `${particle.duration}ms`,
                    "--particle-delay": `${particle.delay}ms`,
                    top: `${particle.top}%`,
                    width: `${particle.width}px`,
                    height: `${particle.height}px`,
                  } as CSSProperties}
                />
              ))}
            </div>
          )}
          <main className={styles.completeLayout}>
            <section className={styles.completeCard} aria-labelledby="complete-title">
              <div className={styles.completeEmblem} aria-hidden="true">★</div>
              <p className={styles.eyebrow}>SHOULDER MOBILITY · SESSION 12</p>
              <h1 id="complete-title">MISSION COMPLETE 🎉</h1>
              <p className={styles.completeMessage}>
                Great work. You completed today&apos;s recovery mission.
              </p>
              <div className={styles.rewardRow} aria-label="Mission rewards">
                <div className={styles.rewardTile}>
                  <span aria-hidden="true">✦</span>
                  <strong>+120 XP</strong>
                </div>
                <div className={styles.rewardTile}>
                  <span aria-hidden="true">⬡</span>
                  <strong>+30 RC</strong>
                </div>
              </div>
              <p className={styles.streakMessage}>🔥 Recovery streak maintained</p>
              <Link className={styles.returnButton} href="/patient/dashboard">
                RETURN TO DASHBOARD
                <span aria-hidden="true">→</span>
              </Link>
            </section>
          </main>
        </>
      ) : (
        <main className={styles.main}>
          <section className={styles.missionHero} aria-labelledby="mission-title">
            <MissionMap />
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>TODAY&apos;S RECOVERY MISSION</p>
              <h1 id="mission-title">Shoulder Mobility — Session 12</h1>
              <p className={styles.description}>
                Complete your assigned exercises and keep your recovery streak alive.
              </p>
              <ul className={styles.metadata} aria-label="Mission details">
                <li><span aria-hidden="true">◌</span> 3 Exercises</li>
                <li><span aria-hidden="true">◷</span> 15 min</li>
                <li><span aria-hidden="true">✦</span> +120 XP</li>
                <li><span aria-hidden="true">⬡</span> +30 RC</li>
              </ul>
            </div>
            <div className={styles.missionStamp} aria-hidden="true">
              <span>DAY</span>
              <strong>12</strong>
              <span>CHAPTER 2</span>
            </div>
          </section>

          <div className={styles.sessionGrid}>
            <section className={styles.cameraPanel} aria-labelledby="camera-title">
              <div className={styles.cameraHeading}>
                <div>
                  <p className={styles.sectionLabel}>YOUR SESSION SPACE</p>
                  <h2 id="camera-title">Live Camera Feed</h2>
                </div>
                <span className={`${styles.cameraIndicator} ${cameraStatus === "ready" ? styles.cameraOn : ""}`}>
                  <span /> {cameraStatus === "ready" ? "LIVE" : cameraStatus === "requesting" ? "CONNECTING" : "DEMO MODE"}
                </span>
              </div>
              <div className={styles.cameraStage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  className={`${styles.cameraVideo} ${cameraStatus === "ready" ? styles.cameraVideoActive : ""}`}
                  alt="Live camera feed"
                  style={{ objectFit: "cover" }}
                />

                {/* Overlaid Rep Counter */}
                {cameraStatus === "ready" && (
                  <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(0, 0, 0, 0.6)", padding: "10px 20px", borderRadius: 10, color: "#fff", zIndex: 10 }}>
                    <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: 1, opacity: 0.8 }}>Reps</div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{repCount} <span style={{ fontSize: "1rem", opacity: 0.8 }}>/ 5</span></div>
                  </div>
                )}

                {cameraStatus !== "ready" && (
                  <div className={styles.cameraFallback} role="status">
                    {cameraStatus === "requesting" ? (
                      <p>Establishing WebSocket stream with Python Backend…</p>
                    ) : (
                      <p>Backend disconnected. Please start the backend script.</p>
                    )}
                  </div>
                )}
                {cameraStatus === "ready" && (
                  <span className={styles.liveBadge}><span /> LIVE</span>
                )}
                <span className={`${styles.cameraCorner} ${styles.cameraCornerTop}`} aria-hidden="true" />
                <span className={`${styles.cameraCorner} ${styles.cameraCornerBottom}`} aria-hidden="true" />
              </div>
              <div className={styles.cameraFooter}>
                <span>MISSION PROGRESS</span>
                <strong>{completedCount} / {missionExercises.length}</strong>
                <div
                  className={styles.cameraProgressTrack}
                  role="progressbar"
                  aria-label="Mission progress"
                  aria-valuemin={0}
                  aria-valuemax={missionExercises.length}
                  aria-valuenow={completedCount}
                >
                  <span style={{ width: `${(completedCount / missionExercises.length) * 100}%` }} />
                </div>
              </div>
            </section>

            <aside className={styles.guidePanel} aria-labelledby="guide-heading">
              <p className={styles.guideEyebrow} id="guide-heading">YOUR RECOVERY GUIDE</p>
              <div className={styles.guideMascot} role="img" aria-label="Friendly recovery guide mascot">
                <span className={styles.mascotBody} />
                <span className={styles.mascotHead}>
                  <span className={styles.mascotHair} />
                  <span className={styles.mascotEyeLeft} />
                  <span className={styles.mascotEyeRight} />
                  <span className={styles.mascotSmile} />
                </span>
                <span className={styles.mascotSpark} aria-hidden="true">✦</span>
              </div>
              <div className={styles.guideExercise} aria-live="polite">
                <p className={styles.guideStep}>EXERCISE {completedCount + 1} OF {missionExercises.length}</p>
                <h2 id="guide-title">{currentExercise}</h2>
                <p>{exerciseInstructions[completedCount]}</p>
              </div>
              <div className={styles.guideDetails}>
                <div>
                  <span>PROGRESS</span>
                  <strong>{completedCount} / {missionExercises.length}</strong>
                </div>
                <div>
                  <span>REWARD</span>
                  <strong>+40 XP</strong>
                </div>
              </div>
              <ol className={styles.guideExerciseList} aria-label="Exercise sequence">
                {missionExercises.map((exercise, index) => {
                  const isComplete = index < completedCount;
                  const isCurrent = index === completedCount;

                  return (
                    <li
                      className={styles.guideExerciseRow}
                      data-state={isComplete ? "complete" : isCurrent ? "current" : "upcoming"}
                      key={exercise}
                    >
                      <span>{isComplete ? "✓" : `0${index + 1}`}</span>
                      <span>{exercise}</span>
                      <span>{isComplete ? "DONE" : isCurrent ? "NOW" : "NEXT"}</span>
                    </li>
                  );
                })}
              </ol>
              <button className={styles.startButton} type="button" onClick={completeCurrentExercise}>
                COMPLETE EXERCISE
                <span aria-hidden="true">→</span>
              </button>
            </aside>
          </div>
        </main>
      )}
    </div>
  );
}