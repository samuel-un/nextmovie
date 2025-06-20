import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DetailPage from "../DetailPage";

import { vi } from "vitest";

vi.mock("axios", () => {
	const instance = {
		get: vi.fn(() => Promise.resolve({ data: {} })),
		interceptors: {
			request: {
				use: vi.fn(),
			},
		},
	};

	return {
		default: {
			create: vi.fn(() => instance),
			get: vi.fn(() => Promise.resolve({ data: {} })),
		},
	};
});

describe("DetailPage", () => {
	it("muestra 'Cargando...' al renderizarse inicialmente", () => {
		render(
			<MemoryRouter initialEntries={["/movie/123"]}>
				<Routes>
					<Route path="/:media_type/:id" element={<DetailPage />} />
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
	});
});
