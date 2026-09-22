import { Navigate } from "react-router-dom";

// If there is no token, and user tries in url to enter /books, /dashboard, /borrow-records then is he is redirected to login page

function ProtectedRoute({ children }) { // children means component accepts whatever we put inside,
                                        // <protectedRoute>
                                        //    <Books>
                                        // </protectedRoute> 
    const token = localStorage.getItem("token");

    if(!token){
        return <Navigate to="/login" replace /> // replace tells React Router to replace the current browser hostory rather than adding another one. eg /books -> /login, with replace, pressing Back wont take the user back to the protected /books entry
    }

    return children;
}

export default ProtectedRoute;