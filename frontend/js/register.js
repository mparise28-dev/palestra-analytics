const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  // === CÓDIGO DO REGISTRO ===
  const form = document.getElementById("register-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      const messageArea = document.getElementById("message-area");
      messageArea.innerHTML = "";

      if (password !== confirmPassword) {
        showMessage("As senhas não coincidem", "error");
        return;
      }

      if (password.length < 6) {
        showMessage("A senha deve ter pelo menos 6 caracteres", "error");
        return;
      }

      if (!username || !email) {
        showMessage("Preencha todos os campos", "error");
        return;
      }

      const submitBtn = document.querySelector(".btn-register");
      submitBtn.disabled = true;
      submitBtn.textContent = "Criando conta...";

      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          showMessage("Conta criada com sucesso! Redirecionando...", "success");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2000);
        } else {
          showMessage(data.message || "Erro ao criar conta", "error");
          submitBtn.disabled = false;
          submitBtn.textContent = "Criar Conta";
        }
      } catch (error) {
        console.error("Erro:", error);
        showMessage("Erro de conexão com o servidor", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Criar Conta";
      }
    });
  }

  // === ABRIR MODAL DE LOGIN ===
  const loginLink = document.getElementById("open-login-modal");

  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();

      // Chama a função global do modal
      if (typeof window.openModal === "function") {
        window.openModal();
      } else {
        console.warn("Função openModal não encontrada, redirecionando...");
        window.location.href = "login.html";
      }
    });
  }
});

function showMessage(msg, type) {
  const messageArea = document.getElementById("message-area");
  if (!messageArea) return;

  const div = document.createElement("div");
  div.className = type === "error" ? "error-message" : "success-message";
  div.textContent = msg;
  messageArea.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}
