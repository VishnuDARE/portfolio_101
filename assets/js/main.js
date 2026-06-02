const PROJECT_MEDIA_LIMIT = 12;
const DOCUMENT_NAMES = ["documentation.pdf", "doc1.pdf", "doc2.pdf", "project-documentation.pdf"];
const VIDEO_NAMES = ["video1.mp4", "video2.mp4", "demo.mp4"];
const SMART_LOADING_MESSAGES = [
  "Compiling ambition...",
  "Fixing bugs...",
  "Loading projects...",
  "Teaching CSS to behave...",
  "Searching for missing semicolons...",
  "Optimizing performance...",
  "Loading coffee...",
  "Connecting modules...",
  "Preparing portfolio..."
];

const state = {
  site: null,
  projects: [],
  activeProjectFilter: "all",
  search: "",
  galleryItems: [],
  lightboxItems: [],
  lightboxIndex: 0,
  activeProject: null,
  projectTransitioning: false,
  visitedProjects: new Set(),
  achievements: new Set(),
  soundEnabled: false,
  commandPaletteIndex: 0
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const randomLoadingMessage = () => SMART_LOADING_MESSAGES[Math.floor(Math.random() * SMART_LOADING_MESSAGES.length)];
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#039;"
}[char]));

document.addEventListener("DOMContentLoaded", async () => {
  initDeveloperLoader();
  applyTheme();
  bindShell();
  bindPremiumInteractions();
  await loadSite();
  startTyping();
  renderSkills();
  initCapabilityModules();
  initCommandCenter();
  initContactConsole();
  await loadProjects();
  await renderCertificates();
  renderGallery();
  loadGitHubShowcase().finally(() => initGitHubDashboard());
  initAnimationLibraries();
  observeReveals();
  animateCounters();
  animateSkillBars();
  initTerminalSectionHeaders();
  initHiddenInteractions();
  $("#year") && ($("#year").textContent = new Date().getFullYear());
});

function initDeveloperLoader() {
  const loader = $("#pageLoader");
  const lineRoot = $("#loaderLines");
  const progress = $("#loaderProgress");
  const progressFill = $(".progress-track span", loader);
  const percent = $("#loaderPercent");
  const access = $("#accessMessage");
  const welcome = $("#welcomeMessage");
  const matrixField = $("#matrixField");
  if (!loader || !lineRoot) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bootLines = Array.from({ length: 5 }, randomLoadingMessage).concat("Welcome Vishnu Chauhan");

  if (matrixField) {
    const symbols = "01{}[]<>/\\#$";
    const count = Math.min(70, Math.max(28, Math.floor(window.innerWidth / 18)));
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < count; index += 1) {
      const char = document.createElement("span");
      char.className = "matrix-char";
      char.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      char.style.left = `${Math.random() * 100}%`;
      char.style.setProperty("--matrix-speed", `${7 + Math.random() * 8}s`);
      char.style.setProperty("--matrix-delay", `${Math.random() * -9}s`);
      fragment.append(char);
    }
    matrixField.append(fragment);
  }

  const wait = (duration) => new Promise((resolve) => setTimeout(resolve, reducedMotion ? 40 : duration));
  const typeLine = async (text) => {
    const line = document.createElement("div");
    const content = document.createElement("span");
    const cursor = document.createElement("span");
    line.className = "terminal-line";
    cursor.className = "terminal-cursor";
    line.append(content, cursor);
    lineRoot.append(line);

    if (reducedMotion) {
      content.textContent = text;
      cursor.remove();
      return;
    }

    for (let index = 1; index <= text.length; index += 1) {
      content.textContent = text.slice(0, index);
      await wait(6 + Math.random() * 4);
    }
    cursor.remove();
  };

  const runBoot = async () => {
    for (const line of bootLines) {
      await typeLine(line);
      await wait(135);
    }

    progress?.classList.add("show");
    await wait(60);
    if (progressFill) progressFill.style.width = "100%";
    if (percent) percent.textContent = "100%";
    await wait(340);

    access?.classList.add("show");
    await wait(190);
    welcome?.classList.add("show");
    await wait(210);
    loader.classList.add("done");
  };

  runBoot();
}

function bindShell() {
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");
  navToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach((link) => link.addEventListener("click", () => navLinks.classList.remove("open")));
  $("#themeToggle")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
  });
  $("#backToTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $("#modalClose")?.addEventListener("click", closeModal);
  $("#mediaModal")?.addEventListener("click", (event) => {
    if (event.target.id === "mediaModal") closeModal();
  });
  document.addEventListener("keydown", handleKeys);
  window.addEventListener("scroll", updateScrollUi, { passive: true });
}

function bindPremiumInteractions() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".btn, .chip, .project-return");
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.append(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
  buildWorkspaceBackground();
  bindWorkspaceTransitions();
  document.addEventListener("click", (event) => {
    const details = event.target.closest("[data-details]");
    const screenshots = event.target.closest("[data-screenshots]");
    const docs = event.target.closest("[data-docs]");
    if (details) openProjectDetails(details.dataset.details);
    if (screenshots) openScreenshots(screenshots.dataset.screenshots);
    if (docs) openDocumentation(docs.dataset.docs);
  });

  if (matchMedia("(pointer: fine) and (min-width: 900px)").matches) {
    const dot = $("#cursorDot");
    const ring = $("#cursorRing");
    window.addEventListener("mousemove", (event) => {
      document.body.classList.add("cursor-ready");
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
    }, { passive: true });
    document.addEventListener("mouseover", (event) => {
      document.body.classList.toggle("cursor-grow", Boolean(event.target.closest("a, button, .project-card, .tilt-card, .gallery-item, img")));
    });
  }

  document.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;
    document.documentElement.style.setProperty("--mouse-x", `${x}px`);
    document.documentElement.style.setProperty("--mouse-y", `${y}px`);
  }, { passive: true });
}

function buildWorkspaceBackground() {
  const layer = $(".ambient-layer");
  if (!layer || layer.dataset.ready) return;
  layer.dataset.ready = "true";
  const snippets = [
    "dotnet run --project HRMS",
    "git status --short",
    "SELECT * FROM Employees",
    "ng build --configuration production",
    "firebase deploy",
    "code ."
  ];
  const fragment = document.createDocumentFragment();
  snippets.forEach((snippet, index) => {
    const node = document.createElement("span");
    node.className = `code-snippet code-snippet-${index + 1}`;
    node.textContent = snippet;
    fragment.append(node);
  });
  layer.append(fragment);
}

