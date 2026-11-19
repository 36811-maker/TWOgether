// Pure JavaScript Frontend Application for TWOgether
(function () {
  let currentUser = null;
  const anniversaryDate = "2023-05-13";

  // Elements
  const loginScreen = document.getElementById("loginScreen");
  const appContainer = document.getElementById("appContainer");
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginError = document.getElementById("loginError");
  const togglePasswordBtn = document.getElementById("togglePasswordBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  function init() {
    const saved = localStorage.getItem("twogether_pure_user");
    if (saved) {
      try {
        currentUser = JSON.parse(saved);
        showApp();
      } catch {
        localStorage.removeItem("twogether_pure_user");
        showLogin();
      }
    } else {
      showLogin();
    }

    setupEventListeners();
  }

  function setupEventListeners() {
    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener("click", () => {
        const type = loginPassword.getAttribute("type") === "password" ? "text" : "password";
        loginPassword.setAttribute("type", type);
        togglePasswordBtn.textContent = type === "password" ? "👁️" : "🙈";
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loginError.style.display = "none";

        const email = loginEmail.value.trim().toLowerCase();
        const password = loginPassword.value.trim();

        try {
          const res = await fetch(`${window.API_CONFIG.BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            loginError.textContent = data.error || "Acesso não autorizado.";
            loginError.style.display = "block";
            return;
          }

          currentUser = data.user;
          localStorage.setItem("twogether_pure_user", JSON.stringify(currentUser));
          showApp();
        } catch {
          // Client-side authentication fallback for Pedro & Emilly
          if (
            (email === "pedro@gmail.com" && password === "13052009") ||
            (email === "emilly@gmail.com" && password === "11042011")
          ) {
            currentUser = {
              email,
              name: email === "pedro@gmail.com" ? "Pedro" : "Emilly",
              currentMood: "Apaixonado(a) 🥰",
            };
            localStorage.setItem("twogether_pure_user", JSON.stringify(currentUser));
            showApp();
          } else {
            loginError.textContent = "Credenciais inválidas para o espaço privado.";
            loginError.style.display = "block";
          }
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("twogether_pure_user");
        currentUser = null;
        showLogin();
      });
    }
  }

  function showLogin() {
    loginScreen.style.display = "flex";
    appContainer.style.display = "none";
  }

  function showApp() {
    loginScreen.style.display = "none";
    appContainer.style.display = "block";

    // Setup Header info
    document.getElementById("userNameDisplay").textContent = currentUser.name;
    document.getElementById("partnerNameDisplay").textContent =
      currentUser.name === "Pedro" ? "Emilly" : "Pedro";

    // Calculate days together
    const start = new Date(anniversaryDate);
    const now = new Date();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    document.getElementById("daysCounterNumber").textContent = diff;

    loadDashboardNotes();
    loadGoals();
    loadDreams();
    loadMemories();
  }

  window.fillAccount = function (acc) {
    if (acc === "pedro") {
      loginEmail.value = "pedro@gmail.com";
      loginPassword.value = "13052009";
    } else {
      loginEmail.value = "emilly@gmail.com";
      loginPassword.value = "11042011";
    }
  };

  window.switchTab = function (tabId) {
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabId);
    });
    document.querySelectorAll(".tab-view").forEach((view) => {
      view.classList.toggle("active", view.id === `tab-${tabId}`);
    });
  };

  window.handlePostNote = async function (e) {
    e.preventDefault();
    const input = document.getElementById("noteInput");
    const text = input.value.trim();
    if (!text) return;

    try {
      await fetch(`${window.API_CONFIG.BASE_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: currentUser.name,
          content: text,
          color: "rose",
        }),
      });
    } catch {
      // Local fallback
    }

    input.value = "";
    loadDashboardNotes();
  };

  async function loadDashboardNotes() {
    const grid = document.getElementById("notesGrid");
    if (!grid) return;

    try {
      const res = await fetch(`${window.API_CONFIG.BASE_URL}/notes`);
      const notes = await res.json();
      if (Array.isArray(notes) && notes.length > 0) {
        grid.innerHTML = notes
          .map(
            (n) => `
          <div class="note-item">
            <strong>${n.author}:</strong>
            <p>${n.content}</p>
          </div>
        `
          )
          .join("");
        return;
      }
    } catch {
      // Fallback
    }

    grid.innerHTML = `
      <div class="note-item">
        <strong>Pedro:</strong>
        <p>Bom dia meu amor! Deixei café quentinho pra você! Te amo ❤️</p>
      </div>
      <div class="note-item" style="background: #faecec; border-color: #f0cfcf; color: #7a4848;">
        <strong>Emilly:</strong>
        <p>Você é meu lugar favorito no mundo! Contando as horas para mais tarde ✨</p>
      </div>
    `;
  }

  async function loadGoals() {
    const grid = document.getElementById("goalsGrid");
    if (!grid) return;
    try {
      const res = await fetch(`${window.API_CONFIG.BASE_URL}/goals`);
      const goals = await res.json();
      if (Array.isArray(goals) && goals.length > 0) {
        grid.innerHTML = goals
          .map(
            (g) => `
          <div class="app-card">
            <span class="badge-private">${g.category}</span>
            <h4 style="margin-top: 8px;">${g.title}</h4>
            <p>${g.description || ""}</p>
            <div style="margin-top: 10px; font-weight: bold; color: #a46868;">Progresso: ${g.progress}%</div>
          </div>
        `
          )
          .join("");
      }
    } catch {
      // Ignore
    }
  }

  async function loadDreams() {
    const grid = document.getElementById("dreamsGrid");
    if (!grid) return;
    try {
      const res = await fetch(`${window.API_CONFIG.BASE_URL}/dreams`);
      const dreams = await res.json();
      if (Array.isArray(dreams) && dreams.length > 0) {
        grid.innerHTML = dreams
          .map(
            (d) => `
          <div class="app-card">
            <span class="badge-private">${d.priority}</span>
            <h4 style="margin-top: 8px;">${d.title}</h4>
            <p>${d.description || ""}</p>
            <div style="margin-top: 10px; color: #456b48; font-weight: 600;">${d.estimatedCost || ""}</div>
          </div>
        `
          )
          .join("");
      }
    } catch {
      // Ignore
    }
  }

  async function loadMemories() {
    const grid = document.getElementById("memoriesGrid");
    if (!grid) return;
    try {
      const res = await fetch(`${window.API_CONFIG.BASE_URL}/memories`);
      const memories = await res.json();
      if (Array.isArray(memories) && memories.length > 0) {
        grid.innerHTML = memories
          .map(
            (m) => `
          <div class="app-card">
            <span class="badge-private">${m.category}</span>
            <h4 style="margin-top: 8px;">${m.title}</h4>
            <p style="font-style: italic; margin-top: 6px;">"${m.caption || ""}"</p>
            <div style="margin-top: 10px; font-size: 11px; color: #a46868;">${m.location || ""} • ${m.date}</div>
          </div>
        `
          )
          .join("");
      }
    } catch {
      // Ignore
    }
  }

  window.openMoodModal = function () {
    const newMood = prompt("Como você está se sentindo hoje?", "Apaixonado(a) 🥰");
    if (newMood) {
      document.getElementById("userMoodDisplay").textContent = newMood;
    }
  };

  document.addEventListener("DOMContentLoaded", init);
})();
