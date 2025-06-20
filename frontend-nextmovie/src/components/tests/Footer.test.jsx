import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
	it("renders the footer content", () => {
		render(<Footer />);
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
		expect(screen.getByAltText(/NextMovie Logo/i)).toBeInTheDocument();
		expect(screen.getByText(/All rights reserved./i)).toBeInTheDocument();
	});

	it("renders the GitHub and LinkedIn icons with correct links", () => {
		render(<Footer />);
		const githubLink = screen.getByLabelText(/GitHub/i);
		const linkedinLink = screen.getByLabelText(/LinkedIn/i);

		expect(githubLink).toHaveAttribute(
			"href",
			"https://github.com/samuel-un"
		);
		expect(linkedinLink).toHaveAttribute(
			"href",
			"https://www.linkedin.com/in/samuel-un/"
		);
	});

	it("renders the NextMovie logo with the correct image", () => {
		render(<Footer />);
		const logo = screen.getByAltText(/NextMovie Logo/i);
		expect(logo).toHaveAttribute(
			"src",
			"https://res.cloudinary.com/dgbngcvkl/image/upload/v1749109801/NextMovie_logo_letras_y_icono_pmb1av.png"
		);
	});
});
