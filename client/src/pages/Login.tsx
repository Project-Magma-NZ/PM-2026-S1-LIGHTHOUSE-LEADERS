import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from '../assets/assets'
import { useAuth } from "../context/AuthProvider";

function getErrorMessage(err: any): string {
  // Axios-style errors
  const data = err?.response?.data;
  if (!data) return err?.message ?? "Something went wrong";

  // FastAPI validation errors (422)
  if (Array.isArray(data?.detail)) {
    const first = data.detail[0];
    const field = Array.isArray(first?.loc) ? first.loc[first.loc.length - 1] : "field";
    const msg = first?.msg ?? "Invalid value";
    return `${String(field)}: ${String(msg)}`;
  }

  // Standard FastAPI HTTPException detail
  if (typeof data?.detail === "string") return data.detail;

  return "Request failed";
}

export default function Login() {
  const navigate = useNavigate();
  const { login, signup, user } = useAuth();

  const [isSignup, setIsSignup] = useState(false);

  // Keep your styled layout, but use username/password for auth
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Optional fields shown in signup mode (only if your backend supports them)
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  const [school_id, setSchoolId] = useState<string>("1");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isSignup) {
        const schoolIdInt = Number(school_id);

        if (!Number.isInteger(schoolIdInt) || schoolIdInt <= 0) {
          setError("Please select a school.");
          return;
        }
        // Only call signup if your AuthProvider exposes it and backend expects it
        await signup({ username, password, first_name, last_name, school_id });
      } else {
        await login({ username, password });
      }

      // After login, set isAdmin flag for analytics/admin mode if you still use it
      // Prefer deriving this from `me` or calling /me after login depending on your provider.
      const me = user ?? null;
      if (me?.role) {
        localStorage.setItem("isAdmin", String(me.role === 'admin'));
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(getErrorMessage(err) ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-wrapper">
        <div className="login-card">
          <div className="login-logo-wrapper">
            <img src={assets.logo} alt="Lighthouse Leaders NZ" className="login-logo" />
          </div>

          <h1 className="login-heading">{isSignup ? "Create Account" : "Welcome Back"}</h1>
          <p className="login-subheading">
            {isSignup ? "Sign up to start creating surveys" : "Log in to access your surveys"}
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            {isSignup && (
              <div className="login-field">
                <label style={{ display: "block", marginBottom: 6 }}>First name</label>
                <input
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  required
                  style={{ width: "100%", padding: 10 }}
                />
              </div>
            )}

            {isSignup && (
              <div className="login-field">
                <label style={{ display: "block", marginBottom: 6 }}>Last name</label>
                <input
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  required
                  style={{ width: "100%", padding: 10 }}
                />
              </div>
            )}

            {isSignup && (
              <div className="login-field">
                <label style={{ display: "block", marginBottom: 6 }}>School</label>
                <select
                  value={school_id}
                  onChange={(e) => setSchoolId(e.target.value)}
                  required
                  style={{ width: "100%", padding: 10 }}
                >
                  {/* Replace with backend-fetched schools later */}
                  <option value={1}>School 1</option>
                  <option value={2}>School 2</option>
                </select>
              </div>
            )}

            <div className="login-field">
              <label htmlFor="username" className="login-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="login-input"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
                placeholder="Enter your password"
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
            </div>

            {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}

            <button type="submit" className="login-submit" disabled={submitting}>
              {submitting ? (isSignup ? "Signing up..." : "Logging in...") : isSignup ? "Sign Up" : "Log In"}
            </button>
          </form>

          <div className="login-toggle-wrapper">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="login-toggle"
              disabled={submitting}
            >
              {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}