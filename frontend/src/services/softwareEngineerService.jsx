const API_URL = "http://localhost:8080/api/v1/software-engineers";

// GET ALL
export const getEngineers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch engineers");
  return response.json();
};

// CREATE
export const saveEngineer = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error("Failed to save engineer");
  return response;
};

// DELETE
export const deleteEngineer = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) throw new Error("Failed to delete engineer");
  return response;
};

// PATCH
export const patchEngineer = async (id, data) => {
  const params = new URLSearchParams(data).toString();

  const response = await fetch(`${API_URL}/${id}?${params}`, {
    method: "PATCH"
  });

  if (!response.ok) throw new Error("Failed to patch engineer");
  return response;
};
