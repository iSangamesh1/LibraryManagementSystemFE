import { Navigate } from "react-router-dom";

// As protectedRoute is used when the user is trying to wander in other sections such as /books, /dashboard, etc without token then this component takes him to login page

// in same manner when user is once login he is not needed to again redirected to login page instead he can directly go to dashboard/books.

// without public route user can see the login form again and again, so with this component if(token) true, then user is redirected to dashboard/books

function PublicRoute({children}) {
    const token = localStorage.getItem("token");

    if(token){
        return <Navigate to="/books" replace />
    }

    return children;
}

export default PublicRoute