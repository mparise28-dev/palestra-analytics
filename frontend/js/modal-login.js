// ============================================
// MODAL DE LOGIN
// ============================================

const API_URL_AUTH = "http://localhost:3000";

// Elementos do modal
const modal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalLoginForm = document.getElementById("modalLoginForm");
const modalEmail = document.getElementById("modalEmail");
const modalPassword = document.getElementById("modalPassword");
const modalSubmitBtn = document.getElementById("modalSubmitBtn");
const modalErrorMessage = document.getElementById("modalErrorMessage");
const modalRememberMe = document.getElementById("modalRememberMe");
const modalTogglePassword = document.getElementById("modalTogglePassword");
const authArea = document.getElementById("authArea");

// ============================================
// FUNÇÕES DO MODAL
// ============================================

function openModal() {
  if (!modal) return;
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
  if (modalEmail) modalEmail.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("show");
  document.body.style.overflow = "";
  if (modalLoginForm) modalLoginForm.reset();
  if (modalErrorMessage) modalErrorMessage.style.display = "none";
}

function showModalError(message) {
  if (!modalErrorMessage) return;
  modalErrorMessage.textContent = message;
  modalErrorMessage.style.display = "block";
  setTimeout(() => {
    if (modalErrorMessage) modalErrorMessage.style.display = "none";
  }, 5000);
}

function setModalLoading(isLoading) {
  if (!modalSubmitBtn) return;
  const btnText = modalSubmitBtn.querySelector(".btn-text");
  const btnLoading = modalSubmitBtn.querySelector(".btn-loading");

  if (isLoading) {
    modalSubmitBtn.disabled = true;
    if (btnText) btnText.style.display = "none";
    if (btnLoading) btnLoading.style.display = "inline";
  } else {
    modalSubmitBtn.disabled = false;
    if (btnText) btnText.style.display = "inline";
    if (btnLoading) btnLoading.style.display = "none";
  }
}

// ============================================
// LOGIN
// ============================================

async function handleModalLogin(email, password) {
  try {
    const response = await fetch(`${API_URL_AUTH}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao fazer login");
    }

    if (data.success && data.data) {
      const { token, user } = data.data;

      localStorage.setItem("palestra_token", token);
      localStorage.setItem("palestra_user", JSON.stringify(user));

      if (modalRememberMe && modalRememberMe.checked) {
        localStorage.setItem("palestra_email", email);
        localStorage.setItem("palestra_remember", "true");
      } else {
        localStorage.removeItem("palestra_email");
        localStorage.removeItem("palestra_remember");
      }

      closeModal();
      updateAuthUI();

      // Recarregar dados se as funções existirem no main.js
      if (typeof window.carregarEstatisticasTime === "function") {
        window.carregarEstatisticasTime();
        window.carregarRanking();
        window.carregarUltimosJogos();
      }

      return true;
    } else {
      throw new Error(data.message || "Credenciais inválidas");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    showModalError(error.message || "Erro ao conectar com o servidor");
    return false;
  }
}

// ============================================
// UI DE AUTENTICAÇÃO
// ============================================

function updateAuthUI() {
  const token = localStorage.getItem("palestra_token");
  const userStr = localStorage.getItem("palestra_user");
  let userName = "Torcedor";

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userName = user.name || user.email?.split("@")[0] || "Torcedor";
    } catch (e) {}
  }

  if (token && authArea) {
    authArea.innerHTML = `
      <div class="user-info">
        <span class="user-name">👋 Olá, ${userName}</span>
        <button id="logoutHeaderBtn" class="btn-logout">Sair</button>
      </div>
    `;

    const logoutBtn = document.getElementById("logoutHeaderBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("palestra_token");
        localStorage.removeItem("palestra_user");
        updateAuthUI();
        if (typeof window.carregarEstatisticasTime === "function") {
          window.carregarEstatisticasTime();
          window.carregarRanking();
          window.carregarUltimosJogos();
        }
      });
    }
  } else if (authArea && !token) {
    authArea.innerHTML = `<button id="loginBtn" class="btn-login">Acessar Conta</button>`;
    const newLoginBtn = document.getElementById("loginBtn");
    if (newLoginBtn) {
      newLoginBtn.addEventListener("click", openModal);
    }
  }
}

// ============================================
// EVENTOS
// ============================================

if (loginBtn) loginBtn.addEventListener("click", openModal);
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

// Fechar ao clicar fora do modal
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

// ESC fecha modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.classList.contains("show")) {
    closeModal();
  }
});

// Toggle senha
if (modalTogglePassword) {
  modalTogglePassword.addEventListener("click", () => {
    if (!modalPassword) return;
    const type =
      modalPassword.getAttribute("type") === "password" ? "text" : "password";
    modalPassword.setAttribute("type", type);
    modalTogglePassword.textContent = type === "password" ? "👁️" : "🙈";
  });
}

// Submit do login
if (modalLoginForm) {
  modalLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = modalEmail?.value.trim();
    const password = modalPassword?.value;

    if (!email) {
      showModalError("Por favor, informe seu e-mail");
      return;
    }
    if (!password) {
      showModalError("Por favor, informe sua senha");
      return;
    }
    if (password.length < 6) {
      showModalError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setModalLoading(true);
    await handleModalLogin(email, password);
    setModalLoading(false);
  });
}

// Preencher e-mail lembrado
function loadRememberedEmail() {
  const remembered = localStorage.getItem("palestra_remember");
  const savedEmail = localStorage.getItem("palestra_email");
  if (remembered === "true" && savedEmail && modalEmail) {
    modalEmail.value = savedEmail;
    if (modalRememberMe) modalRememberMe.checked = true;
  }
}

// Expor funções globalmente para o main.js acessar
window.updateAuthUI = updateAuthUI;
window.openModal = openModal;

// Inicializar
loadRememberedEmail();
updateAuthUI();

console.log("Modal de login carregado com sucesso!");
