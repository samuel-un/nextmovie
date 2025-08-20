import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
import { vi } from "vitest";

vi.mock("../store/useAuthStore", () => ({
	useAuthStore: vi.fn(() => ({
		user: { name: "John Doe" },
		logout: vi.fn(),
	})),
}));

describe("Header", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders the logo and search form", () => {
		render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>
		);
		expect(screen.getByAltText(/NextMovie logo/i)).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText(/Search for Movies or Series/i)
		).toBeInTheDocument();
	});
});
