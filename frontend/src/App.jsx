import { useEffect, useState } from "react";
import './App.css';
import { getFiles, saveFiles, deleteFiles, patchFiles, getLocalFiles, importLocalFile } from "./services/tileFileService";

import TileList from "./components/TileList";
import TileForm from "./components/TileForm";
import PreviewPanel from "./components/PreviewPanel";
import LocalFileList from "./components/LocalFileList";

const App = () => {
  const [selectedIds, setSelectedIds] = useState(new Set()); // Track multiple
  const [lastSelectedId, setLastSelectedId] = useState(null); // Track anchor for shift-click
  const [files, setFiles] = useState([]);
  const [localFiles, setLocalFiles] = useState([]);
  const [selectedLocalFiles, setSelectedLocalFiles] = useState(new Set());
  const [lastSelectedLocalFile, setLastSelectedLocalFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({ name: "", file: null, gDriveLink: "" });

  // Helper to check if Preview should be enabled (Only 1 item selected)
  const isPreviewEnabled = selectedIds.size === 1;

  // DERIVED STATE: editingId exists ONLY if exactly 1 item is selected
  const editingId = selectedIds.size === 1 ? [...selectedIds][0] : null;


  useEffect(() => {
    refreshFiles();
    refreshLocalFiles();

    // Define the polling function
    const pollLocalFiles = () => {
      refreshLocalFiles();
    };

    // Set up interval to run every 5 seconds (5000 ms)
    const intervalId = setInterval(pollLocalFiles, 5000);

    // CLEANUP: vital to stop the timer when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty array = Run once on mount


  // subsequent refreshes, only update preview url
  useEffect(() => {
    if (showPreview && editingId) {
      // Re-use your existing preview logic
      setPreviewUrl(`http://localhost:8080/api/v1/tile-file/${editingId}/preview`);
    } 
    // If Preview is OFF or No File Selected -> Clear it
    else {
      setPreviewUrl(null);
    }
  }, [showPreview, editingId]);

  // Sync Form with Selection
  useEffect(() => {
    if (editingId) {
      // Find the file object to populate the form
      const file = files.find(f => f.id === editingId);
      if (file) {
        setForm({ name: file.name, file: null, gDriveLink: file.gDriveLink || "" });
      }
    } else {
      // If 0 items OR >1 items selected, clear form inputs
      setForm({ name: "", file: null, gDriveLink: "" });
      if(document.getElementById("fileInput")) document.getElementById("fileInput").value = "";
    }
  }, [editingId, files]);

  const refreshFiles = () => {
    getFiles().then(setFiles).catch(console.error);
  };

  const refreshLocalFiles = () => {
    getLocalFiles().then(setLocalFiles).catch(console.error);
  };

  // 3. Handle the Import Button Click
  const handleImport = (fileName) => {
    // Optimistic UI: You could show a loading spinner here
    importLocalFile(fileName)
      .then(() => {
        // Success!
        refreshFiles(); // Refresh the Main DB list to show the new file
        // alert(`Successfully imported ${fileName}`);
      })
      .catch((err) => {
        alert("Failed to import file. Check console.");
        console.error(err);
      });
  };

  const handleBulkImport = async () => {
    if (selectedLocalFiles.size === 0) return;

    const filesToImport = Array.from(selectedLocalFiles);
    
    // Optional: Show loading state here
    
    // Run all imports in parallel
    try {
        await Promise.all(filesToImport.map(name => importLocalFile(name)));
        
        // alert(`Successfully imported ${filesToImport.length} files!`);
        refreshFiles(); // Refresh DB list
        setSelectedLocalFiles(new Set()); // Clear selection
    } catch (err) {
        console.error("Bulk import failed", err);
        alert("Some files failed to import.");
    }
  };

  const handleSelect = (file, e) => {
    let newSet = new Set(selectedIds);
    // 1. Handle Shift + Click (Range Selection)
    if (e.shiftKey && lastSelectedId !== null) {
        const start = files.findIndex(f => f.id === lastSelectedId);
        const end = files.findIndex(f => f.id === file.id);

        // Get the range of files between start and end
        const min = Math.min(start, end);
        const max = Math.max(start, end);
        const range = files.slice(min, max + 1).map(f => f.id);

        // Add range to existing selection
        setSelectedIds(prev => new Set([...prev, ...range]));
    } 
    // 2. Handle Ctrl/Cmd + Click (Toggle Selection)
    else if (e.ctrlKey || e.metaKey) {
        const newSet = new Set(selectedIds);
        if (newSet.has(file.id)) {
            newSet.delete(file.id);
        } else {
            newSet.add(file.id);
        }
        setSelectedIds(newSet);
        setLastSelectedId(file.id);
    } 
    // 3. Simple Click (Select Only One)
    else {
        // If I click the file that is ALREADY the only one selected, deselect it.
        if (selectedIds.has(file.id) && selectedIds.size === 1) {
          newSet.clear(); 
          setLastSelectedId(null);
        } else {
          // Otherwise, make this the only selected file
          newSet = new Set([file.id]);
          setLastSelectedId(file.id);
        }

        setSelectedIds(newSet);
    }
};

  const handleSelectLocal = (fileName, e) => {
    let newSet = new Set(selectedLocalFiles);
      
    // A. Shift + Click (Range Selection)
    if (e.shiftKey && lastSelectedLocalFile !== null) {
        // FIX: Use findIndex because localFiles is an array of OBJECTS now
        const start = localFiles.findIndex(f => f.name === lastSelectedLocalFile);
        const end = localFiles.findIndex(f => f.name === fileName);

        const min = Math.min(start, end);
        const max = Math.max(start, end);
        
        // Map the range of OBJECTS back to just their NAMES for the Set
        const range = localFiles.slice(min, max + 1).map(f => f.name);
        range.forEach(name => newSet.add(name));
    } 
    // B. Ctrl/Cmd + Click
    else if (e.ctrlKey || e.metaKey) {
        if (newSet.has(fileName)) newSet.delete(fileName);
        else newSet.add(fileName);
        setLastSelectedLocalFile(fileName);
    } 
    // C. Simple Click
    else {
        if (newSet.has(fileName) && newSet.size === 1) {
            newSet.clear();
            setLastSelectedLocalFile(null);
        } else {
            newSet = new Set([fileName]);
            setLastSelectedLocalFile(fileName);
        }
    }
    setSelectedLocalFiles(newSet);
  };

  const handleCancel = () => {
    setSelectedIds(new Set());
    setLastSelectedId(null);
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

    // either update or post data
    const action = editingId ? patchFiles(editingId, formData) : saveFiles(formData);

    action.then(() => {
        refreshFiles();
        handleCancel();
    }).catch(console.error);
  };

  const handleDelete = (id) => {
    deleteFiles(id).then(refreshFiles).catch(console.error);
    handleCancel();
  };

  const handlePreview = (id) => {
    setPreviewUrl(`http://localhost:8080/api/v1/tile-file/${id}/preview`);
  };

  return (
    <div className="app-container">
      
      {/* Left Container */}
      <div className="left-panel">
        <h1>TileFile Manager</h1>

        <button className={`btn ${showPreview ? "btn-primary" : "btn-delete"}`} onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? `Preview will be shown` : `Preview will not be shown`}
        </button>
        
        <TileList 
          files={files} 
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onPreview={handlePreview}
          showPreview={showPreview}
        />

      <LocalFileList
        localFiles={localFiles}
        selectedLocalFiles={selectedLocalFiles}
        onSelectLocal={handleSelectLocal}
        onImportSingle={handleImport}
        onImportBulk={handleBulkImport}
      />


        {/* Form reacts to selection */}
        <TileForm 
          form={form} 
          setForm={setForm} 
          editingId={editingId} 
          selectedIds={selectedIds}
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