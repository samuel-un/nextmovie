import { render, screen, fireEvent } from "@testing-library/react";
import RegisterForm from "./RegisterForm";

describe("RegisterForm", () => {
	it("renders all input fields and button", () => {
		render(<RegisterForm />);
		expect(screen.getByPlaceholderText(/Full name/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText(/Repeat password/i)
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Create Account/i })
		).toBeInTheDocument();
	});

	it("shows error if fields are empty and submit is clicked", () => {
		render(<RegisterForm />);
		fireEvent.click(
			screen.getByRole("button", { name: /Create Account/i })
		);
		expect(
			screen.getByText(/Please fill in all fields/i)
		).toBeInTheDocument();
	});

	it("shows error if passwords do not match", () => {
		render(<RegisterForm />);
		fireEvent.change(screen.getByPlaceholderText(/Full name/i), {
			target: { value: "Test User" },
		});
		fireEvent.change(screen.getByPlaceholderText(/Email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
			target: { value: "Password123!" },
		});
		fireEvent.change(screen.getByPlaceholderText(/Repeat password/i), {
			target: { value: "Different123!" },
		});
		fireEvent.click(
			screen.getByRole("button", { name: /Create Account/i })
		);
		expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
	});

	it("shows error if terms are not accepted", () => {
		render(<RegisterForm />);
		fireEvent.change(screen.getByPlaceholderText(/Full name/i), {
			target: { value: "Test User" },
		});
		fireEvent.change(screen.getByPlaceholderText(/Email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
			target: { value: "Password123!" },
		});
		fireEvent.change(screen.getByPlaceholderText(/Repeat password/i), {
			target: { value: "Password123!" },
		});
		// Do not check the terms checkbox
		fireEvent.click(
			screen.getByRole("button", { name: /Create Account/i })
		);
		expect(
			screen.getByText(/You must accept the Terms and Conditions/i)
		).toBeInTheDocument();
	});
});
