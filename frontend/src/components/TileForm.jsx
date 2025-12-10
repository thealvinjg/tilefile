import "../App.css";

export default function TileForm({ 
  form, 
  setForm, 
  editingId, 
  onCancel, 
  onSubmit, 
  onDelete, 
  onPreview 
}) {
  
  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  return (
    <div className="tile-form-container">
      {/* Header changes based on selection */}
      <div className="form-header">
        <h2>{editingId ? `${form.name}` : "Upload New File"}</h2>
      </div>

      <form onSubmit={onSubmit} className="tile-form">
        
        {/* Inputs */}
        <div className="form-group">
          <label>File Name</label>
          <input
            className="form-input"
            placeholder="Enter name..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>File (PDF)</label>
          <input
            className="form-input"
            id="fileInput"
            type="file"
            accept=".pdf"
            onChange={onFileChange}
          />
        </div>

        <div className="form-group">
          <label>Google Drive link (optional) </label>
          <input
            className="form-input"
            placeholder="Enter Google Drive link..."
            value={form.gDriveLink}
            onChange={(e) => setForm({ ...form, gDriveLink: e.target.value })}
          />
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          {/* Main Action (Update vs Upload) */}
          <button type="submit" className="btn btn-primary full-width">
            {editingId ? "Save Changes" : "Upload File"}
          </button>

          {/* Extra Options (Only show when selected) */}
          {editingId && (
            <div className="selected-options">
              <div className="option-row">
                <button 
                  type="button" 
                  className="btn btn-preview full-width"
                  onClick={() => onPreview(editingId)}
                >
                  Preview PDF
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-delete full-width"
                  onClick={() => onDelete(editingId)}
                >
                   ✕ Delete File
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