import {useContext, useEffect, useState} from "react";
import api from "../api/axios.js";
import {AuthContext} from "../auth/AuthContext.jsx";

export default function TradesmanDashboard() {
    const [jobs, setJobs] = useState([]);
    const [quoteData, setQuoteData] = useState({});
    const [submitting, setSubmitting] = useState(null);

    useEffect(() => {
        console.log("Dashboard mounted");
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs");
                setJobs(response.data);
            } catch (error) {
                console.error("Failed to load jobs", error);
            }
        };

        fetchJobs();
    }, []);

    const { logout } = useContext(AuthContext);

    const handleChange = (jobId, field, value) => {
        setQuoteData(prev => ({
            ...prev,
            [jobId]: {
                ...prev[jobId],
                [field]: value
            }
        }));
    };

    const submitQuote = async (jobId) => {
        const quote = quoteData[jobId];

        if (!quote?.price) {
            alert("Please specify a price");
            return;
        }

        try {
            setSubmitting(jobId);

            await api.post("/quotes", {
                jobId: jobId,
                price: Number(quote.price),
                message: quote.message || ""
            });

            alert("Quote successfully added!");

            setQuoteData(prev => ({
                ...prev,
                [jobId]: { ...prev[jobId], submitted: true }
            }));
        } catch (error) {
            console.error("Failed to submit quote", error);

            if (error.response?.status === 403) {
                alert("You are not authorized to submit this quote.");
            } else {
                alert("Failed to submit quote. Please try again.");
            }
        } finally {
            setSubmitting(null);
        }
    };

    return (
        <div>
            <h2>Available Jobs</h2>

            {jobs.length === 0 && <p>No jobs available.</p>}

            {jobs.map(job => {
                const quote = quoteData[job.id] || {};

                return (
                    <div key={job.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                        <h4>{job.title}</h4>
                        <p>{job.description}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Urgency:</strong> {job.urgency}</p>

                        {quote.submitted ? (
                            <p style={{ color: "green" }}>Quote submitted</p>
                        ) : (
                            <>
                                <input
                                    type="number"
                                    placeholder="Price (£)"
                                    value={quote.price || ""}
                                    onChange={e => handleChange(job.id, "price", e.target.value)}
                                    style={{ width: "100px", marginBottom: "5px" }}
                                />
                                <br />
                                <textarea
                                    placeholder="Message to customer (optional)"
                                    value={quote.message || ""}
                                    onChange={e => handleChange(job.id, "message", e.target.value)}
                                    style={{ width: "100%", height: "60px", marginBottom: "5px" }}
                                />
                                <br />
                                <button
                                    onClick={() => submitQuote(job.id)}
                                    disabled={submitting === job.id}
                                >
                                    {submitting === job.id ? "Submitting..." : "Submit Quote"}
                                </button>
                            </>
                        )}
                    </div>
                );
            })}
            <button onClick={logout}>
                Logout
            </button>
        </div>
    );
}
