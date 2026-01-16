import styles from "./Empty.module.css";

export default function Empty({ children }) {
    return (
        <p className={styles.empty}>{children}</p>
    );
}