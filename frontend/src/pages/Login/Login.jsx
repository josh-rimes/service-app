import {useAuth} from "../../auth/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import styles from "./Login.module.css"
import Button from "../../components/Button/Button.jsx";
import Input from "../../components/Input/Input.jsx";
import logo from "../../assets/full_logo.png";
import {useNotification} from "../../components/Notification/NotificationContext.jsx";


export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { addNotification } = useNotification();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const role = await login(email, password);

            if (role === "CUSTOMER") {
                navigate("/customer");
            } else if (role === "TRADESMAN") {
                navigate("/tradesman");
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Login failed", error);
            addNotification("Invalid email or password. Please try again.", "error");
        }
    };

    return (
        <div className={styles.login}>
            <img src={logo} alt="HotFix logo" />
            <div className={styles.twoColumns}>
                <Input name="email" placeholder="Email address" onChange={e => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            </div>

            <Button onClick={handleLogin}>Log In</Button>

            <div className={styles.register}>
                <p>Click here to create an account:</p>
                <Button onClick={() => navigate("/register")}>
                    Register
                </Button>
            </div>
        </div>
    );
};