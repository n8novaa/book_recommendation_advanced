const API_URL = "http://127.0.0.1:8000/api";

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    window.dispatchEvent(new Event("storage")); // Trigger Navbar update
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage")); // Trigger Navbar update
  }
};

export const login = async (credentials: Record<string, string>) => {
  const res = await fetch(`${API_URL}/users/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Endpoint not found (404). Check backend routing.`);
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || "Login failed. Please check your credentials.");
  }
  return res.json();
};

export const register = async (data: Record<string, string>) => {
  const res = await fetch(`${API_URL}/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Endpoint not found (404). Check backend routing.`);
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || "Registration failed. Please try again.");
  }
  return res.json();
};

export const getBooks = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/books/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error(`Unauthorized (401). Your session may have expired. Error: ${errorData.code || errorData.detail || 'Missing token'}`);
    }
    if (res.status === 404) {
      throw new Error(`Endpoint not found (404). URL: /api/books/. Are you sure it's routed correctly in Django?`);
    }
    if (res.status === 405) {
      throw new Error(`Method Not Allowed (405). Your Django 'BookCreateView' is missing a 'def get(self, request):' method! It only supports POST right now.`);
    }
    throw new Error(errorData.detail || errorData.error || `Failed to fetch books from backend. Status: ${res.status}`);
  }
  return res.json();
};

export const addInteraction = async (book_id: number, interaction_type: string, rating: number | null = null) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/interactions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ book_id, interaction_type, rating }),
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Endpoint not found (404). URL: /api/interactions/`);
    }
    throw new Error("Failed to record interaction");
  }
  return res.json();
};
