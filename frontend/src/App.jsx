import {AuthProvider} from "./auth/AuthContext.jsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import CustomerDashboard from "./pages/CustomerDashboard";
import TradesmanDashboard from "./pages/TradesmanDashboard";


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />

                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/customer"
                        element={
                        <ProtectedRoute role="CUSTOMER">
                            <CustomerDashboard />
                        </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/tradesman"
                        element={
                        <ProtectedRoute role="TRADESMAN">
                            <TradesmanDashboard />
                        </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