function bindWorkspaceTransitions() {
  const overlay = document.createElement("div");
  overlay.className = "workspace-transition";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `<span>${randomLoadingMessage()}</span>`;
  document.body.append(overlay);

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link || link.getAttribute("href") === "#") return;
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    overlay.querySelector("span").textContent = randomLoadingMessage();
    overlay.classList.remove("show");
    window.requestAnimationFrame(() => {
      overlay.classList.add("show");
      window.setTimeout(() => overlay.classList.remove("show"), 520);
    });
  });
}

function initAnimationLibraries() {
  if (window.AOS) {
    AOS.init({ once: true, duration: 760, easing: "ease-out-cubic", offset: 90 });
  }

  if (window.VanillaTilt && matchMedia("(pointer: fine)").matches) {
    VanillaTilt.init($$(".tilt-card, .premium-section .project-card"), {
      max: 5,
      speed: 650,
      glare: true,
      "max-glare": 0.12
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".timeline-line", {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".animated-timeline",
        start: "top 75%",
        end: "bottom 70%",
        scrub: true,
        once: true
      }
    });
    gsap.from(".timeline-icon", {
      scale: 0.5,
      opacity: 0,
      duration: 0.55,
      stagger: 0.16,
      ease: "back.out(1.8)",
      scrollTrigger: { trigger: ".animated-timeline", start: "top 70%", once: true }
    });
    gsap.from(".journey-item", {
      opacity: 0,
      x: -18,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: { trigger: ".journey-timeline", start: "top 72%", once: true }
    });
    gsap.from(".radar-grid span", {
      opacity: 0,
      scale: 0.78,
      y: 14,
      duration: 0.55,
      stagger: 0.05,
      ease: "back.out(1.7)",
      scrollTrigger: { trigger: ".radar-grid", start: "top 75%", once: true }
    });
    gsap.utils.toArray(".premium-section").forEach((section) => {
      gsap.to(section, {
        backgroundPosition: "50% 42%",
        ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.7 }
      });
    });
  }
}

function applyTheme() {
  const saved = localStorage.getItem("theme");
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = saved || preferred;
}

function updateScrollUi() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  $("#scrollProgress") && ($("#scrollProgress").style.width = `${percent}%`);
  $("#backToTop")?.classList.toggle("show", window.scrollY > 600);
}

async function loadSite() {
  state.site = await fetchJson("assets/data/site.json");
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  return response.json();
}

