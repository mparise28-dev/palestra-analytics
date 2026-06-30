function getMatchesContainer() {
  return document.getElementById("matches-container");
}

function setUserInfo() {
  const userName = document.getElementById("userName");
  const user = window.PalestraAuth?.getUser();

  if (!userName) return;

  userName.textContent = user?.name || user?.email?.split("@")[0] || "Torcedor";
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    window.PalestraAuth?.logout("/");
  });
}

function formatDate(dateValue) {
  if (!dateValue) return "Data nao informada";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Data invalida";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatScore(match) {
  const homeScore = match.home_score ?? "-";
  const awayScore = match.away_score ?? "-";

  return `${homeScore} x ${awayScore}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderLoading() {
  const container = getMatchesContainer();
  if (!container) return;

  container.innerHTML = '<div class="loading">Carregando partidas...</div>';
}

function renderEmpty() {
  const container = getMatchesContainer();
  if (!container) return;

  container.innerHTML =
    '<div class="state-message">Nenhuma partida cadastrada ainda.</div>';
}

function renderError() {
  const container = getMatchesContainer();
  if (!container) return;

  container.innerHTML =
    '<div class="state-message">Nao foi possivel carregar as partidas agora. Tente novamente em instantes.</div>';
}

function renderMatches(matches) {
  const container = getMatchesContainer();
  if (!container) return;

  if (!Array.isArray(matches) || matches.length === 0) {
    renderEmpty();
    return;
  }

  container.innerHTML = `
    <div class="matches-list">
      ${matches
        .map((match) => {
          const stadium = match.stadium
            ? `<div class="match-stadium">${escapeHtml(match.stadium)}</div>`
            : "";

          return `
            <article class="match-card">
              <div class="match-date">${formatDate(match.match_date)}</div>
              <div>
                <div class="match-teams">
                  <span>${escapeHtml(match.home_team || "Mandante")}</span>
                  <span class="vs">x</span>
                  <span>${escapeHtml(match.away_team || "Visitante")}</span>
                </div>
                ${stadium}
              </div>
              <div class="match-score">${formatScore(match)}</div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

async function loadMatches() {
  renderLoading();

  try {
    const result = await window.PalestraAPI.get("/matches");
    const matches = result?.success ? result.data : result;

    renderMatches(matches);
  } catch (error) {
    console.error("Erro ao carregar partidas:", error);
    renderError();
  }
}

function initMatchesPage() {
  if (!window.PalestraAPI) {
    renderError();
    return;
  }

  setUserInfo();
  setupLogout();
  loadMatches();
}

document.addEventListener("DOMContentLoaded", initMatchesPage);
