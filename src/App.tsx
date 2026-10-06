import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number; opacity: number;
}

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  dotColor: 'cyan' | 'purple' | 'amber';
  highlight?: string;
  bullets: string[];
  tags: string[];
  side: 'left' | 'right';
}

interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  videoId?: string;
  technologies: string[];
  links?: { label: string; url: string }[];
  featured: boolean;
}

interface SkillGroupItem {
  category: string;
  icon: string;
  color: 'cyan' | 'purple' | 'pink' | 'green' | 'amber';
  skills: string[];
}

interface EduItem {
  badge: 'phd' | 'masters' | 'bachelors';
  label: string;
  degree: string;
  institution: string;
  period: string;
  note?: string;
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'retailtech',
    title: 'Product Development Manager',
    company: 'Retailtech Oy / Vision Oy',
    period: '2021 – 2025',
    dotColor: 'cyan',
    side: 'right',
    highlight: '20+ deployments · 5 customer sites',
    bullets: [
      'Presented embedded AI analytics demos to customers at 5+ sites across Finland',
      'Replaced the off-the-shelf ultrasonic sensor with our own ESP32 + VL53L1X design after customers questioned the readings; wrong readings dropped to almost none',
      'Built CI/CD pipeline and JavaScript monitoring dashboard for faster rollouts',
    ],
    tags: ['IoT', 'AI Analytics', 'ESP32', 'CI/CD', 'Customer Demos'],
  },
  {
    id: 'lut-researcher',
    title: 'Researcher',
    company: 'LUT University',
    period: '2019 – 2021',
    dotColor: 'purple',
    side: 'left',
    highlight: '95% RL task success · IEEE published',
    bullets: [
      'Built RL-driven Mevea simulations of autonomous excavators & forestry forwarders',
      'Designed Python APIs linking simulation engines to control systems',
      'Built Unity (C#) simulation modules for industrial worker behaviour modelling',
      'Presented at Mevea conferences; contributed to Business Finland grants',
    ],
    tags: ['Mevea', 'Unity', 'Python', 'RL', 'IEEE', 'Business Finland'],
  },
  {
    id: 'lut-teacher',
    title: 'Teacher, Software Development',
    company: 'LUT University',
    period: '2019 – 2020',
    dotColor: 'amber',
    side: 'right',
    highlight: '40+ students taught',
    bullets: [
      'Designed and delivered Python & C++ courses to 20 bachelor’s students per semester',
      'Maintained high engagement through fully online delivery during COVID-19',
    ],
    tags: ['Python', 'C++', 'Teaching', 'Course Design'],
  },
  {
    id: 'masters-thesis',
    title: "Master's Thesis Researcher — Heavy Machinery VR",
    company: 'LUT University',
    period: '2018',
    dotColor: 'cyan',
    side: 'left',
    highlight: 'Graded with distinction',
    bullets: [
      'Built C++/Python co-simulation framework linking Mevea and Unreal Engine 4 via UDP',
      'Synchronised physics, visualisation & operator control in real time',
      'Integrated Leap Motion VR gesture controls for immersive digital twin testing',
    ],
    tags: ['C++', 'Python', 'Mevea', 'UE4', 'UDP', 'VR', 'Leap Motion'],
  },
  {
    id: 'project-researcher',
    title: 'Project Researcher',
    company: 'LUT University',
    period: '2017 – 2018',
    dotColor: 'purple',
    side: 'right',
    bullets: [
      'Created digital twin environments for Valtra tractor & Kesla forklift in Blender + Mevea',
      'Implemented pallet loading/unloading interaction logic for operational validation',
    ],
    tags: ['Blender', 'Mevea', 'Digital Twins', 'CAD'],
  },
  {
    id: 'agromash',
    title: 'Production Technology Engineer Intern',
    company: 'Agromash Holding',
    period: '2014',
    dotColor: 'amber',
    side: 'left',
    bullets: [
      'Developed 20+ manufacturing documents for Hyundai Elantra & Tucson assembly lines',
      'Liaison/translator for international Korean & Czech engineering teams',
    ],
    tags: ['Manufacturing', 'Documentation', 'International'],
  },
];