function startTyping() {
  const target = $("#typingText");
  const roles = state.site?.typingRoles || [];
  if (!target || !roles.length) return;
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const tick = () => {
    const current = roles[roleIndex];
    target.textContent = current.slice(0, charIndex);
    if (!deleting && charIndex < current.length) charIndex += 1;
    else if (deleting && charIndex > 0) charIndex -= 1;
    else if (!deleting) deleting = true;
    else {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
    setTimeout(tick, charIndex === current.length ? 1200 : deleting ? 38 : 72);
  };
  tick();
}

function renderSkills() {
  const root = $("#skillsGrid");
  if (!root) return;

  const skillData = [
    {
      name: "ASP.NET MVC",
      percent: 90,
      level: "Advanced",
      category: "backend",
      projects: ["HRMS", "Dog Registry Management System", "Urban Company Management System", "ElightHub"],
      badges: ["internship"],
      projectCount: "4+"
    },
    {
      name: "C#",
      percent: 85,
      level: "Advanced",
      category: "backend",
      projects: ["HRMS", "Dog Registry Management System", "Urban Company Management System", "ElightHub"],
      badges: ["internship"],
      projectCount: "4+"
    },
    {
      name: "SQL Server",
      percent: 85,
      level: "Advanced",
      category: "database",
      projects: ["HRMS", "Dog Registry Management System", "Urban Company Management System", "ElightHub"],
      badges: ["internship"],
      projectCount: "4+"
    },
    {
      name: "HTML5",
      percent: 90,
      level: "Advanced",
      category: "frontend",
      projects: ["HRMS", "ElightHub", "Amrutum", "Email Templates"],
      badges: ["internship", "freelance"],
      projectCount: "5+"
    },
    {
      name: "CSS3",
      percent: 85,
      level: "Advanced",
      category: "frontend",
      projects: ["HRMS", "ElightHub", "Amrutum", "Email Templates"],
      badges: ["internship", "freelance"],
      projectCount: "5+"
    },
    {
      name: "Angular",
      percent: 75,
      level: "Intermediate",
      category: "frontend",
      projects: ["Amrutum"],
      badges: ["freelance"],
      projectCount: "1+"
    },
    {
      name: "JavaScript",
      percent: 80,
      level: "Intermediate",
      category: "frontend",
      projects: ["ElightHub", "Amrutum", "Email Templates"],
      badges: ["internship", "freelance"],
      projectCount: "3+"
    },
    {
      name: "Firebase",
      percent: 80,
      level: "Intermediate",
      category: "backend",
      projects: ["Diz Admin Panel"],
      badges: ["internship"],
      projectCount: "1+"
    },
    {
      name: "Responsive Email Templates",
      percent: 85,
      level: "Advanced",
      category: "frontend",
      projects: ["Client Campaigns", "Freelance Clients"],
      badges: ["internship", "freelance"],
      projectCount: "3+"
    },
    {
      name: "PHP",
      percent: 75,
      level: "Intermediate",
      category: "backend",
      projects: ["Driving School Management System"],
      badges: ["academic"],
      projectCount: "1+"
    },
    {
      name: "MySQL",
      percent: 80,
      level: "Intermediate",
      category: "database",
      projects: ["Driving School Management System"],
      badges: ["academic"],
      projectCount: "1+"
    },
    {
      name: "Android (Kotlin)",
      percent: 70,
      level: "Intermediate",
      category: "mobile",
      projects: ["Tunix Music Player"],
      badges: ["academic"],
      projectCount: "1+"
    },
    {
      name: "Git & GitHub",
      percent: 75,
      level: "Intermediate",
      category: "tools",
      projects: ["All Projects"],
      badges: ["internship", "freelance"],
      projectCount: "All"
    },
    {
      name: "Dart",
      percent: 60,
      level: "Learning",
      category: "learning",
      projects: ["Currently Learning"],
      badges: ["learning"],
      projectCount: "—"
    },
    {
      name: ".NET MAUI",
      percent: 30,
      level: "Learning",
      category: "learning",
      projects: ["Future Development Focus"],
      badges: ["learning"],
      projectCount: "—"
    }
  ];

  const badgeLabels = {
    internship: "Internship",
    freelance: "Freelance",
    academic: "Academic",
    learning: "Learning"
  };

  const levelColors = {
    "Advanced": "var(--primary)",
    "Intermediate": "#60c8f5",
    "Learning": "#f5c842"
  };

  // Build filter controls
  const filtersContainer = document.createElement("div");
  filtersContainer.className = "skills-filter-bar";
  filtersContainer.setAttribute("aria-label", "Filter skills by category");

  const categories = [
    { key: "all", label: "All" },
    { key: "backend", label: "Backend" },
    { key: "frontend", label: "Frontend" },
    { key: "mobile", label: "Mobile" },
    { key: "database", label: "Database" },
    { key: "tools", label: "Tools" },
    { key: "learning", label: "Learning" }
  ];

  filtersContainer.innerHTML = categories.map((cat) =>
    `<button class="skill-filter-btn ${cat.key === "all" ? "active" : ""}" data-cat="${cat.key}">${cat.label}</button>`
  ).join("");

  root.before(filtersContainer);

  function buildSkillCard(skill, index) {
    const filledBlocks = Math.round(skill.percent / 10);
    const emptyBlocks = 10 - filledBlocks;
    const blockBar = "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);

    const tooltipProjects = skill.projects.map((p) => `<li>• ${p}</li>`).join("");
    const badgeHTML = skill.badges.map((b) => `<span class="skill-xp-badge skill-xp-badge--${b}">${badgeLabels[b]}</span>`).join("");

    return `
      <article
        class="skill-card tilt-card terminal-skill-card skill-filterable"
        data-category="${skill.category}"
        data-aos="fade-up"
        data-aos-delay="${index * 55}"
      >
        <div class="skill-tooltip" role="tooltip" aria-hidden="true">
          <p class="skill-tooltip-title">${skill.name}</p>
          <p class="skill-tooltip-label">Used In:</p>
          <ul class="skill-tooltip-projects">${tooltipProjects}</ul>
        </div>
        <div class="skill-card-head">
          <h3>${skill.name}</h3>
          <span class="skill-level-badge" style="--level-color:${levelColors[skill.level] || "var(--primary)"}">
            ${skill.level}
          </span>
        </div>
        <div class="skill-bar-row">
          <span class="skill-block-bar" aria-hidden="true">${blockBar}</span>
          <span class="skill-pct">${skill.percent}%</span>
        </div>
        <div class="skill-progress skill-progress--visible" aria-label="${skill.name} proficiency ${skill.percent}%">
          <span data-progress="${skill.percent}" style="width:0%"></span>
        </div>
        <div class="skill-meta-row">
          <span><span class="skill-label-key">PROJECTS:</span> ${skill.projectCount}</span>
        </div>
        <div class="skill-badges-row">${badgeHTML}</div>
      </article>
    `;
  }

  root.innerHTML = skillData.map((skill, i) => buildSkillCard(skill, i)).join("");

  // Filter logic
  filtersContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".skill-filter-btn");
    if (!btn) return;
    const cat = btn.dataset.cat;
    $$(".skill-filter-btn", filtersContainer).forEach((b) => b.classList.toggle("active", b === btn));
    $$(".skill-filterable", root).forEach((card) => {
      const match = cat === "all" || card.dataset.category === cat;
      card.classList.toggle("skill-hidden", !match);
      card.classList.toggle("skill-visible", match);
    });
    if (window.AOS) AOS.refreshHard();
  });

  // Animate progress bars on intersection
  const bars = $$(".skill-progress--visible span", root);
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.progress);
      const width = `${target}%`;
      if (window.gsap) {
        gsap.to(entry.target, { width, duration: 1.2, ease: "power3.out", delay: 0.1 });
      } else {
        entry.target.style.transition = "width 1.2s cubic-bezier(0.22,1,0.36,1)";
        entry.target.style.width = width;
      }
      barObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  bars.forEach((bar) => barObserver.observe(bar));

  // Tooltip positioning
  $$(".skill-filterable", root).forEach((card) => {
    const tooltip = $(".skill-tooltip", card);
    if (!tooltip) return;
    card.addEventListener("mouseenter", () => {
      const rect = card.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      tooltip.classList.toggle("skill-tooltip--left", spaceRight < 220);
      tooltip.classList.add("skill-tooltip--visible");
    });
    card.addEventListener("mouseleave", () => {
      tooltip.classList.remove("skill-tooltip--visible");
    });
    card.addEventListener("focusin", () => tooltip.classList.add("skill-tooltip--visible"));
    card.addEventListener("focusout", () => tooltip.classList.remove("skill-tooltip--visible"));
  });
}

async function loadProjects() {
  const folders = state.site?.projectFolders || [];
  state.projects = await Promise.all(folders.map(async (folder) => {
    const project = await fetchJson(`projects/${folder}/project.json`);
    project.folder = folder;
    project.screenshots = await detectFiles(`projects/${folder}/screenshots`, "screen", ".png", PROJECT_MEDIA_LIMIT);
    project.documents = await detectNamedFiles(`projects/${folder}/documents`, DOCUMENT_NAMES);
    project.videos = await detectNamedFiles(`projects/${folder}/videos`, VIDEO_NAMES);
    project.github = project.github || "https://github.com/";
    return project;
  }));
  buildProjectFilters();
  bindProjectControls();
  renderProjects();
}

function buildProjectFilters() {
  const root = $("#projectFilters");
  if (!root) return;
  const categories = ["all", ...new Set(state.projects.flatMap((project) => project.technologies))];
  root.innerHTML = categories.map((category) => `<button class="chip ${category === "all" ? "active" : ""}" data-filter="${category}">${category === "all" ? "All" : category}</button>`).join("");
}

