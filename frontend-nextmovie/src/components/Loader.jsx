export default function Loader() {
	return (
		<div
			role="alert"
			aria-busy="true"
			aria-label="Loading content"
			className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
		>
			<div
				className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
				aria-hidden="true"
			></div>
		</div>
	);
}
