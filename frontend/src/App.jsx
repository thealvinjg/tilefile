import { useEffect, useState } from "react";
import './App.css';
import { getFiles, saveFiles, deleteFiles, patchFiles } from "./services/tileFileService";

import TileList from "./components/TileList";
import TileForm from "./components/TileForm";
import PreviewPanel from "./components/PreviewPanel";

const App = () => {
  const [editingId, setEditingId] = useState(null);
  const [files, setFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({ name: "", file: null, gDriveLink: "" });

  useEffect(() => {
    refreshFiles();
    if (showPreview && editingId) {
      // Re-use your existing preview logic
      setPreviewUrl(`http://localhost:8080/api/v1/tile-file/${editingId}/preview`);
    } 
    // 2. If Preview is OFF or No File Selected -> Clear it
    else {
      setPreviewUrl(null);
    }
  }, [showPreview, editingId]);

  const refreshFiles = () => {
    getFiles().then(setFiles).catch(console.error);
  };

  const handleSelect = (file) => {
    // If clicking the same file, deselect it. Otherwise, select new one.
    if (editingId === file.id) {
        handleCancel();
    } else {
        setEditingId(file.id);
        setForm({ name: file.name, file: null, gDriveLink: file.gDriveLink || "" });
        // Reset file input visual
        if(document.getElementById("fileInput")) document.getElementById("fileInput").value = "";
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", file: null, gDriveLink: "" });
    setPreviewUrl(null); // Optional: Clear preview when deselecting
    if(document.getElementById("fileInput")) document.getElementById("fileInput").value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (form.name) formData.append("name", form.name);
    if (form.file) formData.append("file", form.file);
    if (form.gDriveLink) formData.append("gDriveLink", form.gDriveLink);

    if (!editingId && !form.file) {
      alert("Please select a PDF file to upload.");
      return; // Stop the function here
  }

    const action = editingId ? patchFiles(editingId, formData) : saveFiles(formData);

    action.then(() => {
        refreshFiles();
        handleCancel();
    }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (previewUrl && previewUrl.includes(id)) setPreviewUrl(null);
    deleteFiles(id).then(refreshFiles).catch(console.error);
    setForm({ name: "", file: null, GDriveLink: "" });
    handleCancel();
  };

  const handleEdit = (file) => {
    setForm({ name: file.name, file: null, GDriveLink: file.GDriveLink });
    setEditingId(file.id);
    if(document.getElementById("fileInput")) document.getElementById("fileInput").value = "";
  };

  const handlePreview = (id) => {
    setPreviewUrl(`http://localhost:8080/api/v1/tile-file/${id}/preview`);
  };

  return (
    <div className="app-container">
      
      {/* Left Container */}
      <div className="left-panel">
        <h1>TileFile Manager</h1>

        <button className={`btn ${showPreview ? "btn-primary" : "btn-delete"}`} onClick={() => setShowPreview(!showPreview)}>{showPreview ? `Preview will be shown` : `Preview will not be shown`}</button>
        
        <TileList 
          files={files} 
          selectedId={editingId}
          onSelect={handleSelect}
          onPreview={handlePreview}
          showPreview={showPreview}
        />

        {/* Form reacts to selection */}
        <TileForm 
          form={form} 
          setForm={setForm} 
          editingId={editingId} 
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onPreview={handlePreview}
        />
      </div>

      {/* Right Container */}
      <PreviewPanel previewUrl={previewUrl} />
      
    </div>
  );
};

export default App;