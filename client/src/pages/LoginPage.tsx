import React, { useState } from "react";
import zxcvbn from "zxcvbn";
import "../styles/LoginPage.css";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [, setError] = useState("");

    const passwordScore = password ? zxcvbn(password).score : 0;

    const getPasswordStrengthColor = (score: number) => {
        switch (score) {
            case 0:
            case 1:
                return "red";
            case 2:
                return "orange";
            case 3:
                return "yellowgreen";
            case 4:
                return "green";
            default:
                return "gray";
        }
    }

    const getStrengthLabel = (score: number): string => {
        return ["Very Weak", "Weak", "Fair", "Good", "Strong"][score] || "";
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;

        setLoading(true);

        try {
            //TODO: Replace with real login logic (make call to BE)
            const response = await fetch("https://localhost:3000/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }

            const data = await response.json();
            localStorage.setItem("authToken", data.token);
            alert("Login successful");
        }
        catch (err: any) {
            //TODO
            setError(err.message)
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <main className="mainLogin">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <section>
                    <label htmlFor="username">Username:</label><br />
                    <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </section>
                <section className="mainDiv">
                    <label htmlFor="password">Password:</label><br />
                    <input id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} required />
                    {password && (
                        <div className="strength-meter">
                            <label htmlFor="passwordStrength" className="visually-hidden">Password strength</label>
                            <progress
                                id="passwordStrength"
                                className="strength-bar"
                                value={passwordScore}
                                max={4}
                            />
                            <div
                                className="strength-bar"
                                style={{
                                    width: `${(passwordScore + 1) * 20}%`,
                                    backgroundColor: getPasswordStrengthColor(passwordScore)
                                }}
                            />
                            <span className="strength-label">{getStrengthLabel(passwordScore)}</span>
                        </div>
                    )}
                </section>
                <button disabled={loading} className="loginButton" type="submit">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </main>
    )
}

export default LoginPage