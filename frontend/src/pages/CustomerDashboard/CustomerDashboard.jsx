import {useContext, useEffect, useState} from "react";
import api from "../../api/axios.js";
import { AuthContext } from "../../auth/AuthContext.jsx";
import styles from "./CustomerDashboard.module.css"
import Button from "../../components/Button/Button.jsx";
import Input from "../../components/Input/Input.jsx";
import TextArea from "../../components/TextArea/TextArea.jsx";
import Select from "../../components/Select/Select.jsx";
import Card from "../../components/Card/Card.jsx";
import Empty from "../../components/Empty/Empty.jsx";
import {useNotification} from "../../components/Notification/NotificationContext.jsx";

export default function CustomerDashboard() {
    const { user } = useContext(AuthContext);

    const [jobs, setJobs] = useState([]);
    const [accepting, setAccepting] = useState(null);
    const [newJob, setNewJob] = useState({ customer: user, title: "", description: "", location: "", urgency: "NORMAL" });
    const [posting, setPosting] = useState(false);
    const { addNotification } = useNotification();

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

            addNotification("Quote accepted successfully!", "success");

            setJobs(prevJobs =>
                prevJobs.map(job =>
                    job.id === jobId
                        ? {
                            ...job,
                            quotes: job.quotes.map(q =>
                                q.id === quoteId
                                    ? { ...q, status: "ACCEPTED" }
                                    : { ...q, status: "REJECTED" }
                            )
                        }
                        : job
                )
            );
        } catch (err) {
            console.error("Failed to accept quote", err);
            if (err.response?.status === 403) {
                addNotification("You are not authorized to accept this quote.", "error");
            } else {
                addNotification("Failed to accept quote. Please try again.", "error");
            }
        } finally {
            setAccepting(null);
        }
    };

    const postJob = async () => {
        if (!newJob.title || !newJob.description || !newJob.location) {
            addNotification("Please fill in all required fields.", "error");
            return;
        }

        try {
            setPosting(true);

            const res = await api.post("/jobs", newJob);
            addNotification("Job posted successfully!", "success");

            setJobs(prev => [...prev, res.data]);
            setNewJob({ title: "", description: "", location: "", urgency: "ASAP" });
        } catch (err) {
            console.error("Failed to post job", err);
            if (err.response?.status === 403) {
                addNotification("You are not authorized to post a job.", "error");
            } else {
                addNotification("Failed to post job. Please try again.", "error");
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
                <h4>Title</h4>
                <Input
                    placeholder="Job Title"
                    value={newJob.title}
                    onChange={e => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                />

                <h4>Description</h4>
                <div className={styles.description}>
                    <TextArea
                        placeholder="Job Description"
                        value={newJob.description}
                        onChange={e => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                    />
                </div>

                <h4>Location</h4>
                <Input
                    placeholder="Location"
                    value={newJob.location}
                    onChange={e => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                />

                <h4>Urgency</h4>
                <Select
                    value={newJob.urgency}
                    onChange={e => setNewJob(prev => ({ ...prev, urgency: e.target.value }))}
                >
                    <option value="ASAP">ASAP</option>
                    <option value="TODAY">Today</option>
                    <option value="THIS_WEEK">This Week</option>
                    <option value="FLEXIBLE">Flexible</option>
                </Select>
                <br />
                <Button variant={"light"} onClick={postJob} disabled={posting}>
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
