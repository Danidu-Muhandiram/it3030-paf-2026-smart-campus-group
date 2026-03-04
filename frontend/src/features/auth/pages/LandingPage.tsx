import React from 'react';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
    return (
        // main wrapper that takes up the full screen
        <div className={styles.heroContainer}>

            {/* center content block */}
            <div className={styles.heroContent}>
                <h1 className={styles.systemTitle}>Smart Campus Operations Hub</h1>
                <p className={styles.description}>
                    Manage facilities, bookings and campus maintenance operations efficiently.
                </p>

                {/* login and register buttons */}
                <div className={styles.buttonGroup}>
                    <button className={styles.primaryButton}>Login</button>
                    <button className={styles.secondaryButton}>Register</button>
                </div>

                <p className={styles.disclaimerText}>
                    Only authorized university members can access this system.
                </p>
            </div>

            {/* bottom footer */}
            <footer className={styles.footer}>
                <p>© 2026 Smart Campus</p>
            </footer>
        </div>
    );
};

export default LandingPage;
