import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

/**
 * AdminPanel
 * - Fetches /api/admin/donations
 * - Add donation (POST /api/admin/add-donation)
 * - Delete donation (POST /api/admin/delete-donation)
 *
 * Place in src/pages/AdminPanel.jsx (or pages folder).
 */

export default function AdminPanel() {
  const { user, token } = useAuth();
  const API = import.meta.env.VITE_API_URL || "";

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Add-donation modal state
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    amount: "",
    donor_names: "",
    category: "General",
    payment_mode: "Online",
    upi_id: "",
  });
  const [addFile, setAddFile] = useState(null);

  useEffect(() => {
    if (!token) return;
    loadDonations();
    // eslint-disable-next-line
  }, [token]);

  async function loadDonations() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API + "/api/admin/donations", {
        headers: { Authorization: "Bearer " + token },
      });
      // server returns { donations: rows }
      setDonations(res.data.donations || []);
    } catch (err) {
      console.error("Admin fetch error:", err?.response?.data || err);
      setError(err.response?.data?.error || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this donation record? This action cannot be undone.")) return;
    setBusy(true);
    setError(null);
    try {
      await axios.post(
        API + "/api/admin/delete-donation",
        { id },
        { headers: { Authorization: "Bearer " + token } }
      );
      setSuccess("Record deleted");
      await loadDonations();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Delete failed");
    } finally {
      setBusy(false);
      setTimeout(() => setSuccess(null), 2500);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("amount", addForm.amount || 0);
      fd.append("donor_names", addForm.donor_names || "Unknown");
      fd.append("category", addForm.category || "General");
      fd.append("payment_mode", addForm.payment_mode || "Online");
      fd.append("upi_id", addForm.upi_id || "");
      if (addFile) fd.append("screenshot", addFile);

      const res = await axios.post(API + "/api/admin/add-donation", fd, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Donation added");
      setShowAdd(false);
      setAddForm({ amount: "", donor_names: "", category: "General", payment_mode: "Online", upi_id: "" });
      setAddFile(null);
      await loadDonations();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Add donation failed");
    } finally {
      setBusy(false);
      setTimeout(() => setSuccess(null), 2500);
    }
  }

  // Access control
  if (!user || (user.role !== "admin" && user.role !== "top-admin")) {
    return <div className="container card">Access denied</div>;
  }

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={{ color: "#3b2311", fontWeight: 800, margin: 0 }}>Admin Dashboard</h2>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => setShowAdd(true)} disabled={busy}>
            + Add Donation
          </button>
          <button className="mini-btn" onClick={loadDonations} disabled={loading || busy}>
            Refresh
          </button>
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "stretch" }}>
        <div className="stat-box" style={{ flex: 1 }}>
          <div className="muted">Total donations</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{donations.length}</div>
        </div>

        <div className="stat-box" style={{ width: 200 }}>
          <div className="muted">Your role</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#3b2311" }}>{user.role}</div>
        </div>
      </div>

      {error && <div className="error" style={{ marginTop: 14 }}>{error}</div>}
      {success && <div className="info" style={{ marginTop: 14 }}>{success}</div>}

      <div className="modern-card" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Donation Records</h3>

        {loading ? (
          <div className="muted">Loading...</div>
        ) : donations.length === 0 ? (
          <div className="muted">No donation entries available.</div>
        ) : (
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Donor</th>
                  <th>Mode</th>
                  <th>Category</th>
                  <th>Screenshot</th>
                  <th>Date</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td style={{ fontWeight: 700 }}>₹{d.amount ?? 0}</td>
                    <td>{d.donor_names}</td>
                    <td>{d.payment_mode || "—"}</td>
                    <td>{d.category || "General"}</td>
                    <td>
                      {d.screenshot_path ? (
                        <a href={API + d.screenshot_path} target="_blank" rel="noreferrer" className="view-btn">
                          View
                        </a>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td>{d.created_at ? new Date(d.created_at * 1000).toLocaleString() : "—"}</td>
                    <td style={{ textAlign: "center" }}>
                      <button className="delete-btn" onClick={() => handleDelete(d.id)} disabled={busy}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add donation modal */}
      {showAdd && (
        <div className="modal-backdrop" onClick={() => !busy && setShowAdd(false)}>
          <div className="modal-card" onClick={(ev) => ev.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Add Donation</h3>

            <form onSubmit={handleAdd}>
              <label className="muted">Amount</label>
              <input
                type="number"
                value={addForm.amount}
                onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
                required
              />

              <label className="muted">Donor Name</label>
              <input
                value={addForm.donor_names}
                onChange={(e) => setAddForm({ ...addForm, donor_names: e.target.value })}
                placeholder="e.g. Mr. X"
              />

              <label className="muted">Payment Mode</label>
              <select value={addForm.payment_mode} onChange={(e) => setAddForm({ ...addForm, payment_mode: e.target.value })}>
                <option>Online</option>
                <option>Cash</option>
                <option>UPI</option>
                <option>Other</option>
              </select>

              <label className="muted">Category</label>
              <input value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })} />

              <label className="muted">UPI ID (optional)</label>
              <input value={addForm.upi_id} onChange={(e) => setAddForm({ ...addForm, upi_id: e.target.value })} />

              <label className="muted">Screenshot (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setAddFile(e.target.files[0] || null)} />

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn" type="submit" disabled={busy}>
                  {busy ? "Saving..." : "Save Donation"}
                </button>
                <button className="mini-btn" type="button" onClick={() => !busy && setShowAdd(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
