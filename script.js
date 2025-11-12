// ---- Config: Your data ----
const CONTACT = {
  email: "mailto:atulsp48@gmail.com",
  linkedin: "https://www.linkedin.com/in/atul-pachnure",
  github: "https://github.com/chinnu48",
  resumeUrl: "Atul Pachnure Resume test1.pdf", // paste when ready; button auto-activates
};

// All projects (featured flag for top section)
const PROJECTS = [
  // Featured 1
  {
    id: "ai_resume_screener",
    title: "AI Resume Screener",
    desc: "LLM-assisted resume analysis, ranking, and feedback.",
    tech: ["Python", "ML", "NLP"],
    categories: ["Python", "Machine Learning", "AI/LLM"],
    github: "https://github.com/chinnu48/AI_Resume_Screener",
    demo: "",
    thumb: "assets/thumbs/ai_resume_screener.png",
    featured: true,
  },
  // Featured 2
  {
    id: "fire_safety_initiative",
    title: "Fire Safety Initiative",
    desc: "JS web app (maps/forms/alerts) for community fire-safety.",
    tech: ["JavaScript", "HTML", "CSS"],
    categories: ["JavaScript", "Web"],
    github: "https://github.com/chinnu48/Fire_safety_initiative",
    demo: "",
    thumb: "assets/thumbs/fire_safety_initiative.png",
    featured: true,
  },
  // Featured 3
  {
    id: "wheels_on_demand",
    title: "Wheels on Demand",
    desc: "Java + JDBC car booking with DB-backed CRUD.",
    tech: ["Java", "JDBC", "SQL"],
    categories: ["Java", "DBMS"],
    github: "https://github.com/chinnu48/Wheels_on_Demand",
    demo: "",
    thumb: "assets/thumbs/wheels_on_demand.png",
    featured: true,
  },
  // Featured 4
  {
    id: "mess_oversight",
    title: "Mess Oversight",
    desc: "JS + PHP app for mess/hostel oversight and records.",
    tech: ["JavaScript", "PHP", "MySQL"],
    categories: ["JavaScript", "PHP", "Web"],
    github: "https://github.com/chinnu48/Mess_oversight",
    demo: "",
    thumb: "assets/thumbs/mess_oversight.png",
    featured: true,
  },
  // Rest for “All Projects”
  {
    id: "bank_account_test",
    title: "Bank Account Test",
    desc: "Java account operations with tests and serialization.",
    tech: ["Java", "JUnit"],
    categories: ["Java", "Testing"],
    github: "https://github.com/chinnu48/bank_account_test",
    demo: "",
    thumb: "assets/thumbs/bank_account_test.png",
    featured: false,
  },
  {
    id: "car_price_prediction",
    title: "Car Price Prediction",
    desc: "Python ML model for used car price regression.",
    tech: ["Python", "scikit-learn", "pandas"],
    categories: ["Python", "Machine Learning"],
    github: "https://github.com/chinnu48/Car_price_prediction",
    demo: "",
    thumb: "assets/thumbs/car_price_prediction.png",
    featured: false,
  },
  {
    id: "car_rental_dbms",
    title: "Car Rental (Java DBMS)",
    desc: "Java + DBMS project for car rental workflow.",
    tech: ["Java", "DBMS", "SQL"],
    categories: ["Java", "DBMS"],
    github: "https://github.com/chinnu48/Car-Rental-Java-DBMS-Project-master",
    demo: "",
    thumb: "assets/thumbs/car_rental_dbms.png",
    featured: false,
  },
];

// ---- Utilities ----
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "dataset") Object.assign(node.dataset, v);
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  });
  children.forEach(c => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
  return node;
}

function safeImage(src, alt, fallbackText) {
  const wrap = el("div", { class: "thumb" });

  const fb = el("div", { class: "fallback" }, [document.createTextNode(fallbackText || "Preview")]);
  wrap.appendChild(fb);

  const img = new Image();
  img.alt = alt || "";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.display = "block";

  const handleLoad = () => {
    // Remove fallback and show image
    const fallback = wrap.querySelector(".fallback");
    if (fallback) fallback.remove();
    wrap.appendChild(img);
  };

  const handleError = () => {
    // Keep fallback, don't add image
    console.warn(`Failed to load image: ${src}`);
  };

  img.addEventListener("load", handleLoad);
  img.addEventListener("error", handleError);
  img.src = src;

  return wrap;
}

// ---- Render cards ----
function projectCard(p) {
  const initials = p.title.split(/\\s+/).map(w => w[0]).slice(0, 3).join("").toUpperCase();
  const card = el("article", { class: "card", tabindex: "0" });

  const thumb = safeImage(p.thumb, `${p.title} thumbnail`, initials);

  const title = el("h3", { class: "title" }, [p.title]);
  const desc = el("p", { class: "desc" }, [p.desc]);

  const badges = el("div", { class: "badges" }, p.tech.map(t => el("span", { class: "badge" }, [t])));

  const actions = el("div", { class: "actions" }, [
    el("a", { class: "btn", href: p.github, target: "_blank", rel: "noopener" }, ["GitHub"])
  ]);

  card.append(thumb, title, desc, badges, actions);
  card.addEventListener("click", (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === "a" || tag === "button") return;
    openModal(p);
  });
  card.addEventListener("keyup", (e) => { if (e.key === "Enter") openModal(p); });

  card.dataset.categories = p.categories.join("|");
  card.dataset.title = p.title.toLowerCase();
  return card;
}

