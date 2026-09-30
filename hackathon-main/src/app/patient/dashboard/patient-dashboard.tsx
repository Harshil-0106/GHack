import Link from "next/link";
import styles from "./dashboard.module.css";

type Stat = {
  label: string;
  value: string;
  note: string;
};

type Exercise = {
  name: string;
  status: "Completed" | "In Progress" | "Locked";
  reward: string;
  movement: "raise" | "rotate" | "stretch";
};

const stats: Stat[] = [
  { label: "XP", value: "2,450 XP", note: "550 XP to level 8" },
  { label: "STREAK", value: "🔥 12 Days", note: "Your best is 14" },
];

const progressMetrics = [
  { label: "MISSIONS COMPLETED", value: "18" },
  { label: "EXERCISES COMPLETED", value: "54" },
  { label: "CURRENT STREAK", value: "12 days" },
  { label: "XP EARNED", value: "2,450 XP" },
];

const progressMilestones = [
  { label: "First Mission", marker: "✓", status: "complete" },
  { label: "7 Day Streak", marker: "✓", status: "complete" },
  { label: "14 Day Journey", marker: "★", status: "current" },
  { label: "21 Day Journey", marker: "○", status: "upcoming" },
  { label: "30 Day Journey", marker: "🔒", status: "locked" },
] as const;

const recentProgressActivity = [
  "Shoulder Mobility completed",
  "Arm Raises completed",
  "Recovery mission completed",
];

const milestones = [
  { day: "Day 1", status: "complete", label: "First step", marker: "✓" },
  { day: "Day 7", status: "complete", label: "One week", marker: "✓" },
  { day: "Day 14", status: "current", label: "Current", marker: "★" },
  { day: "Day 21", status: "upcoming", label: "Upcoming", marker: "○" },
  { day: "Day 30", status: "upcoming", label: "Locked", marker: "🔒" },
] as const;

const exercises: Exercise[] = [
  { name: "Arm Raises", status: "Completed", reward: "+40 XP", movement: "raise" },
  { name: "Shoulder Rotation", status: "In Progress", reward: "+40 XP", movement: "rotate" },
  { name: "Stretch Hold", status: "Locked", reward: "+40 XP", movement: "stretch" },
];

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

function MovementGlyph({ movement }: { movement: Exercise["movement"] }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      {movement === "raise" && (
        <>
          <circle cx="24" cy="12" r="5" />
          <path d="M24 18v16m0-11L12 12m12 11 12-11M18 39l6-5 6 5" />
        </>
      )}
      {movement === "rotate" && (
        <>
          <circle cx="24" cy="12" r="5" />
          <path d="M24 18v17m0-12L12 28m12-5 10-9m-17 25 7-6 8 6" />
          <path d="M33 10h6v6" />
        </>
      )}
      {movement === "stretch" && (
        <>
          <circle cx="24" cy="12" r="5" />
          <path d="m24 18-3 14m2-10-11-5m11 5 12-7M13 40l8-8 8 8" />
        </>
      )}
    </svg>
  );
}

function MissionLandscape() {
  return (
    <svg className={styles.missionLandscape} viewBox="0 0 380 250" aria-hidden="true">
      <circle cx="276" cy="52" r="31" fill="#f5d87e" opacity=".9" />
      <path d="M0 159c62-41 106-28 159 5 56-50 107-35 146-7 24-16 49-24 75-24v117H0Z" fill="#4c8b6d" />
      <path d="M0 195c48-29 95-36 149-10 40-25 91-28 126-10 43-23 74-23 105-11v86H0Z" fill="#36745b" />
      <path d="M-25 260c72-72 130-61 182-79 43-15 48-66 98-74 36-6 64 7 103-31" fill="none" stroke="#bc9957" strokeWidth="34" strokeLinecap="round" opacity=".75" />
      <path d="M-25 260c72-72 130-61 182-79 43-15 48-66 98-74 36-6 64 7 103-31" fill="none" stroke="#f4dda0" strokeWidth="27" strokeLinecap="round" />
      <path d="M-25 260c72-72 130-61 182-79 43-15 48-66 98-74 36-6 64 7 103-31" fill="none" stroke="#fff5d0" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" />
      <circle cx="327" cy="75" r="21" fill="#f6d56f" stroke="#fff1bb" strokeWidth="6" />
      <path d="m319 75 6 6 11-13" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 209v-28m-9 28 9-21 10 21m229-30v-25m-8 25 8-19 8 19" fill="none" stroke="#b6d39c" strokeWidth="4" strokeLinecap="round" />
      <path d="M58 198c-16-11-11-27 2-24 7 2 7 11 5 17 4-12 14-16 18-7 4 12-10 20-25 21Z" fill="#e7bb65" />
      <path d="M272 170c-15-10-10-24 2-21 6 2 6 10 4 15 4-11 13-14 16-6 4 11-9 18-22 19Z" fill="#e7bb65" />
    </svg>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <article className={styles.statCard}>
      <div className={styles.statCopy}>
        <p className={styles.statLabel}>{stat.label}</p>
        <p className={styles.statValue}>{stat.value}</p>
        <p className={styles.statNote}>{stat.note}</p>
      </div>
    </article>
  );
}

