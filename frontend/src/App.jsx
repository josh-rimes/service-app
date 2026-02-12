import {AuthProvider} from "./auth/AuthContext.jsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import CustomerDashboard from "./pages/CustomerDashboard/CustomerDashboard.jsx";
import TradesmanDashboard from "./pages/TradesmanDashboard/TradesmanDashboard.jsx";
import TradesmanProfile from "./pages/TradesmanProfile/TradesmanProfile.jsx";
import AppLayout from "./components/Layout/AppLayout.jsx";
import {NotificationProvider} from "./components/Notification/NotificationContext.jsx";
import NotificationContainer from "./components/Notification/Notification.jsx";


function App() {
    return (
        <NotificationProvider>
            <AuthProvider>
                <NotificationContainer />
                <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route element={<AppLayout />}>
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
                        <Route
                            path="/tradesman/profile"
                            element={
                                <ProtectedRoute role="TRADESMAN">
                                    <TradesmanProfile />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </NotificationProvider>
    );
}

export default App;
