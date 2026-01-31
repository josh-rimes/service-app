import styles from "./Select.module.css";

export default function Select({ variant = "light", children, ...props }) {
    return (
        <select
            className={`${styles.select} ${styles[variant]}`}
            {...props}
        >
            {children}
        </select>
    );
}