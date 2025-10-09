import React from 'react';
import './footer.css'; // Import the CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <p>
                Designed by&nbsp;<strong className="bold-text">
                <a href="https://www.instagram.com/sdcnitw/profilecard/?igsh=bmMwbXk1cTdhdzN1">
                            SDC, NIT Warangal
                </a>  
                </strong>
            </p>
            <p class="text-sm text-600">&copy; Copyright Technozion'25</p>
        </footer>
    );
};

export default Footer;