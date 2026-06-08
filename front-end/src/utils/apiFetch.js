const TOKEN_KEYS = {
  craftsman: "forsaToken",
  admin: "adminToken",
};

export async function apiFetch(url, options = {}, tokenKey = "craftsman") {
  const storageKey = TOKEN_KEYS[tokenKey] ?? tokenKey;
  const token = localStorage.getItem(storageKey);

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem(storageKey);
    localStorage.removeItem("forsaCraftsman");
    window.location.href = "/login";
  }

  return res;
}
