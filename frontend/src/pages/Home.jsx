import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const fetchReports = () => {
    api.get("/all")
      .then(res => setReports(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description) return;

    if (editId) {
      api.put(`/update/${editId}`, { title, description })
        .then(() => {
          setEditId(null);
          setTitle("");
          setDescription("");
          fetchReports();
        });
    } else {
      api.post("/add", { title, description })
        .then(() => {
          setTitle("");
          setDescription("");
          fetchReports();
        });
    }
  };

  const handleDelete = (id) => {
    api.delete(`/delete/${id}`)
      .then(() => fetchReports());
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditId(item.id);
  };

  const filteredReports = reports.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-5">

      <h1 className="text-3xl font-bold text-center mb-6">
        📊 Report Manager
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          className="w-full p-2 border rounded mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="w-full bg-green-500 text-white py-2 rounded">
          {editId ? "Update Report" : "Add Report"}
        </button>
      </form>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="w-full border shadow">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredReports.map((item) => (
            <tr key={item.id} className="text-center border-t">
              <td className="p-2">{item.id}</td>
              <td className="p-2">{item.title}</td>
              <td className="p-2">{item.description}</td>

              <td className="p-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}