import api from "./axios";

// Thin wrappers around the /api/groups backend routes. The axios instance
// auto-attaches the JWT, so these just deal in plain data in/out.

// GET /api/groups -> the logged-in user's groups, with members + createdBy
// populated ({ _id, name, email }).
export const getGroups = () => api.get("/groups").then((res) => res.data);

// The backend has no GET /groups/:id, so we reuse the list endpoint and pick
// the one we want. Fine at this scale and keeps us on existing APIs.
export const getGroup = (id) =>
  getGroups().then((groups) => groups.find((g) => g._id === id) || null);

// POST /api/groups { name } -> the created group.
export const createGroup = (name) =>
  api.post("/groups", { name }).then((res) => res.data);

// POST /api/groups/:id/add-member { email } -> the updated group.
export const addMember = (groupId, email) =>
  api.post(`/groups/${groupId}/add-member`, { email }).then((res) => res.data);
