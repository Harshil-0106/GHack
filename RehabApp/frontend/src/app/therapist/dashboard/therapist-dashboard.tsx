import Link from "next/link";
import styles from "./dashboard.module.css";

type OverviewStat = {
  label: string;
  value: string;
  detail: string;
  icon: "patients" | "adherence" | "attention" | "sessions";
};

type PatientStatus = "On Track" | "Attention";

type Patient = {
  name: string;
  adherence: string;
  streak: string;
  lastActive: string;
  status: PatientStatus;
};

const overviewStats: OverviewStat[] = [
  { label: "PATIENTS", value: "12", detail: "Across active plans", icon: "patients" },
  { label: "AVG ADHERENCE", value: "87%", detail: "Across your patients", icon: "adherence" },
  { label: "NEEDS ATTENTION", value: "3", detail: "May need a check-in", icon: "attention" },
  { label: "TODAY'S SESSIONS", value: "8", detail: "Planned for today", icon: "sessions" },
];

const attentionPatients: { name: string; adherence: string; status: "Needs attention" | "On track" }[] = [
  { name: "Alex", adherence: "62% adherence", status: "Needs attention" },
  { name: "Sam", adherence: "71% adherence", status: "Needs attention" },
  { name: "Jordan", adherence: "95% adherence", status: "On track" },
];

const patients: Patient[] = [
  { name: "Alex", adherence: "92%", streak: "12 days", lastActive: "Today", status: "On Track" },
  { name: "Sam", adherence: "78%", streak: "5 days", lastActive: "Yesterday", status: "Attention" },
  { name: "Jordan", adherence: "95%", streak: "18 days", lastActive: "Today", status: "On Track" },
  { name: "Maya", adherence: "84%", streak: "9 days", lastActive: "Today", status: "On Track" },
];

const activities = [
  { patient: "Alex", detail: "completed Shoulder Mobility", time: "Today · 9:42 AM", type: "complete" },
  { patient: "Jordan", detail: "completed today’s mission", time: "Today · 9:18 AM", type: "complete" },
  { patient: "Sam", detail: "missed today’s session", time: "Today · 8:30 AM", type: "missed" },
] as const;

function Brand() {
  return (
    <Link className={styles.brand} href="/" aria-label="Re:Vive home">
      <span className={styles.brandMark} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className={styles.brandName}>
        Re<span>:Vive</span>
      </span>
    </Link>
  );
}

function StatIcon({ type }: { type: OverviewStat["icon"] }) {
  if (type === "patients") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2Zm12-8a3 3 0 1 0-1-5.8m2 8.3a4.5 4.5 0 0 1 4 4.5v1" /></svg>;
  }
  if (type === "adherence") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5m0 14h17M7 15l4-4 3 2 6-7" /><path d="M16 6h4v4" /></svg>;
  }
  if (type === "attention") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.8 20h18.4L12 3Z" /><path d="M12 9v5m0 3h.01" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2m-8-11 2 2m8-2-2 2" /></svg>;
}

function OverviewCard({ stat }: { stat: OverviewStat }) {
  return (
    <article className={styles.statCard}>
      <span className={`${styles.statIcon} ${styles[`statIcon${stat.icon}`]}`}>
        <StatIcon type={stat.icon} />
      </span>
      <div className={styles.statContent}>
        <p>{stat.label}</p>
        <strong>{stat.value}</strong>
        <span>{stat.detail}</span>
      </div>
    </article>
  );
}

function StatusPill({ status }: { status: PatientStatus | "Needs attention" | "On track" }) {
  const needsAttention = status === "Attention" || status === "Needs attention";
  return (
    <span className={`${styles.statusPill} ${needsAttention ? styles.statusAttention : styles.statusOnTrack}`}>
      <span aria-hidden="true" />
      {status}
    </span>
  );
}

function PatientCards() {
  return (
    <div className={styles.patientCards}>
      {patients.map((patient) => (
        <article className={styles.patientCard} key={patient.name}>
          <div className={styles.patientCardHeader}>
            <strong>{patient.name}</strong>
            <StatusPill status={patient.status} />
          </div>
          <div className={styles.patientMetrics}>
            <div><span>Adherence</span><strong>{patient.adherence}</strong></div>
            <div><span>Streak</span><strong>{patient.streak}</strong></div>
            <div><span>Last Active</span><strong>{patient.lastActive}</strong></div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function TherapistDashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Brand />
          <div className={styles.accountActions}>
            <a className={styles.profileLink} href="#profile" id="profile">
              <span className={styles.profileInitials} aria-hidden="true">CG</span>
              <span>Profile</span>
            </a>
            <Link className={styles.logoutLink} href="/">Logout</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.pageHeading} aria-labelledby="page-title">
          <div>
            <p className={styles.eyebrow}>THERAPIST WORKSPACE</p>
            <h1 id="page-title">Recovery Command Center</h1>
            <h2>Good morning, Care Guide.</h2>
            <p>Here&apos;s how your patients are progressing today.</p>
          </div>
          <button className={styles.assignButton} type="button">
            <span aria-hidden="true">＋</span> ASSIGN MISSION
          </button>
        </section>

        <section className={styles.statsGrid} aria-label="Practice overview">
          {overviewStats.map((stat) => <OverviewCard key={stat.label} stat={stat} />)}
        </section>

        <div className={styles.overviewGrid}>
          <section className={styles.panel} aria-labelledby="attention-title">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionEyebrow}>PATIENT CHECK-INS</p>
                <h2 id="attention-title">Needs Attention</h2>
              </div>
              <span className={styles.countBadge}>3 patients</span>
            </div>
            <div className={styles.attentionList}>
              {attentionPatients.map((patient) => (
                <article className={styles.attentionRow} key={patient.name}>
                  <span className={styles.patientInitial}>{patient.name.slice(0, 1)}</span>
                  <div className={styles.attentionInfo}>
                    <strong>{patient.name}</strong>
                    <span>{patient.adherence}</span>
                  </div>
                  <StatusPill status={patient.status} />
                </article>
              ))}
            </div>
          </section>

          <section className={styles.panel} aria-labelledby="activity-title">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionEyebrow}>TODAY</p>
                <h2 id="activity-title">Recent Recovery Activity</h2>
              </div>
            </div>
            <ul className={styles.activityList}>
              {activities.map((activity) => (
                <li className={styles.activityItem} key={`${activity.patient}-${activity.detail}`}>
                  <span className={`${styles.activityIcon} ${activity.type === "missed" ? styles.activityMissed : styles.activityComplete}`} aria-hidden="true">
                    {activity.type === "missed" ? "⚠" : "✓"}
                  </span>
                  <div>
                    <p><strong>{activity.patient}</strong> {activity.detail}</p>
                    <span>{activity.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className={styles.panel} aria-labelledby="patients-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionEyebrow}>YOUR CARE ROSTER</p>
              <h2 id="patients-title">Patients</h2>
            </div>
            <span className={styles.rosterCount}>4 active</span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.patientTable}>
              <thead>
                <tr>
                  <th scope="col">Patient</th>
                  <th scope="col">Adherence</th>
                  <th scope="col">Streak</th>
                  <th scope="col">Last Active</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.name}>
                    <th scope="row">{patient.name}</th>
                    <td>{patient.adherence}</td>
                    <td>{patient.streak}</td>
                    <td>{patient.lastActive}</td>
                    <td><StatusPill status={patient.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PatientCards />
        </section>
      </main>
    </div>
  );
}