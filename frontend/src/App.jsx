import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Chanda from "./pages/Chanda";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Profile from "./pages/Profile";
import UsersList from "./pages/UsersList";
import Members from "./pages/Members";
import AdminPanel from "./pages/AdminPanel";
import TopAdminPanel from "./pages/TopAdminPanel";
import Social from "./pages/Social";
import Contact from "./pages/Contact";
import SuperAdminReset from "./pages/SuperAdminReset";

export default function App() {
  return (
    <>
      {/* Navbar stays on all pages */}
      <Navbar />

      {/* Page content wrapper */}
      <div style={{ paddingTop: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chanda" element={<Chanda />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />

          {/* User */}
          <Route path="/profile" element={<Profile />} />

          {/* Public */}
          <Route path="/members" element={<Members />} />
          <Route path="/social" element={<Social />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/top-admin" element={<TopAdminPanel />} />
          <Route path="/super-admin-reset" element={<SuperAdminReset />} />
          <Route path="/all-users" element={<UsersList />} />
        </Routes>
      </div>
    </>
  );
}
