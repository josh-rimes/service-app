import { Outlet } from "react-router-dom";
import MenuBar from "../MenuBar/MenuBar.jsx";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
    return (
        <div className={styles.layout}>
            <MenuBar />
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}