const PROJECTS: ProjectItem[] = [
  {
    id: 'cosim',
    title: 'Real-Time Co-Simulation Framework',
    subtitle: "Master's Thesis Project",
    description:
      'Bidirectional co-simulation connecting Mevea physics engine with Unreal Engine 4 via UDP networking. Integrated Leap Motion VR gesture controls for immersive digital twin testing of heavy machinery. Presented at Mevea conference.',
    videoId: 'oI5JLkF0IXE',
    technologies: ['C++', 'Python', 'Mevea', 'Unreal Engine 4', 'UDP Networking', 'VR / Leap Motion'],
    featured: true,
  },
  {
    id: 'excavator',
    title: 'Autonomous Excavator',
    subtitle: 'Reinforcement Learning',
    description:
      'Fully autonomous excavation AI using RL in a realistic Mevea physics environment with accurate hydraulics and flexible terrain. Achieved practical autonomous control in complex, variable conditions. Published in IEEE Xplore.',
    videoId: 'Es-QVst9efw',
    technologies: ['Python', 'Mevea', 'Reinforcement Learning', 'Simulation APIs'],
    links: [{ label: 'IEEE Xplore', url: 'https://ieeexplore.ieee.org/abstract/document/9268069' }],
    featured: true,
  },
  {
    id: 'forwarder',
    title: 'Forestry Forwarder Automation',
    subtitle: 'Reinforcement Learning',
    description:
      'RL policies for complex log manipulation with a forestry forwarder in Nvidia Isaac Gym — reaching, grasping, and placing logs in variable scenarios. Proved scalability of simulation-based AI training for industrial manipulation. Published in Archive of Mechanical Engineering.',
    videoId: 'y5ouk1W6QIc',
    technologies: ['Python', 'Nvidia Isaac Gym', 'Isaac Lab', 'Reinforcement Learning'],
    links: [{ label: 'arXiv Paper', url: 'https://arxiv.org/abs/2510.26363' }],
    featured: true,
  },
  {
    id: 'iot',
    title: 'IoT Retail Analytics System',
    subtitle: 'Investor-backed product',
    description:
      'Real-time occupancy and customer behaviour tracking for retail environments. Designed multiple sensor prototypes, embedded firmware, Python AI analytics, and AWS integration. Deployed 20+ units across 5 live retail locations.',
    technologies: ['ESP32 (C++)', 'Raspberry Pi CM4', 'Python', 'AWS', 'PCB Design', 'IoT'],
    featured: false,
  },
  {
    id: 'expense',
    title: 'Project Expense Tracker',
    subtitle: 'FastAPI + Flutter',
    description:
      'Full-stack mobile and web app for tracking project expenses with clean architecture, JWT authentication, and cross-platform UI. Focus on clean code patterns and practical usability.',
    technologies: ['Python (FastAPI)', 'Flutter', 'REST API', 'Auth'],
    featured: false,
  },
];

const SKILL_GROUPS: SkillGroupItem[] = [
  {
    category: 'Simulation & 3D',
    icon: '🎮',
    color: 'cyan',
    skills: ['Mevea', 'Unity (C#)', 'Unreal Engine 4', 'Blender', 'Fusion 360', 'SolidWorks', 'Onshape', 'Nvidia Isaac Lab', 'Digital Twins', 'Robot Offline Programming'],
  },
  {
    category: 'AI & Machine Learning',
    icon: '🤖',
    color: 'purple',
    skills: ['Reinforcement Learning', 'Keras / TensorFlow', 'ROS 2', 'Simulation APIs', 'Python (Advanced)', 'AI Analytics'],
  },
  {
    category: 'Industrial & IoT',
    icon: '🏭',
    color: 'pink',
    skills: ['ESP32 / Embedded C++', 'Raspberry Pi CM4', 'Sensor Integration', 'UDP Networking', 'PCB Design', 'AWS'],
  },
  {
    category: 'Software & DevOps',
    icon: '💻',
    color: 'green',
    skills: ['Python', 'C++', 'C# (Unity)', 'TypeScript / JavaScript', 'FastAPI', 'Flutter', 'Git', 'CI/CD', 'AWS'],
  },
  {
    category: 'Customer & Research',
    icon: '🎯',
    color: 'amber',
    skills: ['Technical Demos', 'Customer Training', 'Conference Presentations', 'Scientific Writing', 'Grant Applications', 'Stakeholder Communication', 'Mentoring'],
  },
];

