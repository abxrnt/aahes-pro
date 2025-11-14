/* ================================
   AAHES — Premium Cutoffs Module
   ================================ */

/* In-memory store */
let cutoffData = [];

/* Fallback Demo */
const demoCutoffs = [
  { college: "AEC", branch: "CSE", cat: "GEN", round: 1, close: 120, marks: 85 },
  { college: "JEC", branch: "CSE", cat: "GEN", round: 1, close: 220, marks: 78 },
  { college: "AEC", branch: "ME",  cat: "GEN", round: 1, close: 500, marks: 60 }
];

/* ========== FIRESTORE LOADING ========== */
async function loadCutoffs() {
  try {
    const { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"
    );
    const { getFirestore, collection, getDocs } = await import(
      "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"
    );

    const firebaseConfig = {
      apiKey: "AIzaSyBOVl1hdmprJXpgdN_sNTO3FsNePD_zNZY",
      authDomain: "aahes-cee-cutoffs.firebaseapp.com",
      projectId: "aahes-cee-cutoffs",
      storageBucket: "aahes-cee-cutoffs.firebasestorage.app",
      messagingSenderId: "706066626405",
      appId: "1:706066626405:web:0d254ab82beb288108938c",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const snap = await getDocs(collection(db, "cutoffs"));
    const docs = snap.docs.map((d) => d.data());

    cutoffData = docs.length ? docs : demoCutoffs;
  } catch (e) {
    console.warn("⚠ Firestore failed → Using demo fallback.");
    cutoffData = demoCutoffs;
  }
}

/* ========== UI INITIALIZE ========== */
async function initCutoffUI() {
  await loadCutoffs();

  const collegeSel = document.getElementById("cutoffCollege");
  const branchSel = document.getElementById("cutoffBranch");
  const catSel    = document.getElementById("cutoffCat");
  const form      = document.getElementById("cutoffFilterForm");
  const result    = document.getElementById("cutoffResult");

  /* ---------------- Populate branches ---------------- */
  collegeSel.addEventListener("change", () => {
    const college = collegeSel.value;
    branchSel.innerHTML = `<option value="">Select Branch</option>`;

    if (!college) return;

    const branches = [
      ...new Set(cutoffData.filter(d => d.college === college).map(d => d.branch))
    ].sort();

    branches.forEach((b) => {
      const o = document.createElement("option");
      o.value = o.textContent = b;
      branchSel.appendChild(o);
    });
  });

  /* ---------------- Submit Filter ---------------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const college = collegeSel.value;
    const branch  = branchSel.value;
    const cat     = catSel.value;

    if (!college || !branch || !cat) {
      result.innerHTML = `
        <p class="text-red-600 font-semibold text-center">
          ⚠ Please select all fields.
        </p>
      `;
      return;
    }

    const rows = cutoffData.filter(
      d => d.college === college && d.branch === branch && d.cat === cat
    );

    if (!rows.length) {
      result.innerHTML = `
        <p class="text-gray-500 text-center">
          No cutoff data found for your selection.
        </p>
      `;
      return;
    }

    /* Build premium cards */
    let html = "";
    rows.sort((a, b) => a.round - b.round).forEach((m) => {

      html += `
        <div class="rounded-2xl p-6 shadow-lg border border-gray-200 bg-white
                    hover:shadow-xl transition-all duration-300">

          <!-- Header -->
          <div class="mb-3">
            <div class="text-xs font-bold uppercase tracking-wide 
                        bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 
                        bg-clip-text text-transparent">
              Round ${m.round}
            </div>

            <h3 class="text-xl font-extrabold text-slate-900">
              ${m.college} — ${m.branch}
            </h3>
          </div>

          <!-- Details -->
          <div class="space-y-1 text-sm text-slate-600">
            <div><strong>Category:</strong> ${m.cat}</div>
          </div>

          <!-- Rank -->
          <div class="mt-4">
            <p class="text-xs text-gray-400">Closing Rank</p>
            <p class="text-4xl font-black 
                      bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 
                      bg-clip-text text-transparent">
              ${m.close ?? "-"}
            </p>
          </div>

          <div class="mt-2 text-sm text-gray-700">
            Marks: <span class="font-semibold">${m.marks ?? "-"}</span>
          </div>

        </div>
      `;
    });

    result.innerHTML = html;
  });
}

/* Auto-run */
initCutoffUI();
