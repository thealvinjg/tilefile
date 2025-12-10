import "../App.css";

export default function PreviewPanel({ previewUrl }) {
  return (
    <div className="right-panel">
      <h2 style={{ marginTop: 0 }}>File Preview</h2>

      {previewUrl ? (
        <iframe
          className="preview-iframe"
          src={previewUrl}
          title="File Preview"
        />
      ) : (
        <div className="preview-placeholder">
          Click "Preview" on a file to view it here.
        </div>
      )}
    </div>
  );
}