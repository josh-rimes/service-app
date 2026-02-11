import {useContext, useEffect, useState} from "react";
import api from "../../api/axios.js";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../auth/AuthContext.jsx";
import styles from "./TradesmanProfile.module.css";
import Button from "../../components/Button/Button.jsx";
import Input from "../../components/Input/Input.jsx";
import TextArea from "../../components/TextArea/TextArea.jsx";
import Card from "../../components/Card/Card.jsx";
import Empty from "../../components/Empty/Empty.jsx";
import {useNotification} from "../../components/Notification/NotificationContext.jsx";

export default function TradesmanProfile() {
    const { user } = useContext(AuthContext);
    const { addNotification } = useNotification();
    const [reviews, setReviews] = useState([]);
    const [profile, setProfile] = useState({
        bio: "",
        skills: "",
        location: "",
    });

    useEffect(() => {
        if (!user?.id) return;

        api.get(`/tradesman/profile`).then((response) => setProfile(response.data))
            .catch((error) => console.log("Failed to load profile", error));
    }, [user]);

    useEffect(() => {
        api.get(`/reviews/tradesman/${user.id}`).then((response) => setReviews(response.data));
    }, [user.id]);

    const save = async () => {
        try {
            await api.put("/tradesman/profile", profile);
            addNotification("Profile saved successfully.", "success");
        } catch (error) {
            console.error("Failed to save profile", error);
            addNotification("Failed to save profile. Please try again.", "error");
        }
    }

    const { logout } = useContext(AuthContext);

    const navigate = useNavigate();

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className={styles.profile}>
            <Button onClick={() => navigate("/tradesman")}>
                Tradesman Dashboard
            </Button>

            <Button variant="logout" onClick={logout}>
                Logout
            </Button>

            <Card title={<h2>My Profile</h2>}>
                <h4>Bio</h4>
                <div className={styles.bio}>
                    <TextArea
                        placeholder="Write your bio here..."
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })
                    }/>
                </div>

                <h4>Skills</h4>
                <Input
                    placeholder="Enter your skills here..."
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })
                }/>

                <h4>Location</h4>
                <Input
                    placeholder="Enter your location here..."
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })
                }/>

                <Button variant={"light"} onClick={save}>Save profile</Button>
            </Card>

            <Card title={<h2>Reviews</h2>}>
                {reviews.length === 0 && <Empty>No reviews yet.</Empty>}

                {reviews.map(r => (
                    <div key={r.id}>
                        <strong>{r.rating} ⭐</strong>
                        <p>{r.comment}</p>
                    </div>
                ))}
            </Card>

        </div>
    );
}