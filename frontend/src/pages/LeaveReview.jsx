import {useState} from "react";
import api from "../api/axios.js";

export default function LeaveReview({ jobId }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const submit = async () => {
        await api.post(`/reviews`, {
            jobId,
            rating,
            comment,
        });
    };

    return (
        <div>
            <h3>Leave Review</h3>
            <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            <textarea
                placeholder="Write a review..."
                onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={submit}>Submit</button>
        </div>
    );
}