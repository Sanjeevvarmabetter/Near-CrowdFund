import { useState } from "react";
import axios from "axios";

const Signup = ({ fetchUsers, setShowAddUserForm }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddUser = async () => {
    const { name, email, phone, password } = form;

    if (!name || !email || !phone || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://admin-tools-backend.vercel.app/api/users", form);

      setForm({ name: "", email: "", phone: "", password: "" });
      setError("");
      fetchUsers?.(); // optional chaining for cleaner conditional call
      setShowAddUserForm?.(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add user. Please try again.");
      console.error("Error adding user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: 24,
        borderRadius: 8,
        backgroundColor: "#f8f9fa",
        boxShadow: "0 0 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Sign Up</h2>

      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: 16 }}>
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Full Name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        style={inputStyle}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        style={inputStyle}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
        style={inputStyle}
      />

      <button
        onClick={handleAddUser}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px 16px",
          fontSize: 16,
          borderRadius: 6,
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: 16,
        }}
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

export default Signup;
