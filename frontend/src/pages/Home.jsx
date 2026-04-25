import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get("/all")
      .then(res => setReports(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Reports</h1>

      {reports.length === 0 ? (
        <p>No data</p>
      ) : (
        reports.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))
      )}
    </div>
  );
}