const EDUCATION: EduItem[] = [
  {
    badge: 'phd',
    label: 'PhD',
    degree: 'Doctoral Researcher in Mechatronic System Design',
    institution: 'LUT University',
    period: '2018 – present (part-time)',
    note: 'Dissertation: Autonomous Control Systems for Heavy Machinery. Final paper published — write-up in progress alongside industry work.',
  },
  {
    badge: 'masters',
    label: "Master's",
    degree: "Master's in Mechatronic System Design",
    institution: 'LUT University',
    period: '2016 – 2018',
    note: 'Thesis graded with distinction.',
  },
  {
    badge: 'bachelors',
    label: "Bachelor's",
    degree: 'Bachelor in Mechanical Engineering & Production Technology',
    institution: 'Saimaa University of Applied Sciences',
    period: '2013 – 2016',
  },
];

const STATS = [
  { value: 8,  suffix: '+', label: 'Years Experience' },
  { value: 3,  suffix: '',  label: 'Publications' },
  { value: 20, suffix: '+', label: 'HW Deployments' },
  { value: 40, suffix: '+', label: 'Students Taught' },
  { value: 95, suffix: '%', label: 'RL Task Success' },
  { value: 5,  suffix: '',  label: 'Major Projects' },
];

const TYPING_TEXTS = [
  'Simulation Software Engineer',
  'Digital Twin Architect',
  'Autonomous Systems Researcher',
  'Industrial AI Developer',
];

const HERO_PILLS = [
  { label: '8+ Years in 3D Simulation', color: 'cyan' },
  { label: 'IEEE Published', color: 'purple' },
  { label: 'Industrial IoT', color: 'pink' },
  { label: '40+ Students Taught', color: 'amber' },
  { label: 'PhD Researcher', color: 'green' },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useTypingEffect(texts: string[], speed = 75, pause = 2200): string {
  const [displayed, setDisplayed] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIdx < current.length) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        }, speed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pause);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        }, speed / 2);
      } else {
        setIsDeleting(false);
        setTextIdx(i => (i + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, textIdx, texts, speed, pause]);

  return displayed;
}

function useCountUp(target: number, isVisible: boolean, duration = 1800): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [isVisible, target, duration]);
  return count;
}

// ─── PARTICLE CANVAS ─────────────────────────────────────────────────────────

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 14000), 80);
    particles.current = Array.from({ length: count }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      vx:      (Math.random() - 0.5) * 0.25,
      vy:      (Math.random() - 0.5) * 0.25,
      radius:  Math.random() * 1.5 + 0.4,
      opacity: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ps = particles.current;

      ps.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${0.18 * (1 - d / 130)})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45, pointerEvents: 'none' }}
    />
  );
};

// ─── NAV ─────────────────────────────────────────────────────────────────────

const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <span className="nav-logo">IK_</span>
      <ul className="nav-links">
        {(['Experience', 'Projects', 'Skills', 'Education'] as const).map(s => (
          <li key={s}>
            <a href={`#${s.toLowerCase()}`}>{s}</a>
          </li>
        ))}
      </ul>
      <a className="nav-cta" href="mailto:kurinov.ilya@gmail.com">
        Contact
      </a>
    </nav>
  );
};

// ─── HERO ────────────────────────────────────────────────────────────────────

const Hero: React.FC = () => {
  const typed = useTypingEffect(TYPING_TEXTS);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <section className="hero" id="home">
      <div className="hero-bg-gradient" />
      <div className="grid-overlay" />
      <ParticleCanvas />

      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="hero-eyebrow" variants={itemVariants}>
          // simulation · digital twins · autonomous systems
        </motion.p>

        <motion.h1 className="hero-name" variants={itemVariants}>
          Ilya Kurinov
        </motion.h1>

        <motion.div className="hero-typing-wrap" variants={itemVariants}>
          <span className="hero-typing">{typed}</span>
          <span className="hero-cursor" />
        </motion.div>

        <motion.p className="hero-tagline" variants={itemVariants}>
          8+ years building industrial 3D simulations, digital twins, and autonomous AI systems
          that bridge the virtual and physical worlds.
        </motion.p>

        <motion.div className="hero-pills" variants={itemVariants}>
          {HERO_PILLS.map(p => (
            <span key={p.label} className={`hero-pill ${p.color}`}>{p.label}</span>
          ))}
        </motion.div>

        <motion.div className="hero-actions" variants={itemVariants}>
          <a className="btn-primary" href="#projects">View Projects</a>
          <a
            className="btn-secondary"
            href="https://github.com/iku-work"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
          <a
            className="btn-secondary"
            href="https://linkedin.com/in/ilya-kurinov"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
        </motion.div>
      </motion.div>

      <div className="hero-scroll-hint">
        <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
          <rect x="1" y="1" width="14" height="20" rx="7" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="7" r="2" fill="currentColor">
            <animateTransform attributeName="transform" type="translate"
              values="0,0;0,6;0,0" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
        scroll
      </div>
    </section>
  );
};

