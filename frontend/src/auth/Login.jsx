import {useAuth} from "./AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";


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
        <div>
            <h2>Login</h2>
            <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};