import {useAuth} from "../../auth/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import styles from "./Register.module.css"
import Button from "../../components/Button/Button.jsx";
import logo from "../../assets/full_logo.png";


export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        await register(name, email, password, role);

        navigate('/');
    };

    return (
        <div className={styles.register}>
            <img src={logo} alt="HotFix logo" />
            <div className={styles.oneColumn}>
                <input placeholder="Name" onChange={e => setName(e.target.value)} />
                <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <select onChange={e => setRole(e.target.value)}>
                    <option value="">Select account type...</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="TRADESMAN">Tradesman</option>
                </select>
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