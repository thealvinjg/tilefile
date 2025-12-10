import "../App.css";

export default function TileList({ files, selectedId, onSelect, onPreview, showPreview }) {
  return (
    <div className="table-container">
      <table className="tile-table">
        <thead>
          <tr>
            <th style={{ width: "40px" }}></th>
            <th>Name</th>
            <th>Uploaded</th>
            <th>Drive Link</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const isSelected = file.id === selectedId;

            return (
              <tr 
                key={file.id} 
                className={`tile-row ${isSelected ? "selected-row" : ""}`}
                onClick={() => {onSelect(file); if (showPreview) onPreview(file.id);}} // Clicking row selects it
              >
                {/* Checkbox: Controlled by selectedId */}
                <td>
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => onSelect(file)}
                    style={{ cursor: "pointer" }}
                  />
                </td>

                <td className="tile-name-cell">
                  {file.name}
                </td>

                <td className="text-muted">Oct 24, 2024</td>

                <td>
                {file.gDriveLink ? (
                    /* IF link exists: Show a clickable link */
                    <a 
                      href={file.gDriveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: "#007bff", textDecoration: "none", fontWeight: "500" }}
                    >
                      Open in Drive ↗
                    </a>
                  ) : (
                    /* ELSE (No link): Show Pending badge */
                    <span className="drive-badge pending">Pending</span>
                  )}
                </td>
              </tr>
            );
          })}
          
          {files.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                No files found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}