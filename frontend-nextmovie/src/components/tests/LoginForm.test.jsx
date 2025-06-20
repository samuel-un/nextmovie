import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import LoginForm from "../LoginForm";
import { BrowserRouter } from "react-router-dom";

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("LoginForm", () => {
	test("renderiza inputs y botón de submit", () => {
		renderWithRouter(<LoginForm />);
		expect(
			screen.getByPlaceholderText(/username or email/i)
		).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /logging in/i })
		).toBeInTheDocument();
	});

	test("permite escribir en los inputs", async () => {
		renderWithRouter(<LoginForm />);
		const emailInput = screen.getByPlaceholderText(/username or email/i);
		const passwordInput = screen.getByPlaceholderText(/password/i);

		await userEvent.type(emailInput, "test@example.com");
		await userEvent.type(passwordInput, "123456");

		expect(emailInput).toHaveValue("test@example.com");
		expect(passwordInput).toHaveValue("123456");
	});
});
