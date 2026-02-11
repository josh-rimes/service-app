import styles from './Notification.module.css';
import { useNotification } from './NotificationContext';

export default function NotificationContainer() {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className={styles.container}>
            {notifications.map((n) => (
                <div key={n.id} className={`${styles.notification} ${styles[n.type]}`} onClick={() => removeNotification(n.id)}>
                    {n.message}
                </div>
            ))}
        </div>
    );
}
