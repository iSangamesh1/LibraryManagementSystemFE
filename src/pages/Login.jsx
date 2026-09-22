import { useState } from "react";
import { login } from "../services/authServices";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const response = await login(username, password);

            // But after the user logs in, we need React to remember the JWT so it can send it with future API requests.
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("role", response.data.role)

            // when the login state has changed, let components that care about it know
            // When there is change in browser storage, react doesn't automatically re-renders the component.
            // so we created our own brower event, and navbar will listens to this event using useEffect.
            window.dispatchEvent(new Event("login"))
            navigate("/books");

            console.log("Login Successful!")
            console.log("Login Response: ", response.data);
            console.log("Role:", response.data.role);
        } catch (error) {
            console.error("Login failed:", error);
            setError("Invalid username or password");
        }
    }

// However, this is only for the UI.
// The real security is still our backend: 
// React hiding Delete button
        // +
// Spring Security rejecting unauthorized DELETE

// We need both.
// Someone could manually make a DELETE request even if the button is hidden, so backend authorization remains the actual security boundary.

// "Can a user change role in localStorage?"
// Yes.
// For example, someone could technically open browser storage and change:
// role = OPERATOR to: role = ADMIN
// But that doesn't give them Admin backend permissions. Why?
// Because Spring Security doesn't trust React's localStorage role. The backend gets the role from the signed JWT:

// JWT -> Spring Security -> ROLE_ADMIN / ROLE_OPERATOR
// So: localStorage role -> Used for UI only
// JWT role -> Used by backend authorization

    return(
        <div>
            <h1>Library Management System</h1>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p>{error}</p>}

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login;