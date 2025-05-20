import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
	it("renders the login form", () => {
		render(
			<MemoryRouter>
				<LoginForm />
			</MemoryRouter>
		);
		expect(
			screen.getByPlaceholderText(/Username or Email/i)
		).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Login/i })
		).toBeInTheDocument();
	});

	it("shows error if fields are empty and submit is clicked", () => {
		render(
			<MemoryRouter>
				<LoginForm />
			</MemoryRouter>
		);
		fireEvent.click(screen.getByRole("button", { name: /Login/i }));
		expect(
			screen.getByText(/Please fill in all fields/i)
		).toBeInTheDocument();
	});

	it("shows and hides password when icon is clicked", () => {
		render(
			<MemoryRouter>
				<LoginForm />
			</MemoryRouter>
		);
		const passwordInput = screen.getByPlaceholderText(/Password/i);
		const toggleBtn = screen.getAllByRole("button")[0];
		expect(passwordInput.type).toBe("password");
		fireEvent.click(toggleBtn);
		expect(passwordInput.type).toBe("text");
		fireEvent.click(toggleBtn);
		expect(passwordInput.type).toBe("password");
	});
});