function ProgressSection() {
  return (
    <section className={styles.progressSection} id="progress" aria-labelledby="progress-title">
      <div className={styles.progressSectionHeading}>
        <div>
          <p className={styles.sectionEyebrow}>YOUR RECOVERY SNAPSHOT</p>
          <h2 id="progress-title">My Progress</h2>
        </div>
      </div>

      <div className={styles.overallProgress}>
        <div className={styles.overallProgressValue}>
          <span>OVERALL PROGRESS</span>
          <strong>72%</strong>
        </div>
        <div className={styles.overallProgressTrack}>
          <div
            className={styles.overallProgressFill}
            role="progressbar"
            aria-label="Overall recovery progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={72}
          />
        </div>
      </div>

      <div className={styles.progressMetrics}>
        {progressMetrics.map((metric) => (
          <article className={styles.progressMetric} key={metric.label}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>

      <div className={styles.progressDetails}>
        <section className={styles.panel} aria-labelledby="progress-milestones-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionEyebrow}>YOUR JOURNEY SO FAR</p>
              <h3 id="progress-milestones-title">Recovery Milestones</h3>
            </div>
          </div>
          <ol className={styles.progressMilestones}>
            {progressMilestones.map((milestone) => (
              <li className={styles.progressMilestone} data-state={milestone.status} key={milestone.label}>
                <span className={styles.progressMilestoneNode} aria-hidden="true">{milestone.marker}</span>
                <span>{milestone.label}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.panel} aria-labelledby="recent-progress-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionEyebrow}>KEEP IT UP</p>
              <h3 id="recent-progress-title">Recent Activity</h3>
            </div>
          </div>
          <ul className={styles.progressActivity}>
            {recentProgressActivity.map((activity) => (
              <li key={activity}>
                <span aria-hidden="true">✓</span>
                {activity}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

function RecoveryJourney() {
  return (
    <section className={styles.panel} id="recovery-journey" aria-labelledby="journey-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.sectionEyebrow}>THE LONG GAME</p>
          <h2 id="journey-title">Your recovery journey</h2>
        </div>
        <span className={styles.chapterLabel}>CHAPTER 2</span>
      </div>
      <p className={styles.journeySummary}>You have reached the halfway point of your first month.</p>
      <ol className={styles.milestoneList}>
        {milestones.map((milestone) => (
          <li
            className={styles.milestone}
            data-state={milestone.status}
            key={milestone.day}
            aria-current={milestone.status === "current" ? "step" : undefined}
          >
            <span className={styles.milestoneNode}>
              {milestone.marker}
            </span>
            <span className={styles.milestoneDay}>{milestone.day}</span>
            <span className={styles.milestoneLabel}>{milestone.label}</span>
          </li>
        ))}
      </ol>
      <div className={styles.journeyFooter}>
        <span className={styles.journeyFooterDot} />
        <span>Next checkpoint</span>
        <strong>Day 21</strong>
      </div>
    </section>
  );
}

function AvatarIllustration() {
  return (
    <svg className={styles.avatarIllustration} viewBox="0 0 180 180" aria-hidden="true">
      <circle cx="90" cy="90" r="82" fill="#e8f1df" />
      <path d="M17 111c22-17 42-17 63-4 25-16 52-15 83 3v54H17Z" fill="#c4ddbd" />
      <path d="M29 143c17-18 36-16 52-6 20-15 45-12 70 4v23H29Z" fill="#93bd92" />
      <circle cx="90" cy="74" r="31" fill="#efbd91" />
      <path d="M59 72c0-26 14-42 36-42 20 0 34 15 34 39-8-9-17-14-28-14-13 0-24 8-42 17Z" fill="#54463d" />
      <path d="M73 78c3 0 5 2 5 5m24-5c3 0 5 2 5 5" fill="none" stroke="#4a433d" strokeWidth="3" strokeLinecap="round" />
      <path d="M82 94q8 7 16 0" fill="none" stroke="#9b5e51" strokeWidth="3" strokeLinecap="round" />
      <path d="M51 158c4-31 18-48 39-48s36 17 40 48" fill="#438064" />
      <path d="m76 111 14 15 14-15" fill="#f3d783" />
      <circle cx="137" cy="51" r="18" fill="#f5da89" stroke="#fff8df" strokeWidth="5" />
      <path d="m137 41 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#a8792a" />
      <path d="M35 54c-8-7-6-17 2-16 5 1 5 6 4 10 3-7 8-10 11-5 3 7-5 12-14 13Z" fill="#6f9c78" />
    </svg>
  );
}

function AvatarCard() {
  return (
    <section className={`${styles.panel} ${styles.avatarCard}`} aria-labelledby="avatar-title">
      <div className={styles.avatarHeading}>
        <div>
          <h2 id="avatar-title">Your avatar</h2>
        </div>
        <span className={styles.avatarLevel}>LVL 7</span>
      </div>
      <AvatarIllustration />
      <div className={styles.avatarStats}>
        <div>
          <span>LEVEL</span>
          <strong>Level 7</strong>
        </div>
        <div>
          <span>BALANCE</span>
          <strong>320 RC</strong>
        </div>
      </div>
      <button className={styles.customizeButton} type="button" disabled>
        CUSTOMIZE
      </button>
    </section>
  );
}

function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const stateClass = {
    Completed: styles.statusCompleted,
    "In Progress": styles.statusProgress,
    Locked: styles.statusLocked,
  }[exercise.status];

  return (
    <article className={styles.exerciseCard}>
      <div className={`${styles.movementIcon} ${stateClass}`}>
        <MovementGlyph movement={exercise.movement} />
      </div>
      <div className={styles.exerciseCopy}>
        <p className={styles.exerciseIndex}>EXERCISE 0{index + 1}</p>
        <h3>{exercise.name}</h3>
        <span className={`${styles.exerciseStatus} ${stateClass}`}>
          <span className={styles.statusDot} />
          {exercise.status}
        </span>
      </div>
      <span className={styles.exerciseReward}>{exercise.reward}</span>
    </article>
  );
}

export default function PatientDashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Brand />
          <nav className={styles.primaryNav} aria-label="Patient dashboard">
            <Link className={styles.navLink} href="/patient/dashboard">Recovery Journey</Link>
            <Link className={styles.navLink} href="/patient/dashboard#progress">My Progress</Link>
            <Link className={styles.navLink} href="/patient/profile">Profile</Link>
          </nav>
          <Link className={styles.logoutLink} href="/">Logout</Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.welcome} aria-labelledby="welcome-title">
          <div>
            <p className={styles.welcomeEyebrow}>TUESDAY, YOUR JOURNEY CONTINUES</p>
            <h1 id="welcome-title">Good morning, Alex <span aria-hidden="true">👋</span></h1>
            <h2>Ready for today&apos;s recovery mission?</h2>
            <p className={styles.welcomeText}>Every session brings you one step closer.</p>
          </div>
          <div className={styles.welcomeBadge}>
            <span className={styles.badgeIcon} aria-hidden="true">✦</span>
            <div>
              <span className={styles.badgeLabel}>CURRENT CHAPTER</span>
              <strong>The steady climb</strong>
              <span className={styles.badgeMeta}>Day 12 of your journey</span>
            </div>
          </div>
        </section>

        <section className={styles.statsGrid} aria-label="Recovery overview">
          {stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
        </section>

        <ProgressSection />

        <section className={styles.missionCard} aria-labelledby="mission-title">
          <MissionLandscape />
          <div className={styles.missionContent}>
            <div className={styles.missionTopline}>
              <span className={styles.missionEyebrow}>TODAY&apos;S RECOVERY MISSION</span>
              <span className={styles.missionDay}>DAY 12 <span aria-hidden="true">•</span> CHAPTER 2</span>
            </div>
            <h2 id="mission-title">Shoulder Mobility — Session 12</h2>
            <p className={styles.missionDescription}>Complete your assigned exercises and keep your recovery streak alive.</p>
            <ul className={styles.missionMeta} aria-label="Mission rewards and duration">
              <li><span aria-hidden="true">◌</span> 3 Exercises</li>
              <li><span aria-hidden="true">◷</span> 15 min</li>
              <li><span aria-hidden="true">✦</span> +120 XP</li>
              <li><span aria-hidden="true">⬡</span> +30 RC</li>
            </ul>
            <Link className={styles.missionButton} href="/patient/dashboard/mission">
              START MISSION <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <div className={styles.journeyAvatarGrid}>
          <RecoveryJourney />
          <AvatarCard />
        </div>

        <section className={styles.panel} id="today-exercises" aria-labelledby="exercises-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionEyebrow}>SESSION 12</p>
              <h2 id="exercises-title">Today&apos;s exercises</h2>
            </div>
            <span className={styles.exerciseCount}>1 OF 3 COMPLETE</span>
          </div>
          <div className={styles.exerciseGrid}>
            {exercises.map((exercise, index) => (
              <ExerciseCard key={exercise.name} exercise={exercise} index={index} />
            ))}
          </div>
          <aside className={styles.careNote} aria-labelledby="care-title">
            <span className={styles.careMark} aria-hidden="true">✦</span>
            <div>
              <p className={styles.sectionEyebrow}>CARE GUIDE UPDATE</p>
              <p id="care-title">“Great consistency this week. Keep your streak going!”</p>
              <span>— Your Care Guide</span>
            </div>
          </aside>
        </section>

        <footer className={styles.motivation}>
          <span aria-hidden="true">✦</span>
          <p>Small steps. Big progress.</p>
          <span aria-hidden="true">✦</span>
        </footer>
      </main>
    </div>
  );
}
