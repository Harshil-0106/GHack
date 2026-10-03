import Link from "next/link";

type DashboardPlaceholderProps = {
  role: "Patient" | "Therapist";
};

export default function DashboardPlaceholder({ role }: DashboardPlaceholderProps) {
  return (
    <main className="route-placeholder">
      <div className="route-placeholder-content">
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
        <h1>{role} space coming soon</h1>
        <p>This destination is ready for the next stage of the project.</p>
        <Link className="back-link" href="/">
          Return to sign in
        </Link>
      </div>
    </main>
  );
}