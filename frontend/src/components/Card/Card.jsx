import styles from "./Card.module.css";

export default function Card({ title, children, actions }) {
    return (
        <div className={styles.card}>
            {title && <h4 className={styles.title}>{title}</h4>}
            <div>{children}</div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </div>
    );
}