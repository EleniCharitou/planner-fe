import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Homepage from "../../../src/pages/home/Homepage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../src/components/homepage/BlogContainer", () => ({
  default: () => <div data-testid="blog-container">Mocked Blog List</div>,
}));

describe("Homepage Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Homepage />
      </MemoryRouter>,
    );
  };

  it("renders the main welcome text and instructions", () => {
    renderComponent();

    expect(
      screen.getByText(/Your space to plan and track your next trip/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Organize everything in a Kanban board/i),
    ).toBeInTheDocument();
  });

  it('renders the "Plan your trip" button and handles navigation', async () => {
    renderComponent();

    const planButton = screen.getByRole("button", { name: /Plan your trip/i });
    expect(planButton).toBeInTheDocument();

    fireEvent.click(planButton);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/program");
  });

  it("renders the mocked BlogContainer", () => {
    renderComponent();
    expect(screen.getByTestId("blog-container")).toBeInTheDocument();
  });

  it("contains the correct link to articles", () => {
    renderComponent();

    const link = screen.getByRole("link", { name: /Explore more articles/i });
    expect(link).toHaveAttribute("href", "/articles");
  });

  it('renders the "Generate video" button as disabled/inactive visually', () => {
    renderComponent();

    const videoButton = screen.getByRole("button", {
      name: /Generate your memory video/i,
    });

    expect(videoButton).toHaveClass("hover:cursor-not-allowed");
  });
});
