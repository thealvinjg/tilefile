const API_URL = "http://localhost:8080/api/v1/tile-file";

// GET ALL
export const getFiles = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch files");
  return response.json();
};

// CREATE (Upload new file)
export const saveFiles = async (formData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    // NOTE: Do NOT set Content-Type header manually for FormData. 
    // The browser does it automatically.
    body: formData 
  });

  if (!response.ok) throw new Error("Failed to save file");
  return response;
};

// DELETE
export const deleteFiles = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) throw new Error("Failed to delete file");
  return response;
};

// PATCH (Update name or file)
export const patchFiles = async (id, formData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    // NOTE: Do NOT set Content-Type header manually for FormData.
    body: formData
  });

  if (!response.ok) throw new Error("Failed to patch file");
  return response;
};