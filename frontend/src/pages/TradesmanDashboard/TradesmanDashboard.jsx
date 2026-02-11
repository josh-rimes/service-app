import {useContext, useEffect, useState} from "react";
import api from "../../api/axios.js";
import {AuthContext} from "../../auth/AuthContext.jsx";
import styles from "./TradesmanDashboard.module.css";
import {useNavigate} from "react-router-dom";
import Button from "../../components/Button/Button.jsx";
import TextArea from "../../components/TextArea/TextArea.jsx";
import Input from "../../components/Input/Input.jsx";
import Card from "../../components/Card/Card.jsx";
import Empty from "../../components/Empty/Empty.jsx";
import {useNotification} from "../../components/Notification/NotificationContext.jsx";

export default function TradesmanDashboard() {
    const { user } = useContext(AuthContext);

    const [jobs, setJobs] = useState([]);
    const [quoteData, setQuoteData] = useState({});
    const [submitting, setSubmitting] = useState(null);
    const { addNotification } = useNotification();

    const loadDashboardData = async () => {
        try {
            const [openJobsRes, myQuotesRes] = await Promise.all([
                api.get("/jobs?status=OPEN&limit=20"),
                api.get("/jobs/my-quotes")
            ]);

            // Merge unique jobs
            const jobMap = new Map();
            openJobsRes.data.forEach(j => jobMap.set(j.id, j));
            myQuotesRes.data.forEach(j => jobMap.set(j.id, j));

            setJobs(Array.from(jobMap.values()));
        } catch (error) {
            console.log("Failed to load dashboard data", error);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

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

        if (!quote?.priceEstimate) {
            addNotification("Please specify a price", "error");
            return;
        }

        try {
            setSubmitting(jobId);

            await api.post("/quotes", {
                jobId: jobId,
                priceEstimate: Number(quote.priceEstimate),
                message: quote.message || ""
            });

            addNotification("Quote successfully added!", "success");

            await loadDashboardData();

        } catch (error) {
            console.error("Failed to submit quote", error);

            if (error.response?.status === 403) {
                addNotification("You are not authorized to submit this quote.", "error");
            } else {
                addNotification("Failed to submit quote. Please try again.", "error");
            }

        } finally {
            setSubmitting(null);
        }
    };

    const navigate = useNavigate();

    const { logout } = useContext(AuthContext);

    const hasQuoted = (job) =>
        job.quotes?.some(q => q.tradesman?.id === user.id);

    const myQuote = (job) =>
        job.quotes?.find(q => q.tradesman?.id === user.id)

    const openJobs = jobs.filter(job => !hasQuoted(job));

    const quotedJobs = jobs.filter(job => {
        const q = myQuote(job);
        return q?.status === "PENDING";
    });

    const acceptedJobs = jobs.filter(job => {
        const q = myQuote(job);
        return q?.status === "ACCEPTED";
    });

    return (
            <div className={styles.dashboard}>
                <Button onClick={() => navigate("/tradesman/profile")}>
                    My Profile
                </Button>

                <Button variant="logout" onClick={logout}>
                    Logout
                </Button>

                <div className={styles.threeColumns}>
                    <section>
                        <h2>Open Jobs</h2>

                        {openJobs.length === 0 && <Empty>No jobs available.</Empty>}

                        {openJobs.map(job => (
                            <Card key={job.id} title={job.title}>
                                <p>{job.description}</p>
                                <p><strong>Location:</strong> {job.location}</p>
                                <p><strong>Urgency:</strong> {job.urgency}</p>

                                <Input
                                    type="number"
                                    placeholder="Price (£)"
                                    value={quoteData[job.id]?.priceEstimate || ""}
                                    onChange={e => handleChange(job.id, "priceEstimate", e.target.value)}
                                    style={{ width: "100px", marginBottom: "5px" }}
                                />
                                <br />
                                <TextArea
                                    placeholder="Message to customer (optional)"
                                    value={quoteData[job.id]?.message || ""}
                                    onChange={e => handleChange(job.id, "message", e.target.value)}
                                    style={{ width: "100%", height: "60px", marginBottom: "5px" }}
                                />
                                <br />
                                <Button
                                    onClick={() => submitQuote(job.id)}
                                    disabled={submitting === job.id}
                                >
                                    {submitting === job.id ? "Submitting..." : "Submit Quote"}
                                </Button>
                            </Card>
                        ))}
                    </section>

                    <section>
                        <h2>My Quotes (Pending)</h2>
                        {quotedJobs.length === 0 && <Empty>No pending quotes.</Empty>}

                        {quotedJobs.map(job => {
                            const quote = myQuote(job);
                            return (
                                <Card key={job.id} title={job.title}>
                                    <p>{job.description}</p>
                                    <p className={styles.price}>
                                        <strong>Price:</strong>{" "}
                                        {quote.priceEstimate == null ? "Unspecified" : `£${quote.priceEstimate}`}
                                    </p>
                                </Card>
                            );
                        })}
                    </section>

                    <section>
                        <h2>Accepted Quotes</h2>
                        {acceptedJobs.length === 0 && <Empty>No accepted Quotes.</Empty>}

                        {acceptedJobs.map(job => {
                            const quote = myQuote(job);
                            return (
                                <Card key={job.id} title={job.title}>
                                    <p>{job.description}</p>
                                    <p className={styles.price}>
                                        <strong>Price:</strong>{" "}
                                        {quote.priceEstimate == null ? "Unspecified" : `£${quote.priceEstimate}`}
                                    </p>
                                    <Button>
                                        Create Booking
                                    </Button>
                                </Card>
                            );
                        })}

                    </section>
                </div>
            </div>
    );
}
