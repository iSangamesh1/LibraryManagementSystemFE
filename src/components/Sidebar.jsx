import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    return (
     // aside is an HTML semantic element generally used for content such as: sidebars, navigation, related information
        <aside className="sidebar">
            <ul>
                <li>
                    <Link to="/books" >📚 Books</Link>
                </li>
                <li>
                    <Link to="/members" >👥 Members</Link>
                </li>
                <li>
                    <Link to="/borrow-records" >📖 Borrow Records</Link>
                </li>
            </ul>
        </aside>
    )
}

export default Sidebar;