function bindProjectControls() {
  $("#projectSearch")?.addEventListener("input", (event) => {
    state.search = event.target.value.toLowerCase();
    renderProjects();
  });
  $("#projectFilters")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.activeProjectFilter = button.dataset.filter;
    $$("#projectFilters .chip").forEach((chip) => chip.classList.toggle("active", chip === button));
    renderProjects();
  });
}

function renderProjects() {
  const root = $("#projectGrid");
  if (!root) return;
  const filtered = state.projects.filter((project) => {
    const matchesFilter = state.activeProjectFilter === "all" || project.technologies.includes(state.activeProjectFilter);
    const haystack = `${project.name} ${project.summary} ${project.technologies.join(" ")}`.toLowerCase();
    return matchesFilter && haystack.includes(state.search);
  });
  root.innerHTML = filtered.map((project, index) => projectCard(project, index)).join("") || `<p>No matching projects found.</p>`;
  if (window.AOS) AOS.refreshHard();
  if (window.VanillaTilt && matchMedia("(pointer: fine)").matches) VanillaTilt.init($$(".project-card"), { max: 5, speed: 650, glare: true, "max-glare": 0.12 });
}

function projectCard(project, index) {
  const media = project.screenshots[0] || project.thumbnail;
  return `
    <article class="project-card" data-aos="fade-up" data-aos-delay="${index * 80}">
      <div class="project-media"><img src="${media}" alt="${project.name} thumbnail" loading="lazy" onerror="this.replaceWith(document.createTextNode('${project.name}'))"></div>
      <div class="project-card-body">
        ${projectCompletionBadges(project).map((badge) => `<span class="badge">${badge}</span>`).join("")}
        <h3>${project.name}</h3>
        <p>${project.summary}</p>
        <div class="badge-row">${project.technologies.map((tech) => `<span class="badge">${tech}</span>`).join("")}</div>
        <div class="project-actions">
          <button class="btn primary" data-details="${project.folder}" type="button">Open Project</button>
          <button class="btn secondary" data-screenshots="${project.folder}" type="button">Screenshots</button>
          <button class="btn ghost" data-docs="${project.folder}" type="button">Docs</button>
        </div>
      </div>
    </article>
  `;
}

function projectCompletionBadges(project) {
  const badges = ["Completed"];
  if (["hrms", "diz-admin", "dog-registry", "urban-company"].includes(project.folder)) badges.push("Internship Project");
  if (project.folder === "dog-registry") badges.push("Freelance Project");
  if (project.folder === "diz-admin") badges.push("Professional Experience");
  if (/MCA|BCA|Semester|Major/i.test(project.type || "")) badges.push("Academic Project");
  if (project.flagship) badges.push("Flagship Project");
  if (project.featured) badges.push("Featured Project");
  if (project.type && !badges.includes(project.type)) badges.push(project.type);
  return badges;
}

async function openProjectDetails(folder) {
  const project = state.projects.find((item) => item.folder === folder);
  if (!project || state.projectTransitioning) return;
  state.projectTransitioning = true;
  state.activeProject = project;
  state.visitedProjects.add(project.folder);
  if (state.visitedProjects.size >= 3) unlockAchievement("Project Explorer");
  renderProjectPage(project);
  document.body.classList.add("portfolio-faded", "project-viewer-open");
  const viewer = $("#projectViewer");
  viewer?.setAttribute("aria-hidden", "false");
  await runProjectTerminal(project, "enter");
  revealProjectPage();
  state.projectTransitioning = false;
}

async function closeProjectDetails() {
  if (!state.activeProject || state.projectTransitioning) return;
  state.projectTransitioning = true;
  await runProjectTerminal(state.activeProject, "exit");
  $("#projectViewer")?.setAttribute("aria-hidden", "true");
  $("#projectPage")?.classList.remove("show");
  document.body.classList.remove("portfolio-faded", "project-viewer-open");
  state.activeProject = null;
  state.projectTransitioning = false;
}

function projectTerminalCommands(project, mode = "enter") {
  if (mode === "exit") {
    return [
      "Closing Project Viewer...",
      "Saving Viewer State...",
      "Restoring Portfolio...",
      "Session Closed"
    ];
  }
  const commands = {
    hrms: [
      "Connecting HRMS Database...",
      "Loading Employee Records...",
      "Loading Attendance Module...",
      "Access Granted"
    ],
    "dog-registry": [
      "Connecting Registry Server...",
      "Loading Dog Records...",
      "Loading Vaccination Data...",
      "Access Granted"
    ],
    elighthub: [
      "Loading Product Catalog...",
      "Loading Shopping Cart...",
      "Loading Orders...",
      "Access Granted"
    ],
    tunix: [
      "Scanning Music Library...",
      "Loading Playlists...",
      "Initializing Audio Engine...",
      "Access Granted"
    ],
    "driving-school": [
      "Loading Student Records...",
      "Loading Booking System...",
      "Loading Appointment Scheduler...",
      "Access Granted"
    ],
    "urban-company": [
      "Loading Vendor Database...",
      "Loading Service Listings...",
      "Loading Booking System...",
      "Access Granted"
    ]
  };
  return [
    randomLoadingMessage(),
    ...(commands[project.folder] || [
      randomLoadingMessage(),
      randomLoadingMessage(),
      randomLoadingMessage(),
      "Access Granted"
    ])
  ];
}

