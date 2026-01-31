import {useAuth} from "../../auth/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import styles from "./Login.module.css"
import Button from "../../components/Button/Button.jsx";
import logo from "../../assets/full_logo.png";


export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const role = await login(email, password);

        if (role === "CUSTOMER") {
            navigate("/customer");
        } else if (role === "TRADESMAN") {
            navigate("/tradesman");
        } else {
            navigate('/');
        }
    };

    return (
        <div className={styles.login}>
            <img src={logo} alt="HotFix logo" />
            <div className={styles.twoColumns}>
                <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            </div>

            <Button onClick={handleLogin}>Login</Button>

            <div className={styles.register}>
                <p>Click here to create an account:</p>
                <Button onClick={() => navigate("/register")}>
                    Register
                </Button>
            </div>
        </div>
    );
};