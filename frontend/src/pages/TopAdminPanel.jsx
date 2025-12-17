import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";

export default function TopAdminPanel() {
  const { user, token } = useAuth();
  const API = import.meta.env.VITE_API_URL || "";

  // Promote system
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [promoteMsg, setPromoteMsg] = useState(null);
  const [promoteError, setPromoteError] = useState(null);

  // Members
  const [members, setMembers] = useState([]);

  // Add member form
  const [form, setForm] = useState({
    name: "",
    role: "",
    phone: "",
    category: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
  });
  const [photo, setPhoto] = useState(null);

  // Edit Member
  const [editing, setEditing] = useState(null);
  const [editPhoto, setEditPhoto] = useState(null);

  // Top admin protection
  if (!user || user.role !== "top-admin") {
    return <div className="container card">Access denied</div>;
  }

  // Load members
  useEffect(() => {
    loadMembers();
  }, []);

  function loadMembers() {
    axios.get(API + "/api/members").then((res) => {
      setMembers(res.data.rows || []);
    });
  }

  // Promote User
  async function promote(e) {
    e.preventDefault();
    setPromoteMsg(null);
    setPromoteError(null);

    if (!email) return setPromoteError("Email required");

    try {
      await axios.post(
        API + "/api/admin/promote",
        { email, role },
        { headers: { Authorization: "Bearer " + token } }
      );
      setPromoteMsg(`Updated → ${email} → ${role}`);
      setEmail("");
      setRole("admin");
    } catch (err) {
      setPromoteError(err.response?.data?.error || err.message);
    }
  }

  // Add Member
  async function submitAdd(e) {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append("photo", photo);

    try {
      await axios.post(API + "/api/members/add", fd, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Member added");
      loadMembers();
      setForm({
        name: "",
        role: "",
        phone: "",
        category: "",
        facebook: "",
        instagram: "",
        whatsapp: "",
      });
      setPhoto(null);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  // Start editing
  function startEdit(m) {
    setEditing(m);
  }

  // Update Member
  async function updateMember(e) {
    e.preventDefault();
    const fd = new FormData();

    Object.entries(editing).forEach(([k, v]) => fd.append(k, v));
    if (editPhoto) fd.append("photo", editPhoto);

    try {
      await axios.post(API + "/api/members/edit", fd, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Updated");
      setEditing(null);
      loadMembers();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  // Delete Member
  function deleteMember(id) {
    if (!confirm("Delete this member?")) return;
    axios
      .post(
        API + "/api/members/delete",
        { id },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then(() => loadMembers());
  }

  return (
    <div className="container">
      <h2 style={{ color: "#3b2311" }}>Top Admin Panel</h2>

      {/* Promote Section */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Promote / Demote User</h3>
        {promoteMsg && <div className="info">{promoteMsg}</div>}
        {promoteError && <div className="error">{promoteError}</div>}

        <form onSubmit={promote}>
          <label className="muted">User Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
          />

          <label className="muted">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <button className="btn" style={{ marginTop: 12 }}>
            Update Role
          </button>
        </form>
      </div>

      <Link to="/all-users">
        <button
          className="btn"
          style={{ marginTop: 16, background: "#3b2311", color: "white" }}
        >
          View All Users
        </button>
      </Link>

      {/* Add Member */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Add Member</h3>

        <form onSubmit={submitAdd}>
          <label>Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>

          <label>Category</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <label>Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <label>Photo</label>
          <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />

          <label>Facebook</label>
          <input
            value={form.facebook}
            onChange={(e) => setForm({ ...form, facebook: e.target.value })}
          />

          <label>Instagram</label>
          <input
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          />

          <label>WhatsApp</label>
          <input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />

          <button className="btn" style={{ marginTop: 12 }}>
            Add Member
          </button>
        </form>
      </div>

      {/* Member List */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Members</h3>

        <table style={{ width: "100%", marginTop: 12 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Category</th>
              <th>Phone</th>
              <th>Social</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {members
              .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
              .map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.role}</td>
                  <td>{m.category}</td>
                  <td>{m.phone}</td>
                  <td>
                    {m.facebook && "📘"} {m.instagram && "📸"}{" "}
                    {m.whatsapp && "💬"}
                  </td>
                  <td>
                    <button className="mini-btn" onClick={() => startEdit(m)}>
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="mini-btn"
                      style={{ color: "red" }}
                      onClick={() => deleteMember(m.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Edit Member */}
      {editing && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3>Edit Member</h3>

          <form onSubmit={updateMember}>
            <label>Name</label>
            <input
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
            />

            <label>Role</label>
            <select
              value={editing.role}
              onChange={(e) =>
                setEditing({ ...editing, role: e.target.value })
              }
            >
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
            </select>

            <label>Category</label>
            <input
              value={editing.category}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value })
              }
            />

            <label>Phone</label>
            <input
              value={editing.phone}
              onChange={(e) =>
                setEditing({ ...editing, phone: e.target.value })
              }
            />

            <label>Replace Photo</label>
            <input type="file" onChange={(e) => setEditPhoto(e.target.files[0])} />

            <label>Facebook</label>
            <input
              value={editing.facebook || ""}
              onChange={(e) =>
                setEditing({ ...editing, facebook: e.target.value })
              }
            />

            <label>Instagram</label>
            <input
              value={editing.instagram || ""}
              onChange={(e) =>
                setEditing({ ...editing, instagram: e.target.value })
              }
            />

            <label>WhatsApp</label>
            <input
              value={editing.whatsapp || ""}
              onChange={(e) =>
                setEditing({ ...editing, whatsapp: e.target.value })
              }
            />

            <button className="btn" style={{ marginTop: 12 }}>
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
