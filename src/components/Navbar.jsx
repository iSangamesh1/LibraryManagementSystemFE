import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {

    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    useEffect(() => {
        const handleLogin = () => {
            setRole(localStorage.getItem("role"));
        };
        
        // start listening for login
        window.addEventListener("login", handleLogin);
        // this is called whenever a login event happened on window, execute handleLogin 
        // we are not manually callign handleLogin, window is calling it as wait untill this event happened

        return() => {
            window.removeEventListener("login", handleLogin);
        }
    }, [])
    // useEffect will render when the component is mounted. 
    // and also when someone tells that login happened, go to localstorage and get the current role, and put that role in react

    // function handleLogout() {
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setRole(null);

        window.location.href = "/login"; // back to login page
    }

    return (
        <header className="navbar">
            <h2>📚 Library Management System</h2>

            {role && (
                <div className="navbar-right">
                    <div className="user">
                        👤 {role}
                    </div>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
                )}
        </header>
    )
}

export default Navbar;