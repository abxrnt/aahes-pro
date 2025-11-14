/* ============================
   SIMPLE SPA ROUTER
   ============================ */

const app = document.getElementById("app");

// Cache for loaded components
const componentCache = {};

// Load component HTML from /components/
async function loadComponent(name) {
  if (componentCache[name]) return componentCache[name];

  const res = await fetch(`components/${name}.html`);
  const html = await res.text();
  componentCache[name] = html;
  return html;
}

// Show a page
async function showPage(page) {
  const html = await loadComponent(page);

  // Fade out current
  app.classList.add("fade-out");
  await new Promise((r) => setTimeout(r, 150));

  // Replace HTML
  app.innerHTML = html;

  // Fade in new
  app.classList.remove("fade-out");
  app.classList.add("fade-in");

  // Highlight active tab
  updateActiveTab(page);

  // Close mobile menu if open
  closeMobileMenu();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update navbar highlight
function updateActiveTab(current) {
  document
    .querySelectorAll("[data-tab]")
    .forEach((btn) => btn.classList.remove("tab-active"));

  const activeBtn = document.querySelector(`[data-tab="${current}"]`);
  if (activeBtn) activeBtn.classList.add("tab-active");
}

// Mobile menu close
function closeMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (!menu) return;
  menu.classList.add("hidden");
  menu.classList.remove("open");
}

// Setup tab click listeners
function initTabEvents() {
  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.tab;
      location.hash = page; // also updates router
    });
  });
}

// Mobile menu
function initMobileMenu() {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const hidden = menu.classList.contains("hidden");
    if (hidden) {
      menu.classList.remove("hidden");
      menu.classList.add("open");
    } else {
      menu.classList.add("hidden");
      menu.classList.remove("open");
    }
  });
}

// Router logic (listens to URL hash)
window.addEventListener("hashchange", () => {
  const page = location.hash.replace("#", "") || "home";
  showPage(page);
});

// Initial load
window.addEventListener("load", () => {
  const initial = location.hash.replace("#", "") || "home";
  showPage(initial);

  initTabEvents();
  initDropdown();
  initMobileMenu();
});