// ─── STAT ITEM ───────────────────────────────────────────────────────────────

const StatItem: React.FC<{ value: number; suffix: string; label: string }> = ({ value, suffix, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, margin: '-50px' });
  const count = useCountUp(value, isVisible);

  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-value">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

// ─── STATS BAND ──────────────────────────────────────────────────────────────

const StatsBand: React.FC = () => (
  <div className="stats-band">
    <div className="stats-grid">
      {STATS.map(s => (
        <StatItem key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
      ))}
    </div>
  </div>
);

// ─── TIMELINE ────────────────────────────────────────────────────────────────

const TimelineItem: React.FC<{ item: ExperienceItem; index: number }> = ({ item, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, margin: '-80px' });

  const isRight = item.side === 'right';

  return (
    <motion.div
      className="tl-item"
      ref={ref}
      initial={{ opacity: 0, x: isRight ? 40 : -40 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
    >
      {isRight ? (
        <>
          <div className="tl-empty" />
          <div className={`tl-dot ${item.dotColor}`} />
          <div className="tl-card right">
            <TLCardContent item={item} />
          </div>
        </>
      ) : (
        <>
          <div className="tl-card left">
            <TLCardContent item={item} />
          </div>
          <div className={`tl-dot ${item.dotColor}`} />
          <div className="tl-empty right" />
        </>
      )}
    </motion.div>
  );
};

const TLCardContent: React.FC<{ item: ExperienceItem }> = ({ item }) => (
  <>
    <div className="tl-period">{item.period}</div>
    <div className="tl-title">{item.title}</div>
    <div className="tl-company">{item.company}</div>
    {item.highlight && <div className="tl-highlight">{item.highlight}</div>}
    <ul className="tl-bullets">
      {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
    </ul>
    <div className="tl-tags">
      {item.tags.map(t => <span key={t} className="tl-tag">{t}</span>)}
    </div>
  </>
);

const Timeline: React.FC = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleVisible = useInView(titleRef, { once: true });

  return (
    <div className="timeline-outer" id="experience">
      <div className="section">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">// career</p>
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">
            From automotive assembly lines to autonomous heavy machinery — a decade of building
            things that work in the real world.
          </p>
        </motion.div>

        <div className="timeline-track">
          <div className="timeline-line" />
          {EXPERIENCES.map((exp, i) => (
            <TimelineItem key={exp.id} item={exp} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── PROJECTS ────────────────────────────────────────────────────────────────

const FeaturedProjectCard: React.FC<{ project: ProjectItem; index: number }> = ({ project, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className="project-card-featured"
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      style={{ flexDirection: isEven ? 'row' : 'row-reverse' } as React.CSSProperties}
    >
      <div className="project-video-wrap cover">
        {project.videoId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${project.videoId}?modestbranding=1&rel=0`}
            title={project.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div style={{ background: 'var(--bg3)', height: '100%', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: '0.75rem' }}>No video</span>
          </div>
        )}
      </div>
      <div className="project-info">
        <div className="project-subtitle-label">{project.subtitle}</div>
        <div className="project-title">{project.title}</div>
        <p className="project-desc">{project.description}</p>
        <div className="project-tech-tags">
          {project.technologies.map(t => (
            <span key={t} className="project-tech-tag">{t}</span>
          ))}
        </div>
        {project.links && project.links.length > 0 && (
          <div className="project-links">
            {project.links.map(l => (
              <a key={l.url} className="project-link" href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SmallProjectCard: React.FC<{ project: ProjectItem; index: number }> = ({ project, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="project-card-small"
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="project-subtitle-label">{project.subtitle}</div>
      <div className="project-title" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{project.title}</div>
      <p className="project-desc" style={{ fontSize: '0.83rem', marginBottom: '1rem' }}>{project.description}</p>
      <div className="project-tech-tags">
        {project.technologies.map(t => <span key={t} className="project-tech-tag">{t}</span>)}
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleVisible = useInView(titleRef, { once: true });
  const featured = PROJECTS.filter(p => p.featured);
  const small    = PROJECTS.filter(p => !p.featured);

  return (
    <div className="projects-outer" id="projects">
      <div className="section">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">// portfolio</p>
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">
            Real simulations. Real deployments. Real publications.
          </p>
        </motion.div>

        {featured.map((p, i) => (
          <FeaturedProjectCard key={p.id} project={p} index={i} />
        ))}

        <div className="projects-grid-small">
          {small.map((p, i) => (
            <SmallProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── SKILLS ──────────────────────────────────────────────────────────────────

const SkillGroupCard: React.FC<{ group: SkillGroupItem; index: number }> = ({ group, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="skill-group-card"
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="skill-group-header">
        <span className="skill-group-icon">{group.icon}</span>
        <span className="skill-group-title">{group.category}</span>
      </div>
      <div className="skill-tags">
        {group.skills.map(s => (
          <span key={s} className={`skill-tag ${group.color}`}>{s}</span>
        ))}
      </div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleVisible = useInView(titleRef, { once: true });

  return (
    <div className="skills-outer" id="skills">
      <div className="section">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">// tech stack</p>
          <h2 className="section-title">Skills</h2>
          <p className="section-subtitle">
            From physics engines to embedded hardware — spanning simulation, AI, hardware, and software.
          </p>
        </motion.div>

        <div className="skills-grid">
          {SKILL_GROUPS.map((g, i) => (
            <SkillGroupCard key={g.category} group={g} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── EDUCATION ───────────────────────────────────────────────────────────────

const Education: React.FC = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleVisible = useInView(titleRef, { once: true });

  return (
    <div className="edu-outer" id="education">
      <div className="section">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">// academia</p>
          <h2 className="section-title">Education</h2>
          <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
            LUT University, Finland — from bachelor's workshop floor to doctoral research.
          </p>
        </motion.div>

        <div className="edu-grid">
          {EDUCATION.map((edu, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const isVisible = useInView(ref, { once: true });
            return (
              <motion.div
                key={edu.badge}
                ref={ref}
                className="edu-card"
                initial={{ opacity: 0, y: 25 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <div className={`edu-badge ${edu.badge}`}>{edu.label}</div>
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-institution">{edu.institution}</div>
                <div className="edu-period">{edu.period}</div>
                {edu.note && <div className="edu-note">{edu.note}</div>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── FOOTER ──────────────────────────────────────────────────────────────────

const Footer: React.FC = () => (
  <footer>
    <div className="footer-name">Ilya Kurinov</div>
    <div className="footer-role">Simulation Engineer · Digital Twin Architect · AI Researcher</div>
    <div className="footer-links">
      <a className="footer-link" href="mailto:kurinov.ilya@gmail.com">Email ↗</a>
      <a className="footer-link" href="https://linkedin.com/in/ilya-kurinov" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      <a className="footer-link" href="https://github.com/iku-work" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
      <a className="footer-link" href="https://ieeexplore.ieee.org/abstract/document/9268069" target="_blank" rel="noopener noreferrer">IEEE Paper ↗</a>
      <a className="footer-link" href="https://arxiv.org/abs/2510.26363" target="_blank" rel="noopener noreferrer">arXiv Paper ↗</a>
    </div>
    <div className="footer-copy">
      © 2026 Ilya Kurinov · Espoo, Finland · Open to relocation
    </div>
  </footer>
);

// ─── APP ─────────────────────────────────────────────────────────────────────

const App: React.FC = () => (
  <>
    <Nav />
    <Hero />
    <StatsBand />
    <Timeline />
    <Projects />
    <Skills />
    <Education />
    <Footer />
  </>
);

export default App;
