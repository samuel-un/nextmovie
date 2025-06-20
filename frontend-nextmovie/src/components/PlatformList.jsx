import React from "react";
import "./PlatformList.css";

export default function PlatformList({ platforms }) {
	return (
		<div className="available-on">
			<span className="available-label">
				Available for subscription at:
			</span>
			<div className="platforms-list">
				{platforms.map((p) => (
					<img
						key={p.id}
						src={p.logo}
						alt={`Logo de ${p.name}`}
						title={p.name}
						className="platform-icon"
						loading="lazy"
						aria-label={p.name}
					/>
				))}
			</div>
		</div>
	);
}
