import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "../RegisterForm";
import { BrowserRouter } from "react-router-dom";

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("RegisterForm", () => {
	test("renderiza los campos del formulario de registro", () => {
		renderWithRouter(<RegisterForm />);

		expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText(/repeat password/i)
		).toBeInTheDocument();
		expect(
			screen.getByRole("checkbox", { name: /i accept/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /creating account/i })
		).toBeInTheDocument();
	});

	test("permite escribir en los campos del formulario", async () => {
		renderWithRouter(<RegisterForm />);
		const user = userEvent.setup();

		await user.type(screen.getByPlaceholderText(/full name/i), "John Doe");
		await user.type(
			screen.getByPlaceholderText(/email/i),
			"john@example.com"
		);
		await user.type(
			screen.getByPlaceholderText(/^password$/i),
			"secret123"
		);
		await user.type(
			screen.getByPlaceholderText(/repeat password/i),
			"secret123"
		);
		await user.click(screen.getByLabelText(/i accept/i));

		expect(screen.getByPlaceholderText(/full name/i)).toHaveValue(
			"John Doe"
		);
		expect(screen.getByPlaceholderText(/email/i)).toHaveValue(
			"john@example.com"
		);
		expect(screen.getByPlaceholderText(/^password$/i)).toHaveValue(
			"secret123"
		);
		expect(screen.getByPlaceholderText(/repeat password/i)).toHaveValue(
			"secret123"
		);
		expect(screen.getByRole("checkbox")).toBeChecked();
	});
});
