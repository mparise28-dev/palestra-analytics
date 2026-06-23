function getToken() {
  return localStorage.getItem("palestra_token");
}

function getUser() {
  const userStr = localStorage.getItem("palestra_user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    return null;
  }
}

function isLoggedIn() {
  return Boolean(getToken());
}

function isAdmin() {
  return getUser()?.role === "admin";
}

function logout(redirectTo = "/") {
  localStorage.removeItem("palestra_token");
  localStorage.removeItem("palestra_user");
  window.location.href = redirectTo;
}

window.PalestraAuth = {
  getToken,
  getUser,
  isLoggedIn,
  isAdmin,
  logout,
};
