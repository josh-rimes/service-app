import styles from "./Input.module.css";

export default function Input({ variant = "light", ...props }) {
    return (
        <input
            className={`${styles.input} ${styles[variant]}`}
            {...props}
        />
    );
}