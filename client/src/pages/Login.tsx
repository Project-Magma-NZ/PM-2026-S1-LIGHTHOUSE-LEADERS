import { useState } from "react";
import { useNavigate } from "react-router";
import { assets } from '../assets/assets'


export default function Login() {
    // Note that there is no authentication or storage of user data, just the skin
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        navigate("/dashboard");
    };

    return (
        <div className="login-page">
            <div className="login-card-wrapper">
                <div className="login-card">
                    <div className="login-logo-wrapper">
                        <img src={assets.logo} alt="Lighthouse Leaders NZ" className="login-logo" />
                    </div>
                    <h1 className="login-heading">
                        {isSignup ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="login-subheading">
                        {isSignup ? "Sign up to start creating surveys" : "Log in to access your surveys"}
                    </p>
                    <form onSubmit={handleSubmit} className="login-form">
                        {isSignup && (
                            <div className="login-field">
                                <label htmlFor="name" className="login-label">Full Name</label>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                                    required className="login-input" placeholder="Enter your name" />
                            </div>
                        )}
                        <div className="login-field">
                            <label htmlFor="email" className="login-label">Email</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                required className="login-input" placeholder="Enter your email" />
                        </div>
                        <div className="login-field">
                            <label htmlFor="password" className="login-label">Password</label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                required className="login-input" placeholder="Enter your password" />
                        </div>
                        <button type="submit" className="login-submit">
                            {isSignup ? "Sign Up" : "Log In"}
                        </button>
                    </form>
                    <div className="login-toggle-wrapper">
                        <button onClick={() => setIsSignup(!isSignup)} className="login-toggle">
                            {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}