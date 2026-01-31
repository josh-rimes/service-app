import styles from "./Button.module.css";

export default function Button({ variant = "dark", ...props }) {
    return (
        <button
        className={`${styles.button} ${styles[variant]}`}
        {...props}
        />
    );
}