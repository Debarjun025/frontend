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

  async function verifyEmail(id) {
    try {
      await axios.post(
        API + "/api/admin/verify-user",
        { id },
        { headers: { Authorization: "Bearer " + token } }
      );
      loadUsers();
    } catch {
      alert("Email verification failed");
    }
  }

  async function verifyPhone(id) {
    try {
      await axios.post(
        API + "/api/admin/verify-phone",
        { id },
        { headers: { Authorization: "Bearer " + token } }
      );
      loadUsers();
    } catch {
      alert("Phone verification failed");
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (err) {
    return (
      <div className="container">
        <div className="error">{err}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 style={{ color: "#3b2311", marginBottom: 20 }}>
        All Registered Users (Top Admin)
      </h2>

      <input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 10,
          width: "100%",
          maxWidth: 400,
          marginBottom: 20,
        }}
      />

      <div className="card" style={{ overflowX: "auto" }}>
        <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#d1a05f", color: "#fff" }}>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Email Verified</th>
              <th>Phone</th>
              <th>Phone Verified</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => {
              const isSelf = u._id === user.id;

              return (
                <tr key={u._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.emailVerified ? "✔" : "❌"}</td>
                  <td>
                    {u.phone
                      ? `${u.countryCode || ""} ${u.phone}`
                      : "-"}
                  </td>
                  <td>{u.phoneVerified ? "✔" : "❌"}</td>

                  <td style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {isSelf ? (
                      <span style={{ opacity: 0.6 }}>No action available</span>
                    ) : (
                      <>
                        {!u.emailVerified && (
                          <button
                            className="mini-btn"
                            onClick={() => verifyEmail(u._id)}
                          >
                            Verify Email
                          </button>
                        )}

                        {!u.phoneVerified && u.phone && (
                          <button
                            className="mini-btn"
                            onClick={() => verifyPhone(u._id)}
                          >
                            Verify Phone
                          </button>
                        )}

                        {u.emailVerified && (!u.phone || u.phoneVerified) && (
                          <span style={{ opacity: 0.6 }}>
                            No action available
                          </span>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p style={{ marginTop: 20, opacity: 0.6, textAlign: "center" }}>
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}
