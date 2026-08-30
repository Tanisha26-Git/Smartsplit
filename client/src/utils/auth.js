// Tiny auth-state helper. The whole app reads/writes the JWT and the logged-in
// user's info through here, so the localStorage keys live in exactly one place.
const TOKEN_KEY = "token";
const USER_KEY = "user";

// The backend returns { _id, name, email, token } on login/register.
// We keep the token under "token" (the axios interceptor reads that key) and
// stash the rest of the user object under "user" so the UI can show the name.
export const saveAuth = ({ token, ...user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
