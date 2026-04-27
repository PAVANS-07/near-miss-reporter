import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  // 🔹 Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 5; // records per page

  // 🔹 Fetch
  const fetchReports = () => {
    api.get(`/page?page=${page}&size=${size}`)
      .then(res => {
        setReports(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  // 🔹 Add / Update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description) return;

    if (editId) {
      api.put(`/update/${editId}`, { title, description, status })
        .then(() => {
          resetForm();
          fetchReports();
        });
    } else {
      api.post("/add", { title, description, status })
        .then(() => {
          resetForm();
          fetchReports();
        });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("OPEN");
    setEditId(null);
  };

  // 🔹 Delete
  const handleDelete = (id) => {
    api.delete(`/delete/${id}`)
      .then(() => fetchReports());
  };

  // 🔹 Edit
  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setStatus(item.status);
    setEditId(item.id);
  };

  // 🔹 Filter + Search
  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || item.status === filter;

    return matchesSearch && matchesFilter;
  });

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

        <select
          className="w-full p-2 border rounded mb-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="OPEN">OPEN</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <button className="w-full bg-green-500 text-white py-2 rounded">
          {editId ? "Update Report" : "Add Report"}
        </button>
      </form>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border rounded mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER */}
      <select
        className="w-full p-2 border rounded mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="ALL">All</option>
        <option value="OPEN">Open</option>
        <option value="CLOSED">Closed</option>
      </select>

      {/* TABLE */}
      <table className="w-full border shadow">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-2">S.No</th>   {/* ⭐ SERIAL */}
            <th className="p-2">Title</th>
            <th className="p-2">Description</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredReports.map((item, index) => (
            <tr key={item.id} className="text-center border-t">

              {/* ⭐ SERIAL NUMBER FIX */}
              <td className="p-2">
                {(page * size) + index + 1}
              </td>

              <td className="p-2">{item.title}</td>
              <td className="p-2">{item.description}</td>
              <td className="p-2">{item.status}</td>

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

      {/* PAGINATION */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          className="px-3 py-1 bg-gray-300 mr-2"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page + 1 >= totalPages}
          className="px-3 py-1 bg-gray-300 ml-2"
        >
          Next
        </button>
      </div>

    </div>
  );
}