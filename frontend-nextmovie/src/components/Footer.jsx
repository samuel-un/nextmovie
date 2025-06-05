import React from "react";
import "./Footer.css";

export default function Footer() {
	return (
		<footer className="footer">
			<div className="footer-inner">
				<div className="footer-left">
					<img
						src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1749109801/NextMovie_logo_letras_y_icono_pmb1av.png"
						alt="NextMovie Logo"
						className="footer-logo"
					/>
					<p className="footer-copy">
						&copy; 2025 NextMovie, inc.
						<br className="footer-mobile-break" />
						All rights reserved.
					</p>
				</div>
				<div className="footer-divider" />
				<div className="footer-right">
					<span className="footer-dev">Developed by Samuel U.N</span>
					<div className="footer-icons">
						<a
							href="https://github.com/"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="GitHub"
						>
							<img
								src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1749110620/logotipo-de-github_zxc5vl.png"
								alt="GitHub"
								className="footer-icon"
							/>
						</a>
						<a
							href="https://linkedin.com/"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="LinkedIn"
						>
							<img
								src="https://res.cloudinary.com/dgbngcvkl/image/upload/v1749110761/linkedin_ma858y.png"
								alt="LinkedIn"
								className="footer-icon"
							/>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
