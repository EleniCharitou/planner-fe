import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DetailPage from "../../../src/pages/blogs/DetailPage";
import api from "../../../src/api";

// --- MOCKS ---

// 1. Mock the API
vi.mock("../../../src/api", () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

// 2. Mock Auth Context (User is logged in)
vi.mock("../../../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 123, username: "testuser" },
  }),
}));

// 3. Mock the "Share" hook
vi.mock("../../../src/utilities/useShare", () => ({
  useShare: () => ({ shareArticle: vi.fn() }),
}));

// 4. Mock Child Components
// (We render simple buttons to test the 'DetailPage' logic handles clicks correctly)
vi.mock("../../../src/components/blog/ArticleContent", () => ({
  default: ({ title, onDelete }: any) => (
    <div data-testid="article-content">
      <h1>{title}</h1>
      <button data-testid="delete-btn" onClick={onDelete}>
        Delete Article
      </button>
    </div>
  ),
}));

vi.mock("../../../src/sub-components/DeleteModal", () => ({
  default: ({ show, onConfirm }: any) =>
    show ? (
      <div data-testid="delete-modal">
        <button onClick={onConfirm}>Confirm Delete</button>
      </div>
    ) : null,
}));

vi.mock("../../../src/components/Spinner", () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

vi.mock("../../../src/components/blog/ErrorState", () => ({
  default: ({ error }: any) => <div>Error: {error}</div>,
}));

// --- TEST DATA ---
const mockArticle = {
  id: 1,
  title: "My Awesome Trip",
  content: "Content goes here",
  author: 123, // Matches mocked user ID
  author_username: "testuser",
  slug: "my-awesome-trip",
  picture: "http://img.com/pic.jpg",
};

describe("DetailPage Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter
        initialEntries={["/blogs/my-awesome-trip"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/blogs/:slug" element={<DetailPage />} />
        </Routes>
        <ToastContainer />
      </MemoryRouter>,
    );
  };

  it("shows loading spinner initially", () => {
    (api.get as any).mockReturnValue(new Promise(() => {})); // Never resolves
    renderComponent();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders article content on success", async () => {
    (api.get as any).mockResolvedValue({ data: mockArticle });

    renderComponent();

    // Wait for the mock API call to finish
    await waitFor(() => {
      expect(screen.getByText("My Awesome Trip")).toBeInTheDocument();
    });

    // Check if API was called with the right slug
    expect(api.get).toHaveBeenCalledWith("/posts/my-awesome-trip/");
  });

  it("shows error state when API fails", async () => {
    (api.get as any).mockRejectedValue(new Error("Not Found"));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("Error: Failed to load article"),
      ).toBeInTheDocument();
    });
  });

  it("handles the full delete flow successfully", async () => {
    (api.get as any).mockResolvedValue({ data: mockArticle });
    (api.delete as any).mockResolvedValue({}); // Mock successful delete

    renderComponent();

    // 1. Wait for article to load
    await waitFor(() => screen.getByTestId("delete-btn"));

    // 2. Click "Delete Article" (from our mocked ArticleContent)
    fireEvent.click(screen.getByTestId("delete-btn"));

    // 3. Expect Modal to appear
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();

    // 4. Click "Confirm Delete" inside the modal
    fireEvent.click(screen.getByText("Confirm Delete"));

    // 5. Verify API delete was called
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/posts/my-awesome-trip/");
    });
  });
});
