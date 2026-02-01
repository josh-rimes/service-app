import styles from "./TextArea.module.css";

export default function TextArea({ variant = "light", ...props }) {
    return (
        <textarea
            className={`${styles.textarea} ${styles[variant]}`}
            {...props}
        />
    );
}