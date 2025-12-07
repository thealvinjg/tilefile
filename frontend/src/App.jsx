import { useEffect, useState } from "react";
import './App.css';

import { getEngineers, saveEngineer, deleteEngineer, patchEngineer } from "./services/softwareEngineerService";

function App() {
  const [editingId, setEditingId] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    techStack: ""
  });

  // Load on mount
  useEffect(() => {
    refreshEngineers();
  }, []);

  const refreshEngineers = () => {
    getEngineers()
      .then(setEngineers)
      .catch(console.error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.techStack) return alert("All fields required!");
  
    const payload = { name: form.name, techStack: form.techStack };
  
    const action = editingId
      ? patchEngineer(editingId, payload)   // UPDATE
      : saveEngineer(payload);              // CREATE
  
    action
      .then(() => {
        refreshEngineers();
        setForm({ name: "", techStack: "" });
        setEditingId(null);
      })
      .catch(console.error);
  };

  const handleDelete = (id, name, techStack) => {
    deleteEngineer(id, { name, techStack })
      .then(refreshEngineers)
      .catch(console.error);
  };

  const handleEdit = (engineer) => {
    setForm({
      name: engineer.name,
      techStack: engineer.techStack
    });
    setEditingId(engineer.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Software Engineers</h1>

      {/* LIST */}
      <ul>
        {engineers.map((eng) => (
          <li key={eng.id}>
            {eng.name} — {eng.techStack}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleEdit(eng)}
            >
              Edit
            </button>

            <button
              style={{ marginLeft: "10px", color: "white", background: "red" }}
              onClick={() => handleDelete(eng.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <hr />

      {/* FORM */}
      <h2>Add Engineer</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Tech Stack"
          value={form.techStack}
          onChange={(e) => setForm({ ...form, techStack: e.target.value })}
        />

        <button type="submit">
          {editingId ? "Update Engineer" : "Save Engineer"}
        </button>
      </form>
    </div>
  );
}

export default App;