async function runProjectTerminal(project, mode = "enter") {
  const terminal = $("#projectTerminal");
  const windowEl = $(".project-terminal-window", terminal);
  const lineRoot = $("#projectTerminalLines");
  const progress = $("#projectTerminalProgress");
  const fill = $(".progress-track span", progress);
  const percent = $("#projectTerminalPercent");
  const title = $("#projectTerminalTitle");
  if (!terminal || !lineRoot || !progress || !fill || !percent) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (duration) => new Promise((resolve) => setTimeout(resolve, reducedMotion ? 0 : duration));
  const commands = projectTerminalCommands(project, mode);
  lineRoot.innerHTML = "";
  progress.classList.remove("show");
  fill.style.width = "0%";
  percent.textContent = "0%";
  title && (title.textContent = mode === "enter" ? `${project.slug || project.folder}.viewer` : "portfolio.restore");
  terminal.classList.remove("collapse", "exit");
  terminal.classList.add("show");
  windowEl?.classList.remove("collapse");

  document.body.classList.add("portfolio-faded");
  $("#projectPage")?.classList.toggle("show", mode === "exit");

  const typeCommand = async (text) => {
    const line = document.createElement("div");
    const content = document.createElement("span");
    const cursor = document.createElement("span");
    line.className = "project-terminal-line";
    cursor.className = "terminal-cursor";
    line.append(content, cursor);
    lineRoot.append(line);
    if (reducedMotion) {
      content.textContent = text;
      cursor.remove();
      return;
    }
    for (let index = 1; index <= text.length; index += 3) {
      content.textContent = text.slice(0, index);
      await wait(1 + Math.random() * 2);
    }
    content.textContent = text;
    cursor.remove();
  };

  for (const command of commands) {
    await typeCommand(command);
    await wait(mode === "enter" ? 26 : 46);
  }

  progress.classList.add("show");
  await wait(60);
  fill.style.width = "100%";
  percent.textContent = "100%";
  await wait(mode === "enter" ? 210 : 140);
  if (mode === "enter") {
    windowEl?.classList.add("collapse");
    terminal.classList.add("collapse");
    await wait(300);
    terminal.classList.remove("show");
  } else {
    terminal.classList.add("exit");
    await wait(240);
    terminal.classList.remove("show", "exit");
  }
}

function renderProjectPage(project) {
  const page = $("#projectPage");
  if (!page) return;
  const doc = project.documents[0] || `projects/${project.folder}/documents/documentation.pdf`;
  const image = project.screenshots[0] || project.thumbnail;
  const stats = projectDetailStats(project);
  page.innerHTML = `
    <div class="project-page-inner">
      <button class="project-return" id="projectReturn" type="button">&larr; Return to Portfolio</button>
      <div class="project-detail-hero">
        <div class="project-detail-copy">
          <p class="eyebrow">Project Workspace</p>
          <h1>&gt; OPENING PROJECT: ${escapeHtml(project.name)}</h1>
          <p>${escapeHtml(project.summary)}</p>
          <div class="project-detail-badges">
            ${project.technologies.map((tech, index) => `<span class="badge" style="--badge-delay:${index * 55}ms">${escapeHtml(tech)}</span>`).join("")}
          </div>
          <div class="project-detail-actions">
            <button class="btn secondary" type="button" onclick="window.openScreenshots('${project.folder}')">View Screenshots</button>
            <button class="btn ghost" type="button" onclick="window.openDocumentation('${project.folder}')">Documentation Viewer</button>
            <a class="btn primary" href="${doc}" download>Download PDF</a>
          </div>
        </div>
        <div class="project-detail-preview">
          <img src="${image}" alt="${escapeHtml(project.name)} preview">
        </div>
      </div>
      <div class="project-detail-grid">
        <section class="project-detail-panel">
          <h2>Core Features</h2>
          <ul>${(project.features || []).map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
        </section>
        <section class="project-detail-panel project-stat-panel">
          <h2>Project Signals</h2>
          <div class="project-stat-grid">
            ${stats.map((stat) => `
              <div class="project-stat">
                <strong data-project-count="${stat.value}">0</strong>
                <span>${escapeHtml(stat.label)}</span>
              </div>
            `).join("")}
          </div>
        </section>
        ${project.statistics ? `<section class="project-detail-panel"><h2>Highlights</h2><ul>${project.statistics.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>` : ""}
        ${project.roadmap ? `<section class="project-detail-panel"><h2>Roadmap</h2><ul>${project.roadmap.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>` : ""}
      </div>
    </div>
  `;
  $("#projectReturn")?.addEventListener("click", closeProjectDetails);
}

function projectDetailStats(project) {
  return [
    { value: project.features?.length || 0, label: "Features" },
    { value: project.screenshots?.length || 0, label: "Screenshots" },
    { value: project.documents?.length || 0, label: "Documents" },
    { value: project.technologies?.length || 0, label: "Tech Stack" }
  ];
}

function revealProjectPage() {
  const page = $("#projectPage");
  if (!page) return;
  page.classList.add("show");
  animateProjectCounters();
}

function animateProjectCounters() {
  $$("[data-project-count]").forEach((counter) => {
    const target = Number(counter.dataset.projectCount);
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / 620, 1);
      counter.textContent = Math.floor(progress * target);
      if (progress < 1) setTimeout(tick, 16);
    };
    tick();
  });
}

function openScreenshots(folder) {
  const project = state.projects.find((item) => item.folder === folder);
  if (!project || !project.screenshots.length) {
    return openModal(`<p>No screenshots found yet. Add files named screen1.png, screen2.png, and so on inside projects/${folder}/screenshots/.</p>`);
  }
  state.lightboxItems = project.screenshots.map((src) => ({ src, title: project.name, type: "image" }));
  state.lightboxIndex = 0;
  renderLightbox();
}

function renderLightbox() {
  const item = state.lightboxItems[state.lightboxIndex];
  openModal(`
    <div class="modal-shell">
      <div class="modal-header">
        <div>
          <p class="eyebrow">Screenshot Gallery</p>
          <h2>${item.title}</h2>
        </div>
        <span>${state.lightboxIndex + 1} / ${state.lightboxItems.length}</span>
      </div>
      <div class="modal-preview"><img src="${item.src}" alt="${item.title} screenshot"></div>
      <div class="carousel-controls">
        <button class="btn ghost" type="button" onclick="window.moveLightbox(-1)">Previous</button>
        <button class="btn primary" type="button" onclick="window.moveLightbox(1)">Next</button>
      </div>
    </div>
  `);
}

function openDocumentation(folder) {
  const project = state.projects.find((item) => item.folder === folder);
  if (!project) return;
  const doc = project.documents[0] || `projects/${project.folder}/documents/documentation.pdf`;
  openModal(`
    <div class="modal-shell">
      <div class="modal-header">
        <div>
          <p class="eyebrow">Documentation Viewer</p>
          <h2>${project.name}</h2>
        </div>
        <div class="modal-actions">
          <a class="btn ghost" href="${doc}" download>Download</a>
          <a class="btn primary" href="${doc}" target="_blank" rel="noopener">Open in New Tab</a>
        </div>
      </div>
      <div class="modal-preview"><iframe title="${project.name} documentation" src="${doc}"></iframe></div>
    </div>
  `);
}

