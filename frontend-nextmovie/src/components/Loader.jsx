import React, { useEffect } from "react";
import { lineWobble } from "ldrs";

export default function Loader() {
	useEffect(() => {
		lineWobble.register();
	}, []);

	return (
		<div
			role="alert"
			aria-busy="true"
			aria-label="Loading content"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "rgba(17, 24, 39, 0.5)", // bg-gray-900 bg-opacity-50
				zIndex: 9999,
				pointerEvents: "auto",
			}}
		>
			<l-line-wobble
				size="80"
				stroke="5"
				bg-opacity="0.1"
				speed="1.6"
				color="#9f42c6"
			></l-line-wobble>
		</div>
	);
}
