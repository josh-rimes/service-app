import {useContext, useEffect, useState} from "react";
import api from "../../api/axios.js";
import { AuthContext } from "../../auth/AuthContext.jsx";
import styles from "./CustomerDashboard.module.css"
import Button from "../../components/Button/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import Empty from "../../components/Empty/Empty.jsx";

export default function CustomerDashboard() {
    const { user } = useContext(AuthContext);

    const [jobs, setJobs] = useState([]);
    const [accepting, setAccepting] = useState(null);
    const [newJob, setNewJob] = useState({ customer: user, title: "", description: "", location: "", urgency: "NORMAL" });
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get(`/jobs/customer/${user.id}`);
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
        <div className={styles.dashboard}>
            <Button variant="logout" onClick={logout}>
                Logout
            </Button>

            <Card title={<h2>Post a New Job</h2>}>
                <input
                    type="text"
                    placeholder="Job Title"
                    value={newJob.title}
                    onChange={e => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                />
                <textarea
                    placeholder="Job Description"
                    value={newJob.description}
                    onChange={e => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={newJob.location}
                    onChange={e => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                />
                <select
                    value={newJob.urgency}
                    onChange={e => setNewJob(prev => ({ ...prev, urgency: e.target.value }))}
                >
                    <option value="ASAP">ASAP</option>
                    <option value="TODAY">Today</option>
                    <option value="THIS_WEEK">This Week</option>
                    <option value="FLEXIBLE">Flexible</option>
                </select>
                <br />
                <Button onClick={postJob} disabled={posting}>
                    {posting ? "Posting..." : "Post Job"}
                </Button>
            </Card>

            <h2>My Jobs</h2>
            {jobs.length === 0 && <Empty>You have not posted any jobs.</Empty>}

            {jobs.map(job => (
                <Card key={job.id} title={job.title}>
                    <p>{job.description}</p>
                    <p><strong>Status:</strong> {job.status}</p>

                    <p><strong>Quotes:</strong></p>
                    {(!job.quotes || job.quotes.length === 0) && <p>No quotes yet.</p>}

                    {job.quotes?.map(quote => (
                        <Card key={quote.id}>
                            <p><strong>Tradesman:</strong> {quote.tradesman?.name || "Unknown"}</p>
                            <p>
                            <strong>Price:</strong>{" "}
                            {quote.priceEstimate == null ? "Unspecified" : `£${quote.priceEstimate}`}
                            </p>
                            <p>{quote.message}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span style={{color: quote.status === "ACCEPTED" ? "green" : getRejectedColour(quote)}}>
                                    {quote.status}
                                </span>
                            </p>
                            {quote.status === "PENDING" && (
                                <Button
                                    onClick={() => acceptQuote(job.id, quote.id)}
                                    disabled={accepting === quote.id}
                                >
                                    {accepting === quote.id ? "Accepting..." : "Accept Quote"}
                                </Button>
                            )}
                        </Card>
                    ))}
                </Card>
            ))}
        </div>
    );

}

function getRejectedColour(quote) {
    return quote.status === "REJECTED" ? "red" : "black";
}
