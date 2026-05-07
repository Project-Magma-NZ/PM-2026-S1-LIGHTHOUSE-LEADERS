import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, logout } = useAuth();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [schoolId, setSchoolId] = useState<number>(1);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signup({ username, password, first_name, last_name, school_id: schoolId });
      await logout(); // Logout immediately since backend sets cookie on signup; remove once backend is changed to not set cookie
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>First name</label>
          <input
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            required
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Last name</label>
          <input
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            required
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>School</label>
          <select
            value={schoolId}
            onChange={(e) => setSchoolId(Number(e.target.value))}
            style={{ width: "100%", padding: 10 }}
          >
            {/* Replace with data fetched from backend later */}
            <option value={1}>School 1</option>
            <option value={2}>School 2</option>
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        {error && (
          <p style={{ color: "crimson", marginBottom: 12 }}>{error}</p>
        )}

        <button type="submit" disabled={submitting} style={{ padding: "10px 14px" }}>
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}