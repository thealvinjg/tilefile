const API_URL = "http://localhost:8080/api/v1/tile-file";
const LOCAL_SCAN_URL = "http://localhost:8080/api/v1/local-scan";

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

export const getLocalFiles = async () => {
    const response = await fetch(`${LOCAL_SCAN_URL}/files`);
    if (!response.ok) throw new Error("Failed to fetch local files");
    return response.json(); // Returns ["file1.pdf", "file2.pdf"]
}
// Import a specific file to the DB
export const importLocalFile = async (fileName) => {
    const url = `${LOCAL_SCAN_URL}/import?fileName=${encodeURIComponent(fileName)}`;
    // Send as query param: ?fileName=abc.pdf
    const response = await fetch(url, {
      method: "POST",
    });

    if (!response.ok) throw new Error("Failed to import local file");
    return response;

};