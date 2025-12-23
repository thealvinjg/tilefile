import { useRef } from "react";
import "../App.css";

export default function TileForm({ 
  form, 
  setForm, 
  editingId,
  selectedIds,
  onCancel, 
  onSubmit, 
  onDelete, 
  onPreview 
}) {

  const fileInputRef = useRef(null);
  
  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  const onRemoveFile = () => {
    // Clear the form state
    setForm({ ...form, file: null });
    
    // Clear the actual DOM input value
    // (Crucial: allows selecting the same file again if needed)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="tile-form-container">
      {/* Header changes based on selection */}
      <div className="form-header">
        <h2>
            {selectedIds.size > 1 ? `${selectedIds.size} files selected` : 
             editingId ? form.name : "Upload New File"}
        </h2>
      </div>

      <form onSubmit={onSubmit} className="tile-form">
        
        {/* Inputs */}
        <div className="form-group">
          <label>File Name</label>
          <input
            className="form-input"
            disabled={selectedIds.size > 1} 
            placeholder={selectedIds.size > 1 ? "(Cannot edit multiple names)" : "Enter name..."}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>File (PDF)</label>
          
          {/* Conditional Rendering: Show Input OR File Badge */}
          {!form.file ? (
            <input
              ref={fileInputRef} // Attach Ref here
              className="form-input"
              id="fileInput"
              type="file"
              accept=".pdf"
              disabled={selectedIds.size > 0}
              onChange={onFileChange}
            />
          ) : (
            // Custom "Badge" when file is selected
            <div className="selected-file-badge">
              <span className="file-name-text">
                📄 {form.file.name}
              </span>
              <button 
                type="button" 
                className="btn-remove-file"
                onClick={onRemoveFile}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Google Drive link (optional) </label>
          <input
            className="form-input"
            placeholder="Enter Google Drive link..."
            value={form.gDriveLink}
            disabled={selectedIds.size > 1}
            onChange={(e) => setForm({ ...form, gDriveLink: e.target.value })}
          />
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          {/* Main Action (Update vs Upload) */}
          <button type="submit" className="btn btn-primary full-width" disabled={selectedIds.size > 1}>
            {editingId ? "Save Changes" : "Upload File"}
          </button>

          {/* Extra Options (Only show when selected) */}
          {selectedIds.size > 0 && (
            <div className="selected-options">
              <div className="option-row">
                <button 
                  type="button" 
                  className="btn btn-preview full-width"
                  // 1. THE GRAY OUT LOGIC
                  disabled={selectedIds.size !== 1} 
                  title={selectedIds.size !== 1 ? "Select exactly one file to preview" : ""}
                  onClick={() => onPreview(editingId)}
                >
                  Preview PDF
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-delete full-width"
                  // Disable delete for multi-select (unless you implement bulk delete)
                  disabled={selectedIds.size !== 1}
                  onClick={() => onDelete(editingId)}
                >
                   ✕ Delete {selectedIds.size > 1 ? "All" : "File"}
                </button>
              </div>

              <button 
                type="button" 
                className="btn btn-cancel full-width"
                onClick={onCancel}
              >
                Cancel Selection
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}