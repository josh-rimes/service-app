import {useContext, useEffect, useState} from "react";
import api from "../api/axios.js";
import { AuthContext } from "../auth/AuthContext";

export default function CustomerDashboard() {
    const [jobs, setJobs] = useState([]);
    const [accepting, setAccepting] = useState(null);
    const [newJob, setNewJob] = useState({ title: "", description: "", location: "", urgency: "NORMAL" });
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get("/jobs");
                setJobs(res.data);
            } catch (err) {
                console.error("Failed to load jobs", err);
            }
        };

        fetchJobs();
    }, []);

    const { logout } = useContext(AuthContext);

    const acceptQuote = async (jobId, quoteId) => {
        try {
            setAccepting(quoteId);

            await api.post(`/jobs/${jobId}/select/${quoteId}`);

            alert("Quote accepted");

            setJobs(prevJobs =>
                prevJobs.map(job => ({
                    ...job,
                    quotes: job.quotes.map(q =>
                        q.id === quoteId
                            ? { ...q, status: "ACCEPTED" }
                            : { ...q, status: "REJECTED" }
                    )
                }))
            );
        } catch (err) {
            console.error("Failed to accept quote", err);
            if (err.response?.status === 403) {
                alert("You are not authorized to accept this quote.");
            } else {
                alert("Failed to accept quote. Try again.");
            }
        } finally {
            setAccepting(null);
        }
    };

    const postJob = async () => {
        if (!newJob.title || !newJob.description || !newJob.location) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            setPosting(true);
            const res = await api.post("/jobs", newJob);
            alert("Job posted successfully");

            setJobs(prev => [...prev, res.data]);
            setNewJob({ title: "", description: "", location: "", urgency: "ASAP" });
        } catch (err) {
            console.error("Failed to post job", err);
            if (err.response?.status === 403) {
                alert("You are not authorized to post a job.");
            } else {
                alert("Failed to post job. Try again.");
            }
        } finally {
            setPosting(false);
        }
    };

    return (
        <div>
            <h2>Post a New Job</h2>
            <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "2rem" }}>
                <input
                    type="text"
                    placeholder="Job Title"
                    value={newJob.title}
                    onChange={e => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                    style={{ width: "100%", marginBottom: "5px" }}
                />
                <textarea
                    placeholder="Job Description"
                    value={newJob.description}
                    onChange={e => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                    style={{ width: "100%", height: "60px", marginBottom: "5px" }}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={newJob.location}
                    onChange={e => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                    style={{ width: "100%", marginBottom: "5px" }}
                />
                <select
                    value={newJob.urgency}
                    onChange={e => setNewJob(prev => ({ ...prev, urgency: e.target.value }))}
                    style={{ marginBottom: "5px" }}
                >
                    <option value="ASAP">ASAP</option>
                    <option value="TODAY">Today</option>
                    <option value="THIS_WEEK">This Week</option>
                    <option value="FLEXIBLE">Flexible</option>
                </select>
                <br />
                <button onClick={postJob} disabled={posting}>
                    {posting ? "Posting..." : "Post Job"}
                </button>
            </div>

            <h2>My Jobs</h2>
            {jobs.length === 0 && <p>You have not posted any jobs.</p>}

            {jobs.map(job => (
                <div key={job.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                    <h4>{job.title}</h4>
                    <p>{job.description}</p>
                    <p><strong>Status:</strong> {job.status}</p>

                    <h5>Quotes</h5>
                    {(!job.quotes || job.quotes.length === 0) && <p>No quotes yet.</p>}

                    {job.quotes?.map(quote => (
                        <div key={quote.id} style={{ marginBottom: "0.5rem" }}>
                            <p><strong>Tradesman ID:</strong> {quote.tradesmanId?.name || "Unknown"}</p>
                            <p><strong>Price:</strong> £{quote.price}</p>
                            <p>{quote.message}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    style={{
                                        color:
                                            quote.status === "ACCEPTED" ? "green" :
                                                getRejectedColour(quote)
                                    }}
                                >
                  {quote.status}
                </span>
                            </p>
                            {quote.status === "PENDING" && (
                                <button
                                    onClick={() => acceptQuote(job.id, quote.id)}
                                    disabled={accepting === quote.id}
                                >
                                    {accepting === quote.id ? "Accepting..." : "Accept Quote"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={logout}>
                Logout
            </button>
        </div>
    );

}

function getRejectedColour(quote) {
    return quote.status === "REJECTED" ? "red" : "black";
}
