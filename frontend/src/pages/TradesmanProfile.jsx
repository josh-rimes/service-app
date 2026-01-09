import {useEffect, useState} from "react";
import api from "../api/axios.js";

export default function TradesmanProfile({ tradesmanId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        api.get(`/reviews/tradesman/${tradesmanId}`).then((response) => setReviews(response.data));
    }, [tradesmanId]);

    return (
        <div>
            <h2>Reviews</h2>
            {reviews.map(r => (
                <div key={r.id}>
                    <strong>{r.rating} ⭐</strong>
                    <p>{r.comment}</p>
                </div>
            ))}
        </div>
    );
}