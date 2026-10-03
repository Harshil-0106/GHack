"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  authenticateMockUser,
  getDashboardPath,
  type UserRole,
} from "../lib/mock-auth";

function BrandLockup() {
  return (
    <div className="brand-lockup" aria-label="Re:Vive">
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="brand-name">
        Re<span>:Vive</span>
      </span>
    </div>
  );
}

function JourneyProgress() {
  return (
    <div className="journey-progress" aria-label="Recovery journey">
      <div className="journey-step">
        <span className="journey-dot">1</span>
        <span>Begin</span>
      </div>
      <div className="journey-step">
        <span className="journey-dot">2</span>
        <span>Build</span>
      </div>
      <div className="journey-step">
        <span className="journey-dot">3</span>
        <span>Thrive</span>
      </div>
    </div>
  );
}

function RecoveryWorld() {
  return (
    <div className="world-scene" aria-hidden="true">
      <svg
        className="world-art"
        viewBox="0 0 1440 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#dff2eb" />
            <stop offset="0.57" stopColor="#f6f2d9" />
            <stop offset="1" stopColor="#c4dfc3" />
          </linearGradient>
          <linearGradient id="path" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f4d990" />
            <stop offset="1" stopColor="#fff0bd" />
          </linearGradient>
          <radialGradient id="beacon">
            <stop offset="0" stopColor="#fff8cf" stopOpacity="0.98" />
            <stop offset="0.45" stopColor="#f7d66d" stopOpacity="0.52" />
            <stop offset="1" stopColor="#f7d66d" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path fill="url(#sky)" d="M0 0h1440v1000H0z" />
        <circle cx="1160" cy="172" r="88" fill="#f8d778" opacity=".72" />
        <circle cx="1160" cy="172" r="118" fill="#fff0b4" opacity=".25" />

        <g fill="#fff" opacity=".55">
          <path d="M160 190c8-27 43-32 58-9 20-14 48-3 51 21h-115c-14 0-15-10 6-12Z" />
          <path d="M690 115c7-20 31-25 45-8 16-10 37-2 39 17h-92c-11 0-11-7 8-9Z" />
          <path d="M1315 345c6-19 30-23 41-7 16-9 34-2 37 16h-86c-10 0-10-7 8-9Z" />
        </g>

        <path fill="#bad8c5" d="M0 468c170-118 291-72 426 8 145-164 258-132 385-38 156-136 325-119 629 38v524H0Z" />
        <path fill="#93c4a4" d="M0 570c174-108 298-85 440 10 154-127 297-93 410-14 175-128 367-73 590 33v401H0Z" />
        <path fill="#76ad83" d="M0 700c177-71 295-81 471-13 123-76 262-88 391-20 173-99 363-79 578-3v307H0Z" />
        <path fill="#4e8969" d="M0 834c221-101 390-63 555-15 166-102 333-56 480-6 144-67 279-50 405-5v192H0Z" />
        <path fill="#39745a" d="M0 925c189-63 310-45 445-9 172-66 354-55 509-9 180-45 316-25 486 16v77H0Z" />

        <path
          d="M-36 1040c73-161 186-217 318-236 132-18 233 22 328-68 90-85 41-162 146-228 94-59 206-43 235-139"
          fill="none"
          stroke="#b38b4f"
          strokeLinecap="round"
          strokeWidth="112"
          opacity=".28"
        />
        <path
          d="M-36 1026c73-161 186-217 318-236 132-18 233 22 328-68 90-85 41-162 146-228 94-59 206-43 235-139"
          fill="none"
          stroke="url(#path)"
          strokeLinecap="round"
          strokeWidth="94"
        />
        <path
          d="M-36 1026c73-161 186-217 318-236 132-18 233 22 328-68 90-85 41-162 146-228 94-59 206-43 235-139"
          fill="none"
          stroke="#fff7d8"
          strokeDasharray="3 28"
          strokeLinecap="round"
          strokeWidth="4"
          opacity=".75"
        />

        <g className="world-checkpoint" transform="translate(1000 338)">
          <circle r="114" fill="url(#beacon)" />
          <circle r="47" fill="#fff5ce" opacity=".62" />
          <circle r="34" fill="#f5cf65" stroke="#fff8db" strokeWidth="7" />
          <path d="M-9 4l7 8 16-20" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
          <path d="M-52-64l6 13 14 2-10 9 3 14-13-7-12 7 2-14-10-9 14-2z" fill="#fff2b1" />
          <path d="M55-36l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#fff2b1" />
        </g>

        <g className="floating-star" transform="translate(845 222)" fill="#fff5bf">
          <path d="M0-16 4-4 16 0 4 4 0 16-4 4-16 0-4-4z" />
        </g>
        <g className="floating-star star-two" transform="translate(1310 495)" fill="#fff1ad">
          <path d="M0-11 3-3 11 0 3 3 0 11-3 3-11 0-3-3z" />
        </g>
        <g fill="#ffefaa" opacity=".92">
          <circle className="floating-particle particle-one" cx="920" cy="414" r="5" />
          <circle className="floating-particle particle-two" cx="1110" cy="430" r="4" />
          <circle className="floating-particle particle-three" cx="780" cy="550" r="4" />
        </g>

        <g transform="translate(258 552)">
          <ellipse cx="15" cy="143" rx="43" ry="9" fill="#285f49" opacity=".2" />
          <path d="M0 86l-13 45m30-45 18 42" fill="none" stroke="#315747" strokeLinecap="round" strokeWidth="12" />
          <path d="M-15 130l-18 7m67-4 17 8" fill="none" stroke="#f8e4bb" strokeLinecap="round" strokeWidth="9" />
          <path d="M3 41c-18 7-24 27-19 48l32 8c17-14 20-38 8-53z" fill="#e98662" stroke="#315747" strokeLinejoin="round" strokeWidth="4" />
          <path d="M-10 48l-28 31m54-30 25 29" fill="none" stroke="#315747" strokeLinecap="round" strokeWidth="10" />
          <circle cx="5" cy="18" r="20" fill="#f1bf8f" stroke="#315747" strokeWidth="4" />
          <path d="M-13 15c2-19 27-25 39-9l-2-13c-20-14-43-1-43 18z" fill="#425b48" />
          <path d="M7 24q6 6 12 0" fill="none" stroke="#7b4c3d" strokeLinecap="round" strokeWidth="2.5" />
        </g>

        <g className="stretching-character" transform="translate(606 734)">
          <ellipse cx="15" cy="149" rx="48" ry="10" fill="#285f49" opacity=".2" />
          <path d="M4 93l-4 43m18-42 25 34" fill="none" stroke="#315747" strokeLinecap="round" strokeWidth="12" />
          <path d="M-1 135l-18 5m62-12 17 8" fill="none" stroke="#f5e7c8" strokeLinecap="round" strokeWidth="9" />
          <path d="M-5 54c-13 5-17 23-10 42l32 7c13-12 17-29 7-45z" fill="#5c8f78" stroke="#315747" strokeLinejoin="round" strokeWidth="4" />
          <path d="M-3 63l-21-24m35 17 22-39" fill="none" stroke="#315747" strokeLinecap="round" strokeWidth="10" />
          <circle cx="2" cy="29" r="19" fill="#edb98a" stroke="#315747" strokeWidth="4" />
          <path d="M-15 26c5-18 25-23 37-9l-3-12c-17-11-37-1-39 18z" fill="#7a5946" />
          <path d="M6 34q5 5 10 0" fill="none" stroke="#7b4c3d" strokeLinecap="round" strokeWidth="2.5" />
        </g>

        <g fill="#f1d47e" stroke="#47785b" strokeWidth="3">
          <path d="M86 824c-33-21-21-56 4-49 14 4 15 23 12 34 8-24 28-31 34-14 8 24-19 39-42 41z" />
          <path d="M1190 800c-29-18-19-48 4-42 13 4 13 20 9 30 8-21 25-27 31-12 7 21-17 34-38 36z" />
          <path d="M488 436c-24-15-16-39 3-34 10 3 11 16 7 24 7-17 21-22 26-10 6 17-14 28-31 29z" />
        </g>
        <g fill="#3f805f" opacity=".9">
          <path d="M122 880c-25-18-32-40-17-45 12-4 22 14 25 28-2-25 10-40 21-30 16 14-3 39-20 54z" />
          <path d="M1330 856c-22-17-28-36-14-41 11-3 19 13 22 26-2-22 9-36 19-27 14 13-3 35-18 48z" />
          <path d="M720 893c-19-15-24-31-12-35 9-3 16 11 19 23-2-19 8-31 17-23 12 11-2 30-16 41z" />
        </g>
        <g fill="#fff4c3" opacity=".9">
          <circle cx="135" cy="415" r="3" />
          <circle cx="738" cy="320" r="3" />
          <circle cx="1242" cy="650" r="3" />
          <circle cx="470" cy="315" r="2.5" />
        </g>
      </svg>
    </div>
  );
}

