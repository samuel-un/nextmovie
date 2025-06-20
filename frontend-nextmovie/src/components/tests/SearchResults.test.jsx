import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import SearchResultsPage from "../SearchResultsPage";

beforeEach(() => {
	global.fetch = vi
		.fn()
		.mockResolvedValueOnce({
			json: async () => ({
				results: [
					{
						id: 1,
						title: "Test Movie",
						vote_average: 7.5,
						poster_path: "/poster.jpg",
						release_date: "2020-01-01",
						media_type: "movie",
					},
				],
			}),
		})
		.mockResolvedValueOnce({
			json: async () => ({ results: [] }),
		})
		.mockResolvedValueOnce({
			json: async () => ({
				results: {
					ES: {
						flatrate: [
							{
								provider_id: 8,
								provider_name: "Netflix",
								logo_path: "/netflix-logo.png",
							},
						],
					},
				},
			}),
		});
});

afterEach(() => {
	vi.clearAllMocks();
});

test("renders search results", async () => {
	render(
		<MemoryRouter initialEntries={["/search?query=test"]}>
			<SearchResultsPage />
		</MemoryRouter>
	);

	await waitFor(() => {
		expect(screen.getByText(/Search results for:/)).toBeInTheDocument();
		expect(screen.getByText(/Test Movie/)).toBeInTheDocument();
		expect(screen.getByText(/2020/)).toBeInTheDocument();
	});
});