async function renderCertificates() {
  const root = $("#certificateGrid");
  if (!root || !state.site?.certificates) return;
  const existing = [];
  for (const cert of state.site.certificates) {
    if (await fileExists(cert.image)) existing.push(cert);
  }
  root.innerHTML = (existing.length ? existing : state.site.certificates).map((cert, index) => `
    <article class="mini-card tilt-card" data-aos="zoom-in-up" data-aos-delay="${index * 80}">
      <img src="${cert.image}" alt="${cert.title}" loading="lazy">
      <h3>${cert.title}</h3>
      <div class="project-actions">
        <button class="btn secondary" type="button" onclick="window.previewMedia('${cert.image}', 'image', '${cert.title}')">Preview</button>
        <a class="btn ghost" href="${cert.document}" download>Download</a>
      </div>
    </article>
  `).join("");
}

function renderGallery() {
  const projectItems = state.projects.flatMap((project) => project.screenshots.map((image) => ({ title: project.name, image, type: "projects" })));
  const certItems = (state.site?.certificates || []).map((cert) => ({ title: cert.title, image: cert.image, type: "certificates" }));
  const internshipItems = (state.site?.internshipGallery || []).map((item) => ({ ...item, type: "internship" }));
  state.galleryItems = [...projectItems, ...certItems, ...internshipItems];
  drawGallery("all");
  $("#galleryFilters")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gallery-filter]");
    if (!button) return;
    $$("#galleryFilters .chip").forEach((chip) => chip.classList.toggle("active", chip === button));
    drawGallery(button.dataset.galleryFilter);
  });
}

function drawGallery(filter) {
  const root = $("#galleryGrid");
  if (!root) return;
  const items = state.galleryItems.filter((item) => filter === "all" || item.type === filter);
  if (window.gsap) gsap.to(root.children, { opacity: 0, y: 12, duration: 0.16, stagger: 0.02 });
  setTimeout(() => {
    root.innerHTML = items.map((item, index) => `
      <button class="gallery-item" type="button" data-gallery-index="${index}" data-aos="zoom-in">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <span class="gallery-caption"><strong>${item.title}</strong><small>${item.type}</small></span>
      </button>
    `).join("");
    root.querySelectorAll("[data-gallery-index]").forEach((button) => button.addEventListener("click", () => {
      state.lightboxItems = items.map((item) => ({ src: item.image, title: item.title, type: "image" }));
      state.lightboxIndex = Number(button.dataset.galleryIndex);
      renderLightbox();
    }));
    if (window.gsap) gsap.fromTo(root.children, { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.04, ease: "power2.out" });
    if (window.AOS) AOS.refreshHard();
  }, window.gsap ? 170 : 0);
}

async function detectFiles(base, prefix, extension, limit) {
  const checks = Array.from({ length: limit }, (_, index) => `${base}/${prefix}${index + 1}${extension}`);
  const found = [];
  for (const path of checks) if (await fileExists(path)) found.push(path);
  return found;
}

async function loadGitHubShowcase() {
  const username = state.site?.githubUsername;
  if (!username) return;
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
    ]);
    if (!userResponse.ok || !reposResponse.ok) return;
    const user = await userResponse.json();
    const repos = await reposResponse.json();

    // Update profile
    const nameEl   = $("#ghProfileName");
    const handleEl = $("#ghProfileHandle");
    const bioEl    = $("#ghProfileBio");
    const avatarEl = $("#ghAvatar");
    if (nameEl   && user.name)  nameEl.textContent   = user.name;
    if (handleEl && user.login) handleEl.textContent = `@${user.login}`;
    if (bioEl    && user.bio)   bioEl.textContent    = user.bio;
    if (avatarEl && user.login) {
      const initials = user.name
        ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
        : user.login.slice(0, 2).toUpperCase();
      avatarEl.textContent = initials;
    }

    // Update counter blocks — update data-counter so animation picks it up
    const repoBlock = $("[data-counter='25']");
    if (repoBlock && user.public_repos) {
      repoBlock.dataset.counter = user.public_repos;
      const numEl = repoBlock.querySelector(".gh-stat-num");
      if (numEl) numEl.textContent = "0";
    }

    // Update terminal stats last activity
    const lastActivityEl = $("#ghLastActivity");
    if (lastActivityEl && repos[0]) {
      lastActivityEl.textContent = new Date(repos[0].updated_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    }

    // Populate featured repos dynamically if repos are returned
    if (repos.length > 0) {
      const repoList = $("#ghRepoList");
      if (repoList) {
        const icons = ["⬡", "◈", "◻", "◎"];
        const topRepos = repos
          .filter((r) => !r.fork && r.description)
          .slice(0, 4);
        if (topRepos.length >= 2) {
          repoList.innerHTML = topRepos.map((repo, i) => `
            <div class="gh-repo-item">
              <span class="gh-repo-icon">${icons[i % icons.length]}</span>
              <div class="gh-repo-info">
                <span class="gh-repo-name">${repo.name}</span>
                <span class="gh-repo-desc">${repo.description || "—"}</span>
              </div>
              <div class="gh-repo-tags">
                ${repo.language ? `<span class="gh-repo-tag">${repo.language}</span>` : ""}
                ${repo.stargazers_count > 0 ? `<span class="gh-repo-tag">★ ${repo.stargazers_count}</span>` : ""}
              </div>
            </div>`).join("");
        }
      }
    }
  } catch {
    // GitHub data is optional; static placeholders remain visible.
  }
}

async function detectNamedFiles(base, names) {
  const found = [];
  for (const name of names) {
    const path = `${base}/${name}`;
    if (await fileExists(path)) found.push(path);
  }
  return found;
}

