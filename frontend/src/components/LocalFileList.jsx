import "../App.css";

export default function LocalFileList({ 
  localFiles, 
  selectedLocalFiles, 
  onSelectLocal, 
  onImportSingle, 
  onImportBulk 
}) {
  
  const hasSelection = selectedLocalFiles && selectedLocalFiles.size > 0;

  // 1. Sort logic: Most recent (largest timestamp) first
  const sortedFiles = [...localFiles].sort((a, b) => {
    return (b.lastModified || 0) - (a.lastModified || 0);
  });

  // Helper to format the timestamp
  const formatDate = (ts) => {
    if (!ts) return "";
    // Creates a short date string like "10/24/2024, 2:30 PM"
    return new Date(ts).toLocaleString(undefined, {
      month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="table-container local-file-list">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
             <h2>💻 Local Scanner</h2>
             {hasSelection && (
                <span className="selection-badge">
                    {selectedLocalFiles.size} selected
                </span>
             )}
        </div>

        {hasSelection ? (
            <button className="btn-import-bulk" onClick={onImportBulk}>
                Import Selected ({selectedLocalFiles.size}) ⬇️
            </button>
        ) : (
            <span style={{ fontSize: "0.8rem", color: "#666" }}>(Read-only)</span>
        )}
      </div>

      <table className="tile-table">
        <thead>
          <tr>
            <th style={{width: '30px'}}></th>
            <th>File Name</th>
            <th style={{width: '140px'}}>Date Scanned</th>
            <th style={{ width: "100px", textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedFiles.map((file, index) => {
            // Note: file is an Object now
            const fileName = file.name;
            const isSelected = selectedLocalFiles.has(fileName);

            return (
              <tr 
                key={fileName} 
                className={`tile-row ${isSelected ? "selected-row" : ""}`}
                onClick={(e) => onSelectLocal(fileName, e)}
              >
                 <td>
                    <input 
                        type="checkbox" 
                        checked={isSelected}
                        readOnly
                        style={{pointerEvents: 'none'}}
                    />
                 </td>

                <td className="tile-name-cell">
                  📄 {fileName}
                </td>

                <td style={{ fontSize: '0.85rem', color: '#666' }}>
                   {formatDate(file.lastModified)}
                </td>
                
                <td style={{ textAlign: "center" }}>
                  <button 
                    className="btn-import"
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onImportSingle(fileName);
                    }}
                  >
                    Import
                  </button>
                </td>
              </tr>
            );
          })}
          
          {localFiles.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                No local files found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}