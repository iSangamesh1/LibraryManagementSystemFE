import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Books from "./pages/Books";
import Members from "./pages/Members";
import BorrowRecords from "./pages/BorrowRecords";

import "./App.css";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <div className="layout">
          <Sidebar />

          <main className="content">
            <Routes>
              <Route path="/login" element={
                <PublicRoute> 
                  <Login />
                </PublicRoute>  
              } /> 
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/books" element={
                <ProtectedRoute>
                    <Books />
                  </ProtectedRoute>
              } />
              <Route path="/members" element={
                // {<!--//user can navigate through Url so for blocking that we are adding this, it will check if token exist then only user can proceed -->}
                 <ProtectedRoute>
                    <Members />
                  </ProtectedRoute>
              } />
              <Route path="/borrow-records" element={
                 <ProtectedRoute>
                    <BorrowRecords />
                  </ProtectedRoute>
              } />
            </Routes>
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
