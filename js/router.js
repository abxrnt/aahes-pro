/* ============================
   SIMPLE SPA ROUTER (Upgraded)
   ============================ */

const app = document.getElementById("app");

// Cache for loaded HTML components
const componentCache = {};
// Cache for loaded JS modules (cutoffs.js, pyqs.js etc.)
const scriptCache = {};

// Load component HTML
async function loadComponentHTML(name) {
  if (componentCache[name]) return componentCache[name];

  const res = await fetch(`components/${name}.html`);
  if (!res.ok) {
    console.error(`❌ Failed to load component: ${name}.html`);
    return `<p>Failed to load ${name}.html</p>`;
  }

  const html = await res.text();
  componentCache[name] = html;
  return html;
}

// Load component JS (if exists)
async function loadComponentJS(name) {
  if (scriptCache[name]) return; // Already loaded

  try {
    const module = await import(`./components/${name}.js`);
    scriptCache[name] = module;

    // If component exposes init() — call it
    if (module.init) module.init();
    if (module.initCutoffs) module.initCutoffs(); // For cutoffs.js
    if (module.initPYQs) module.initPYQs();       // For pyqs.js
  } catch (err) {
    // No JS file — ignore silently
    console.warn(`⚠️ No JS for component: ${name}.js`);
  }
}

// Main page loader
async function showPage(page) {
  const html = await loadComponentHTML(page);

  // Fade out old page
  app.classList.add("fade-out");
  await new Promise((res) => setTimeout(res, 150));

  // Insert new HTML
  app.innerHTML = html;

  // Fade in new page
  app.classList.remove("fade-out");
  app.classList.add("fade-in");

  // Update navbar highlight
  updateActiveTab(page);

  // Close mobile menu
  closeMobileMenu();

  // Scroll to top
  window.scrollTo({ top: 0 });

  // Load JS for this page
  await loadComponentJS(page);
}

// Highlight active nav tab
function updateActiveTab(current) {
  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.classList.remove("tab-active");
  });

  const active = document.querySelector(`[data-tab="${current}"]`);
  if (active) active.classList.add("tab-active");
}

// Close mobile menu
function closeMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (menu) {
    menu.classList.add("hidden");
    menu.classList.remove("open");
  }
}

// Setup nav button listeners
function initTabEvents() {
  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.onclick = () => {
      location.hash = btn.dataset.tab;
    };
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (!btn || !menu) return;

  btn.onclick = () => {
    const hide = menu.classList.contains("hidden");
    menu.classList.toggle("hidden", !hide);
    menu.classList.toggle("open", hide);
  };
}

// Router listener
window.addEventListener("hashchange", () => {
  const pg = location.hash.replace("#", "") || "home";
  showPage(pg);
});

// Initial load
window.addEventListener("load", () => {
  const initial = location.hash.replace("#", "") || "home";
  showPage(initial);

  initTabEvents();
  initMobileMenu();
});
