export function validateRegisterForm(form) {
	if (!form.fullName.trim()) return "Please enter your full name.";
	if (!form.email.trim()) return "Please enter your email.";
	if (!isValidEmail(form.email)) return "Invalid email format.";
	if (!form.password) return "Please enter a password.";
	if (!isPasswordSecure(form.password))
		return "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.";
	if (form.password !== form.repeatPassword) return "Passwords do not match.";
	if (!form.terms) return "You must accept the Terms and Conditions.";
	return null;
}

export function validateLoginForm(form) {
	if (!form.email.trim() || !form.password.trim()) {
		return "Please fill in all fields.";
	}
	return null;
}

export function isValidEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isPasswordSecure(password) {
	const minLength = 8;
	const hasUpper = /[A-Z]/.test(password);
	const hasLower = /[a-z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
	return (
		password.length >= minLength &&
		hasUpper &&
		hasLower &&
		hasNumber &&
		hasSymbol
	);
}
