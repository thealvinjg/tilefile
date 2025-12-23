import "../App.css";

export default function TileList({ files, selectedIds, onSelect }) {
  return (
    <div className="table-container">
      <h2>Files uploaded to database</h2>
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
            // Check if this specific ID is in the Set
            const isSelected = selectedIds.has(file.id);

            return (
              <tr 
                key={file.id} 
                className={`tile-row ${isSelected ? "selected-row" : ""}`}
                // Pass 'e' (event) to the handler
                onClick={(e) => onSelect(file, e)} 
              >
                <td>
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    readOnly // React handles the click on the row/tr
                    style={{ pointerEvents: "none" }} // Let the row click handle it
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