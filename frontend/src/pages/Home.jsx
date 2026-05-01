import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { FaHome, FaPlus, FaSignOutAlt } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [dark, setDark] = useState(false);

  const user = localStorage.getItem("user");
  const size = 5;

  // 🔹 Load dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dark");
    if (saved === "true") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  // 🔹 Toggle dark mode (global)
  const toggleDark = () => {
    const isDark = !dark;
    setDark(isDark);
    localStorage.setItem("dark", isDark);
    document.documentElement.classList.toggle("dark", isDark);
  };

  // 🔹 Fetch reports
  const fetchReports = () => {
    setLoading(true);
    api
      .get(`/api/page?page=${page}&size=${size}`)
      .then((res) => {
        setReports(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => toast.error("Failed to load data"))
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
      api
        .put(`/api/update/${editId}`, { title, description, status })
        .then(() => {
          toast.success("Report updated");
          resetForm();
          fetchReports();
        });
    } else {
      api.post("/api/add", { title, description, status }).then(() => {
        toast.success("Report added");
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
    api.delete(`/api/delete/${id}`).then(() => {
      toast.success("Report deleted");
      fetchReports();
    });
  };

  // 🔹 Edit
  const handleEdit = (r) => {
    setTitle(r.title);
    setDescription(r.description);
    setStatus(r.status);
    setEditId(r.id);
  };

  // 🔹 Filter (client-side)
  const filteredReports = reports.filter(
    (r) =>
      (filter === "ALL" || r.status === filter) &&
      (search.trim() === "" ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()))
  );

  // 🔹 Chart data (with colors)
  const chartData = [
    {
      name: "OPEN",
      value: reports.filter((r) => r.status === "OPEN").length,
      fill: "#22c55e",
    },
    {
      name: "CLOSED",
      value: reports.filter((r) => r.status === "CLOSED").length,
      fill: "#ef4444",
    },
  ];

  // 🔹 Loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* 🔷 Sidebar */}
      <aside className="w-60 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <div className="flex items-center gap-2 mb-4 cursor-pointer">
          <FaHome /> Home
        </div>

        <div className="flex items-center gap-2 mb-4 cursor-pointer">
          <FaPlus /> Add Report
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="flex items-center gap-2 mt-10 bg-red-500 px-3 py-2 rounded hover:bg-red-600"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* 🔷 Main Content */}
      <main className="flex-1 p-6">
        {/* 🔷 Profile + Dark Toggle */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 flex justify-between items-center">
          <div>
            <h2 className="font-semibold">👤 Welcome, {user}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Manage your reports efficiently
            </p>
          </div>

          <button
            onClick={toggleDark}
            className="bg-gray-700 text-white px-3 py-1 rounded"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* 🔷 Analytics */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
          <h2 className="mb-3 font-semibold">📊 Analytics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke={dark ? "#fff" : "#000"} />
              <YAxis stroke={dark ? "#fff" : "#000"} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🔷 Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6"
        >
          <h3 className="font-semibold mb-3">
            {editId ? "Update Report" : "Add Report"}
          </h3>

          <input
            placeholder="Title"
            className="w-full border p-2 mb-2 rounded dark:bg-gray-700 dark:text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Description"
            className="w-full border p-2 mb-2 rounded dark:bg-gray-700 dark:text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="w-full border p-2 mb-3 rounded dark:bg-gray-700 dark:text-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="OPEN">OPEN</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            {editId ? "Update" : "Add"}
          </button>
        </form>

        {/* 🔷 Search + Filter */}
        <div className="flex gap-4 mb-4">
          <input
            placeholder="Search..."
            className="flex-1 border p-2 rounded dark:bg-gray-700 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* 🔷 Table */}
        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
          <table className="w-full text-center">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-2">S.No</th>
                <th className="p-2">Title</th>
                <th className="p-2">Description</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((r, i) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2">{page * size + i + 1}</td>
                  <td>{r.title}</td>
                  <td>{r.description}</td>
                  <td>{r.status}</td>

                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(r)}
                      className="bg-blue-500 text-white px-2 py-1 mr-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(r.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔷 Pagination */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-2">
            Page {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page + 1 >= totalPages}
            className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}