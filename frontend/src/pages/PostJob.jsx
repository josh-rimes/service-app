import {useState} from "react";
import api from "../api/axios.js";


export default function PostJob() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('');
    const [location, setLocation] = useState('');

    const submit = async () => {
        await api.post("/jobs", {
            title,
            description,
            urgency,
            location
        });
    };

    return (
        <>
            <input placeholder={"Title..."} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder={"Description..."} onChange={(e) => setDescription(e.target.value)} />
            <label>Urgency:</label>
            <select onChange={(e) => setUrgency(e.target.value)}>
                <option value={"ASAP"}>ASAP</option>
                <option value={"TODAY"}>TODAY</option>
                <option value={"THIS_WEEK"}>THIS_WEEK</option>
                <option value={"FLEXIBLE"}>FLEXIBLE</option>
            </select>
            <input placeholder={"Postcode..."} onChange={(e) => setLocation(e.target.value)} />
            <button onClick={submit}>Post Job</button>
        </>
    )
}