function mountProjects() {
  const featuredGrid = $("#featuredGrid");
  const allGrid = $("#allGrid");

  const featured = PROJECTS.filter(p => p.featured);
  const rest = PROJECTS;

  featured.forEach(p => featuredGrid.appendChild(projectCard(p)));
  rest.forEach(p => allGrid.appendChild(projectCard(p)));
}

// ---- Filters + Search ----
function setupFilters() {
  const bar = $(".filter-bar");
  const underline = $(".filter-underline");
  const buttons = $$(".filter-btn");
  const featuredCards = $$("#featuredGrid .card");

  function moveUnderline(btn) {
    const rect = btn.getBoundingClientRect();
    const parentRect = bar.getBoundingClientRect();
    underline.style.width = rect.width + "px";
    underline.style.transform = `translateX(${rect.left - parentRect.left}px)`;
  }

  function applyFilter(category) {
    featuredCards.forEach(card => {
      const cats = card.dataset.categories.split("|");
      const show = category === "all" || cats.includes(category);
      card.style.display = show ? "" : "none";
      card.style.transform = "scale(0.98)";
      requestAnimationFrame(() => {
        card.style.transition = "transform .25s ease, opacity .25s ease";
        card.style.opacity = show ? "1" : "0";
        card.style.transform = show ? "scale(1)" : "scale(0.98)";
      });
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      moveUnderline(btn);
      applyFilter(btn.dataset.filter);
    });
  });

  const active = $(".filter-btn.active");
  if (active) moveUnderline(active);

  const search = $("#projectSearch");
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    const cards = $$("#featuredGrid .card, #allGrid .card");
    cards.forEach(card => {
      const t = card.dataset.title;
      const cats = card.dataset.categories.toLowerCase();
      const show = !q || t.includes(q) || cats.includes(q);
      card.style.display = show ? "" : "none";
      card.style.opacity = show ? "1" : "0";
    });
  });
}

// ---- View All toggle ----
function setupViewAll() {
  const grid = $("#allGrid");
  const btn = $("#toggleAll");
  let expanded = false;

  const update = () => {
    if (expanded) {
      grid.classList.remove("collapsed");
      btn.textContent = "Hide";
    } else {
      grid.classList.add("collapsed");
      btn.textContent = "View All";
    }
  };

  btn.addEventListener("click", () => { expanded = !expanded; update(); });
  update();
}

// ---- Modal ----
const modalEl = $("#modal");
const modalTitle = $(".modal-title", modalEl);
const modalDesc = $(".modal-desc", modalEl);
const modalTags = $(".tags", modalEl);
const modalLinks = $(".links", modalEl);
const modalMedia = $(".modal-media", modalEl);

function openModal(p) {
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.desc;

  modalTags.innerHTML = "";
  p.tech.concat(p.categories).forEach(tag => modalTags.appendChild(el("span", { class: "badge" }, [tag])));

  modalLinks.innerHTML = "";
  if (p.github) modalLinks.appendChild(el("a", { class: "btn", href: p.github, target: "_blank", rel: "noopener" }, ["GitHub"]));
  if (p.demo) modalLinks.appendChild(el("a", { class: "btn primary", href: p.demo, target: "_blank", rel: "noopener" }, ["Live Demo"]));

  modalMedia.innerHTML = "";
  const initials = p.title.split(/\\s+/).map(w => w[0]).slice(0, 3).join("").toUpperCase();
  modalMedia.appendChild(safeImage(p.thumb, `${p.title} preview`, initials));

  modalEl.classList.add("open");
  modalEl.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalEl.classList.remove("open");
  modalEl.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$(".modal-close", modalEl).addEventListener("click", closeModal);
$(".modal-backdrop", modalEl).addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// ---- Theme toggle ----
function setupTheme() {
  const key = "theme";
  const btn = $("#themeToggle");
  const saved = localStorage.getItem(key);
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  btn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(key, next);
  });
}

// ---- Reveal on scroll ----
function setupReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(el => obs.observe(el));
}

// ---- Resume button activation ----
function setupResume() {
  const btn = $("#resumeBtn");
  if (CONTACT.resumeUrl) {
    btn.href = CONTACT.resumeUrl;
    btn.download = "Atul Pachnure Resume test1.pdf";
    btn.classList.remove("disabled");
    btn.removeAttribute("aria-disabled");
  }
}

// ---- Boot ----
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  mountProjects();
  setupFilters();
  setupViewAll();
  setupTheme();
  setupReveal();
  setupResume();
});
