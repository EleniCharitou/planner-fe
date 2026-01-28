import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AllBlogsPage, {
  truncateContent,
} from "../../../src/pages/blogs/AllBlogsPage";
import api from "../../../src/api";

vi.mock("../../../src/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("../../../src/components/Spinner", () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

const mockArticles = [
  {
    id: 1,
    title: "React Testing Guide",
    content: "Testing is crucial for stable apps.",
    author: "John Doe",
    author_username: "johndoe",
    created_at: "2023-10-01T10:00:00Z",
    slug: "react-testing-guide",
    picture: null,
  },
  {
    id: 2,
    title: "Travel to Albania",
    content: "Albania is a beautiful country with great food.",
    author: "Jane Smith",
    author_username: "janesmith",
    created_at: "2023-09-15T10:00:00Z",
    slug: "travel-albania",
    picture: "https://example.com/image.jpg",
  },
];

describe("AllBlogsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Helper Logic", () => {
    it("truncateContent cuts long text correctly", () => {
      const text = "Short text";
      expect(truncateContent(text, 50)).toBe(text);
      expect(truncateContent("Long text here", 5)).toBe("Long ...");
    });
  });

  describe("Component Rendering", () => {
    it("shows loading spinner initially", () => {
      (api.get as any).mockReturnValue(new Promise(() => {}));

      render(
        <MemoryRouter>
          <AllBlogsPage />
        </MemoryRouter>,
      );

      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("renders articles after API load", async () => {
      (api.get as any).mockResolvedValue({ data: mockArticles });

      render(
        <MemoryRouter>
          <AllBlogsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("React Testing Guide")).toBeInTheDocument();
      });

      expect(screen.getByText("Travel to Albania")).toBeInTheDocument();
      expect(screen.getByText(/by johndoe/i)).toBeInTheDocument();
    });

    it('shows "No Articles Found" when API returns empty list', async () => {
      (api.get as any).mockResolvedValue({ data: [] });

      render(
        <MemoryRouter>
          <AllBlogsPage />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("No Articles Found")).toBeInTheDocument();
      });
    });

    it("filters articles when searching", async () => {
      (api.get as any).mockResolvedValue({ data: mockArticles });

      render(
        <MemoryRouter>
          <AllBlogsPage />
        </MemoryRouter>,
      );

      await waitFor(() => screen.getByText("React Testing Guide"));

      const searchInput = screen.getByPlaceholderText(
        /Search articles by title/i,
      );
      fireEvent.change(searchInput, { target: { value: "Albania" } });

      expect(screen.getByText("Travel to Albania")).toBeInTheDocument();

      expect(screen.queryByText("React Testing Guide")).not.toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (api.get as any).mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter>
        <AllBlogsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching articles:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
