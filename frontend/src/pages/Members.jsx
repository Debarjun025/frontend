import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const API = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    axios
      .get(API + "/api/members")
      .then((r) => setMembers(r.data.rows || []))
      .catch(() => {});
  }, []);

  // derive categories
  const categories = useMemo(() => {
    const setCat = new Set();
    members.forEach((m) => setCat.add(m.category || "Others"));
    return Array.from(setCat).sort();
  }, [members]);

  // group by category -> role -> name
  const grouped = useMemo(() => {
    const g = {};

    members.forEach((m) => {
      const cat = m.category || "Others";
      if (!g[cat]) g[cat] = {};

      const role = m.role || "Member";
      if (!g[cat][role]) g[cat][role] = [];

      g[cat][role].push(m);
    });

    // sort names inside each role
    Object.keys(g).forEach((cat) => {
      Object.keys(g[cat]).forEach((role) =>
        g[cat][role].sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        )
      );
    });

    /* 🔥 NEW → Rank roles: Admin first, then Member */
    const roleOrder = ["Admin", "Member"];

    Object.keys(g).forEach((cat) => {
      const orderedRoles = Object.keys(g[cat]).sort(
        (a, b) => roleOrder.indexOf(a) - roleOrder.indexOf(b)
      );

      const sortedGroup = {};
      orderedRoles.forEach((r) => {
        sortedGroup[r] = g[cat][r];
      });

      g[cat] = sortedGroup;
    });

    return g;
  }, [members]);

  const fallback =
    "https://ui-avatars.com/api/?name=BBC+Member&background=d1a05f&color=3b2311&size=256";

  const displayCats = categories.filter(
    (c) => !filterCategory || c === filterCategory
  );

  return (
    <div className="container">
      <h2 style={{ color: "#3b2311" }}>Members</h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 14,
          alignItems: "center",
        }}
      >
        <input
          placeholder="Search by name or role"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {displayCats.length === 0 && (
        <div className="card muted">No members added yet.</div>
      )}

      {displayCats.map((cat) => (
        <div key={cat} style={{ marginBottom: 30 }}>
          <h3 style={{ color: "#3b2311", marginBottom: 10 }}>{cat}</h3>

          {Object.keys(grouped[cat] || {}).map((role) => {
            const filteredList = grouped[cat][role].filter((m) => {
              if (!query) return true;
              const q = query.toLowerCase();
              return (
                (m.name || "").toLowerCase().includes(q) ||
                (m.role || "").toLowerCase().includes(q)
              );
            });

            if (filteredList.length === 0) return null;

            return (
              <div key={role} style={{ marginBottom: 16 }}>
                <h4 style={{ marginBottom: 8, fontSize: 17 }}>{role}</h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                  }}
                >
                  {filteredList.map((m) => (
                    <div
                      key={m.id}
                      className="card"
                      style={{ textAlign: "center", padding: 20 }}
                    >
                      <img
                        src={
                          m.image
                            ? m.image.startsWith("/")
                              ? API + m.image
                              : m.image
                            : fallback
                        }
                        alt="member"
                        style={{
                          width: 86,
                          height: 86,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #d1a05f",
                          marginBottom: 10,
                        }}
                      />

                      <h4
                        style={{
                          margin: 0,
                          marginBottom: 3,
                          fontSize: 18,
                          color: "#3b2311",
                        }}
                      >
                        {m.name}
                      </h4>

                      <div className="muted" style={{ fontWeight: 600 }}>
                        {m.role}
                      </div>

                      {m.phone && (
                        <div style={{ marginTop: 6 }}>📞 {m.phone}</div>
                      )}

                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          justifyContent: "center",
                          gap: 14,
                          fontSize: 24,
                        }}
                      >
                        {m.facebook && (
                          <a
                            href={m.facebook}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#1877F2" }}
                          >
                            <FaFacebook />
                          </a>
                        )}

                        {m.instagram && (
                          <a
                            href={m.instagram}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#E1306C" }}
                          >
                            <FaInstagram />
                          </a>
                        )}

                        {m.whatsapp && (
                          <a
                            href={`https://wa.me/${m.whatsapp.replace(
                              /\D/g,
                              ""
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#25D366" }}
                          >
                            <FaWhatsapp />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
