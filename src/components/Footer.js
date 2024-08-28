import React from "react";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
      <footer className="footer">
        <p>© {currentYear} Expense Tracker | Developed by Suraj Godse</p>
        <p className="tech-stack">
          Built with React, Firebase (Authentication & Realtime Database), Material-UI, Recharts, and hosted on Firebase Hosting
        </p>
        <div className="footer-icons">
          <a href="https://www.linkedin.com/in/suraj-godse" target="_blank" rel="noopener noreferrer">
            <img src="/images/linkedin-logo.png" alt="LinkedIn" />
          </a>
          <a href="https://github.com/surajgodse" target="_blank" rel="noopener noreferrer">
            <img src="/images/github.png" alt="GitHub" />
          </a>
        </div>
      </footer>
    );
  }
  
export default Footer;