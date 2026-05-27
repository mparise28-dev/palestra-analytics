// ============================================
// CONFIGURAÇÕES
// ============================================
const API_URL = "http://localhost:3000";

// Elementos do DOM
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const btnText = submitBtn?.querySelector(".btn-text");
const btnLoading = submitBtn?.querySelector(".btn-loading");
const errorMessageDiv = document.getElementById("errorMessage");
const rememberMeCheckbox = document.getElementById("rememberMe");
const togglePasswordBtn = document.getElementById("togglePassword");

// ============================================
// UTILITÁRIOS
// ============================================

function showError(message) {
  if (errorMessageDiv) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = "block";
  }

  // Esconder erro após 5 segundos
  setTimeout(() => {
    if (errorMessageDiv) {
      errorMessageDiv.style.display = "none";
    }
  }, 5000);
}

function setLoading(isLoading) {
  if (!submitBtn) return;

  if (isLoading) {
    submitBtn.disabled = true;
    if (btnText) btnText.style.display = "none";
    if (btnLoading) btnLoading.style.display = "inline";
  } else {
    submitBtn.disabled = false;
    if (btnText) btnText.style.display = "inline";
    if (btnLoading) btnLoading.style.display = "none";
  }
}

function saveToken(token) {
  localStorage.setItem("palestra_token", token);

  if (rememberMeCheckbox && rememberMeCheckbox.checked) {
    localStorage.setItem("palestra_remember", "true");
  } else {
    localStorage.removeItem("palestra_remember");
  }
}

function saveUserData(user) {
  localStorage.setItem("palestra_user", JSON.stringify(user));
}

// ============================================
// FUNÇÃO DE LOGIN
// ============================================

async function handleLogin(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
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

    // Login bem-sucedido
    if (data.success && data.data) {
      const { token, user } = data.data;

      saveToken(token);
      saveUserData(user);

      // Redirecionar para o dashboard
      window.location.href = "/pages/dashboard.html";
    } else {
      throw new Error(data.message || "Credenciais inválidas");
    }
  } catch (error) {
    console.error("Erro no login:", error);
    showError(error.message || "Erro ao conectar com o servidor");
    setLoading(false);
  }
}

// ============================================
// EVENTOS
// ============================================

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput?.value.trim();
    const password = passwordInput?.value;

    // Validações básicas
    if (!email) {
      showError("Por favor, informe seu e-mail");
      return;
    }

    if (!password) {
      showError("Por favor, informe sua senha");
      return;
    }

    if (password.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    await handleLogin(email, password);
  });
}

// Toggle mostrar/esconder senha
if (togglePasswordBtn) {
  togglePasswordBtn.addEventListener("click", () => {
    const type =
      passwordInput?.getAttribute("type") === "password" ? "text" : "password";
    passwordInput?.setAttribute("type", type);
    togglePasswordBtn.textContent = type === "password" ? "👁️" : "🙈";
  });
}

// Preencher e-mail lembrado
function loadRememberedEmail() {
  const remembered = localStorage.getItem("palestra_remember");
  const savedEmail = localStorage.getItem("palestra_email");

  if (remembered === "true" && savedEmail && emailInput) {
    emailInput.value = savedEmail;
    if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
  }
}

// Salvar e-mail se "lembrar" estiver marcado
if (emailInput && rememberMeCheckbox) {
  emailInput.addEventListener("change", () => {
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("palestra_email", emailInput.value);
    }
  });
}

// Verificar se já está logado
function checkAlreadyLoggedIn() {
  const token = localStorage.getItem("palestra_token");
  if (token && window.location.pathname.includes("login.html")) {
    // Redirecionar para dashboard se já estiver logado
    window.location.href = "/pages/dashboard.html";
  }
}

// Inicialização
loadRememberedEmail();
checkAlreadyLoggedIn();