// Static hosts cannot list directory contents. Use predictable filenames:
// screenshots/screen1.png, screenshots/screen2.png, documents/documentation.pdf, videos/video1.mp4.
async function fileExists(path) {
  try {
    const response = await fetch(path, { method: "HEAD", cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

function openModal(html) {
  $("#modalContent").innerHTML = html;
  const modal = $("#mediaModal");
  if (!modal.open) modal.showModal();
  if (window.gsap) gsap.fromTo(".media-modal", { opacity: 0, y: 20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power2.out" });
}

function closeModal() {
  const modal = $("#mediaModal");
  if (!modal?.open) return;
  if (!window.gsap) return modal.close();
  gsap.to(".media-modal", { opacity: 0, y: 16, scale: 0.98, duration: 0.18, ease: "power2.in", onComplete: () => modal.close() });
}

function handleKeys(event) {
  if (event.key === "Escape" && state.activeProject && !state.projectTransitioning) {
    closeProjectDetails();
    return;
  }
  if (!$("#mediaModal")?.open) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowRight") window.moveLightbox(1);
  if (event.key === "ArrowLeft") window.moveLightbox(-1);
}

window.moveLightbox = (direction) => {
  if (!state.lightboxItems.length) return;
  state.lightboxIndex = (state.lightboxIndex + direction + state.lightboxItems.length) % state.lightboxItems.length;
  renderLightbox();
};

window.openScreenshots = openScreenshots;
window.openDocumentation = openDocumentation;
window.previewMedia = (src, type, title = "Preview") => {
  const content = type === "video"
    ? `<div class="modal-shell"><div class="modal-header"><h2>${title}</h2></div><video src="${src}" controls autoplay></video></div>`
    : `<div class="modal-shell"><div class="modal-header"><h2>${title}</h2></div><div class="modal-preview"><img src="${src}" alt="${title}"></div></div>`;
  openModal(content);
};

function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  $$(".reveal").forEach((item) => observer.observe(item));
}

function animateCounters() {
  const counters = $$("[data-count]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.count);
      const suffix = entry.target.closest(".mini-stat") ? "+" : "";
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / 1100, 1);
        entry.target.textContent = `${Math.floor(progress * target)}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  counters.forEach((counter) => observer.observe(counter));
}

function animateSkillBars() {
  const bars = $$(".skill-progress span");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const width = `${entry.target.dataset.progress}%`;
      if (window.gsap) gsap.to(entry.target, { width, duration: 1.1, ease: "power3.out" });
      else entry.target.style.width = width;
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.55 });
  bars.forEach((bar) => observer.observe(bar));
}

function initTerminalSectionHeaders() {
  const headings = $$(".section-heading .eyebrow");
  if (!headings.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      if (!node.dataset.originalText) node.dataset.originalText = node.textContent.trim();
      const text = `> ${node.dataset.originalText.toUpperCase()}`;
      node.textContent = "";
      node.classList.add("typing-heading");
      let index = 0;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const type = () => {
        node.textContent = text.slice(0, index);
        index += reducedMotion ? text.length : 1;
        if (index <= text.length) window.setTimeout(type, reducedMotion ? 0 : 18);
      };
      type();
      observer.unobserve(node);
    });
  }, { threshold: 0.72 });
  headings.forEach((heading) => observer.observe(heading));
}

// ============================================================
// CAPABILITY MODULES — Professional Highlights
// Expandable accordion-style modules with terminal status
// ============================================================
function initCapabilityModules() {
  const modules = $$(".cap-module--expand");
  if (!modules.length) return;

  modules.forEach((mod) => {
    const head = $(".cap-module-head", mod);
    const body = $(".cap-module-body", mod);
    if (!body) return;

    // Set initial height for animation
    body.style.maxHeight = "0px";
    body.style.overflow = "hidden";
    body.style.transition = "max-height 0.38s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease";
    body.style.opacity = "0";

    function toggleModule(e) {
      const isOpen = mod.getAttribute("aria-expanded") === "true";

      // Close all others
      modules.forEach((other) => {
        if (other !== mod) {
          const otherBody = $(".cap-module-body", other);
          if (otherBody) {
            otherBody.style.maxHeight = "0px";
            otherBody.style.opacity = "0";
          }
          other.setAttribute("aria-expanded", "false");
          other.classList.remove("cap-module--open");
        }
      });

      if (isOpen) {
        body.style.maxHeight = "0px";
        body.style.opacity = "0";
        mod.setAttribute("aria-expanded", "false");
        mod.classList.remove("cap-module--open");
      } else {
        body.style.maxHeight = body.scrollHeight + 40 + "px";
        body.style.opacity = "1";
        mod.setAttribute("aria-expanded", "true");
        mod.classList.add("cap-module--open");
      }
    }

    head.addEventListener("click", toggleModule);
    mod.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleModule(e);
      }
    });
  });
}

// ============================================================
// COMMAND CENTER — Technical Expertise
// Tab-based stack navigator with animated panel switching
// ============================================================
function initCommandCenter() {
  const navItems = $$(".cmd-nav-item");
  const stackViews = $$(".cmd-stack-view");
  if (!navItems.length || !stackViews.length) return;

  // Animate the active indicator line
  const navList = $("#cmdNavList");
  const indicator = document.createElement("span");
  indicator.className = "cmd-nav-indicator";
  if (navList) navList.appendChild(indicator);

  function moveIndicator(activeItem) {
    if (!indicator || !navList) return;
    const listRect = navList.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    indicator.style.top = (itemRect.top - listRect.top) + "px";
    indicator.style.height = itemRect.height + "px";
    indicator.style.opacity = "1";
  }

  function switchStack(targetStack) {
    // Update nav items
    navItems.forEach((item) => {
      const isTarget = item.dataset.stack === targetStack;
      item.classList.toggle("cmd-nav-item--active", isTarget);
      item.setAttribute("aria-selected", String(isTarget));
      if (isTarget) moveIndicator(item);
    });

    // Animate panels out, then in
    stackViews.forEach((view) => {
      const isTarget = view.dataset.view === targetStack;
      if (isTarget) {
        view.classList.add("cmd-stack-view--entering");
        view.classList.add("cmd-stack-view--active");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            view.classList.remove("cmd-stack-view--entering");
          });
        });
      } else {
        view.classList.remove("cmd-stack-view--active");
      }
    });
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => switchStack(item.dataset.stack));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        switchStack(item.dataset.stack);
      }
      // Arrow key nav
      const all = Array.from(navItems);
      const idx = all.indexOf(item);
      if (e.key === "ArrowDown" && idx < all.length - 1) {
        e.preventDefault();
        all[idx + 1].focus();
        switchStack(all[idx + 1].dataset.stack);
      }
      if (e.key === "ArrowUp" && idx > 0) {
        e.preventDefault();
        all[idx - 1].focus();
        switchStack(all[idx - 1].dataset.stack);
      }
    });
  });

  // Set initial indicator after layout
  requestAnimationFrame(() => {
    const firstActive = $(".cmd-nav-item--active");
    if (firstActive) moveIndicator(firstActive);
  });

  // Typewriter effect on the status bar value
  const statusVal = $("#sysModuleCount");
  if (statusVal) {
    let n = 0;
    const target = 7;
    const tick = setInterval(() => {
      n++;
      statusVal.textContent = n;
      if (n >= target) clearInterval(tick);
    }, 120);
  }
}

// ============================================================
// CONTACT TERMINAL CONSOLE
// Terminal-style form with cursor animation + success state
// ============================================================
function initContactConsole() {
  const form = $("#ctForm");
  const statusEl = $("#ctFormStatus");
  const successEl = $("#ctSuccessMsg");
  const submitBtn = $("#ctSubmit");

  if (!form) return;

  // Input glow: add focused class to wrap on focus
  $$(".ct-input-wrap").forEach((wrap) => {
    const input = wrap.querySelector("input, textarea");
    if (!input) return;
    input.addEventListener("focus", () => wrap.classList.add("ct-input-wrap--focused"));
    input.addEventListener("blur",  () => wrap.classList.remove("ct-input-wrap--focused"));
    input.addEventListener("input", () => {
      wrap.classList.toggle("ct-input-wrap--filled", input.value.length > 0);
    });
  });

  // Status indicator updates while typing
  const inputs = $$(".ct-input", form);
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const filled = $$(".ct-input", form).filter((i) => i.value.trim().length > 0).length;
      if (filled > 0 && statusEl) {
        statusEl.innerHTML = `<span class="ct-live-dot"></span>COMPOSING`;
      }
    });
  });

  // Submit — use mailto (works on GitHub Pages) + show success state
  form.addEventListener("submit", (e) => {
    const name    = $("#ctName")?.value.trim();
    const email   = $("#ctEmail")?.value.trim();
    const message = $("#ctMessage")?.value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      // Shake invalid fields
      $$(".ct-input", form).forEach((input) => {
        if (!input.value.trim()) {
          input.closest(".ct-input-wrap").classList.add("ct-input-wrap--error");
          setTimeout(() => input.closest(".ct-input-wrap").classList.remove("ct-input-wrap--error"), 700);
        }
      });
      return;
    }

    // Show success after brief delay (mailto opens, we still show the message)
    setTimeout(() => {
      if (successEl) { successEl.hidden = false; }
      if (statusEl)  { statusEl.innerHTML = `<span class="ct-live-dot ct-live-dot--success"></span>TRANSMITTED`; }
      if (submitBtn) { submitBtn.classList.add("ct-submit-btn--sent"); }
    }, 400);
  });
}

// ============================================================
// GITHUB DASHBOARD — Animated Counters + Live Data
// Enhances the existing loadGitHubShowcase with counter anim
// ============================================================
function initGitHubDashboard() {
  // Animate counters when they enter the viewport
  const counterBlocks = $$(".gh-stat-block");
  if (!counterBlocks.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const block = entry.target;
      const target = parseInt(block.dataset.counter, 10);
      const suffix = block.dataset.suffix || "";
      const display = block.querySelector(".gh-stat-num");
      if (!display || display.dataset.animated) return;
      display.dataset.animated = "1";

      let current = 0;
      const duration = 1200;
      const steps = 40;
      const increment = target / steps;
      const interval = duration / steps;

      const tick = setInterval(() => {
        current = Math.min(current + increment, target);
        display.textContent = Math.round(current) + suffix;
        if (current >= target) clearInterval(tick);
      }, interval);

      counterObserver.unobserve(block);
    });
  }, { threshold: 0.6 });

  counterBlocks.forEach((block) => counterObserver.observe(block));

  // Animate language bars when section scrolls into view
  const langBars = $$(".gh-lang-bar");
  const langObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      if (bar.dataset.animated) return;
      bar.dataset.animated = "1";
      const w = bar.dataset.w || bar.style.getPropertyValue("--w") || "0%";
      bar.style.width = "0%";
      requestAnimationFrame(() => {
        bar.style.transition = "width 1.1s cubic-bezier(0.22,1,0.36,1)";
        bar.style.width = w;
      });
      langObserver.unobserve(bar);
    });
  }, { threshold: 0.4 });
  langBars.forEach((bar) => langObserver.observe(bar));

  // Terminal stats typewriter — reveal lines one by one
  const termLines = $$(".gh-term-line");
  termLines.forEach((line, i) => {
    line.style.opacity = "0";
    line.style.transform = "translateX(-6px)";
    line.style.transition = `opacity 0.3s ease ${i * 90}ms, transform 0.3s ease ${i * 90}ms`;
  });

  const termObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      termLines.forEach((line) => {
        line.style.opacity = "1";
        line.style.transform = "translateX(0)";
      });
      termObserver.disconnect();
    });
  }, { threshold: 0.3 });

  const activityCard = $(".gh-activity-card");
  if (activityCard) termObserver.observe(activityCard);

  // Bubble entrance stagger
  const bubbles = $$(".gh-bubble");
  bubbles.forEach((b, i) => {
    b.style.opacity = "0";
    b.style.transform = "scale(0.7)";
    b.style.transition = `opacity 0.35s ease ${i * 55}ms, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) ${i * 55}ms`;
  });

  const bubbleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      bubbles.forEach((b) => {
        b.style.opacity = "1";
        b.style.transform = "scale(1)";
      });
      bubbleObserver.disconnect();
    });
  }, { threshold: 0.3 });

  const mostActive = $(".gh-most-active-card");
  if (mostActive) bubbleObserver.observe(mostActive);
}
