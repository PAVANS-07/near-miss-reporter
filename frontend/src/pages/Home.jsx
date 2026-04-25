import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchReports = () => {
    api.get("/all")
      .then(res => setReports(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    api.post("/add", { title, description })
      .then(() => {
        setTitle("");
        setDescription("");
        fetchReports(); // refresh table
      })
      .catch(err => console.log(err));
  };

 
  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reports</h1>

      {/* 🔹 FORM */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <button type="submit">Add Report</button>
      </form>

      <hr />

      {/* 🔹 TABLE */}
      {reports.length === 0 ? (
        <p>No data</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}