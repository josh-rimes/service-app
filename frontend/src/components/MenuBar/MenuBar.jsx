import styles from "./MenuBar.module.css";
import logo from "../../assets/full_logo.png";
import Button from "../Button/Button.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";

export default function MenuBar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isTradesman = user?.role === "TRADESMAN";
    const isCustomer = user?.role === "CUSTOMER";

    return (
        <nav className={styles.menuBar}>
            <div className={styles.logoSection}>
                <img src={logo} alt="HotFix Logo" />
            </div>

            <div className={styles.centerSection}>
                {isTradesman && (
                    location.pathname === "/tradesman" ? (
                        <Button onClick={() => navigate("/tradesman/profile")} style={{ margin: 0 }}>
                            My Profile
                        </Button>
                    ) : (
                        <Button onClick={() => navigate("/tradesman")} style={{ margin: 0 }}>
                            Tradesman Dashboard
                        </Button>
                    )
                )}
                {isCustomer && (
                    <Button style={{ margin: 0 }}>
                        Bookings
                    </Button>
                )}
            </div>

            <div className={styles.rightSection}>
                <Button variant="logout" onClick={logout} style={{ margin: 0 }}>
                    Logout
                </Button>
            </div>
        </nav>
    );
}