export default function LoginExperience() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formMessage, setFormMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (!authenticateMockUser(email, password)) {
      setFormMessage("Enter your email and password to continue.");
      return;
    }

    router.push(getDashboardPath(role));
  }

  return (
    <main className="login-shell">
      <section className="game-panel" aria-label="Re:Vive recovery journey">
        <RecoveryWorld />
        <header className="world-header">
          <BrandLockup />
          <p className="world-tagline">Your recovery. Your journey.</p>
        </header>
        <div className="story-copy">
          <p className="eyebrow">A little progress, every day</p>
          <h1>Every small step moves you forward.</h1>
        </div>
        <JourneyProgress />
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-form-wrap">
          <p className="login-kicker" aria-live="polite">
            {role === "patient" ? "PLAYER ACCESS" : "CARE TEAM ACCESS"}
          </p>
          <h2 className="login-title" id="login-title">
            Enter your recovery journey
          </h2>
          <p className="login-intro">
            Your next milestone is waiting.
          </p>

          <form onSubmit={handleSubmit}>
            <span className="role-label" id="role-label">
              I am signing in as
            </span>
            <div className="role-switch" role="group" aria-labelledby="role-label">
              <button
                className="role-option"
                type="button"
                aria-pressed={role === "patient"}
                onClick={() => setRole("patient")}
              >
                Patient
              </button>
              <button
                className="role-option"
                type="button"
                aria-pressed={role === "therapist"}
                onClick={() => setRole("therapist")}
              >
                Therapist
              </button>
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="email">
                Email address
              </label>
              <input
                className="text-input"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <div className="password-wrap">
                <input
                  className="text-input"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button
                className="text-action"
                type="button"
                onClick={() =>
                  setFormMessage("Password reset is not available in this demo.")
                }
              >
                Forgot password?
              </button>
            </div>

            <button
              className="login-submit"
              type="submit"
              aria-label="Sign in"
            >
              <span>ENTER </span>
              <span className="submit-arrow" aria-hidden="true">
                →
              </span>
            </button>
            {formMessage && (
              <p className="form-message" role="status">
                {formMessage}
              </p>
            )}
          </form>
        </div>
        <p className="login-support">
          Need help getting started? Reach out to your care team.
        </p>
      </section>
    </main>
  );
}