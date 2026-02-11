import {useAuth} from "../../auth/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import styles from "./Register.module.css"
import Button from "../../components/Button/Button.jsx";
import Select from "../../components/Select/Select.jsx";
import Input from "../../components/Input/Input.jsx";
import logo from "../../assets/full_logo.png";
import {useNotification} from "../../components/Notification/NotificationContext.jsx";


export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const { addNotification } = useNotification();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !role) {
            addNotification("Please fill in all fields.", "error");
            return;
        }
        try {
            await register(name, email, password, role);
            addNotification("Registration successful! You can now log in.", "success");
            navigate('/');
        } catch (error) {
            console.error("Registration failed", error);
            addNotification("Registration failed. Email might already be in use.", "error");
        }
    };

    return (
        <div className={styles.register}>
            <img src={logo} alt="HotFix logo" />
            <div className={styles.oneColumn}>
                <Input placeholder="Name" onChange={e => setName(e.target.value)} />
                <Input placeholder="Email" onChange={e => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <Select onChange={e => setRole(e.target.value)}>
                    <option value="">Select account type...</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="TRADESMAN">Tradesman</option>
                </Select>
            </div>

            <Button onClick={handleRegister}>Register</Button>

            <div className={styles.login}>
                <p>Click here if you already have a login:</p>
                <Button onClick={() => navigate("/")}>
                    Login
                </Button>
            </div>
        </div>
    );
};