// src/pages/UsersList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

export default function UsersList() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [err, setErr] = useState("");

  const API = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    if (!user || user.role !== "top-admin") {
      setErr("Access denied. Only Top Admin can view this page.");
      return;
    }
    loadUsers();
  }, [user]);

  async function loadUsers() {
    try {
      const res = await axios.get(API + "/api/admin/all-users", {
        headers: { Authorization: "Bearer " + token },
      });
      setUsers(res.data.users || []);
    } catch {
      setErr("Failed to load users.");
    }
  }

  async function verifyUser(id) {
    try {
      await axios.post(
        API + "/api/admin/verify-user",
        { id }, // ✅ FIXED
        { headers: { Authorization: "Bearer " + token } }
      );
      loadUsers();
    } catch {
      alert("Verification failed");
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (err)
    return (
      <div className="container">
        <div className="error">{err}</div>
      </div>
    );

  return (
    <div className="container">
      <h2 style={{ color: "#3b2311" }}>All Registered Users</h2>

      <input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 10, marginBottom: 20, width: 300 }}
      />

      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.emailVerified ? "✔" : "❌"}</td>
              <td>
                {!u.emailVerified && (
                  <button onClick={() => verifyUser(u._id)}>
                    Verify
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p style={{ marginTop: 20, opacity: 0.6 }}>No users found.</p>
      )}
    </div>
  );
}
