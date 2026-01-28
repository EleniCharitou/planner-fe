import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import NewMainLayout from "../../src/pages/NewMainLayout";

const mockLogout = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../../src/components/Footer", () => ({
  default: () => <div data-testid="footer">Mocked Footer</div>,
}));

describe("NewMainLayout Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLayout = () => {
    return render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <NewMainLayout />
      </MemoryRouter>,
    );
  };

  it("renders navigation links and footer", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: mockLogout,
    });

    renderLayout();

    expect(screen.getByText("Trip Planner")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("shows Login button when not authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: mockLogout,
    });

    renderLayout();

    expect(screen.getByText("Login | Sign Up")).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("shows User Name and Logout button when authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: "John Doe", email: "john@test.com" },
      logout: mockLogout,
    });

    renderLayout();

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    const logoutBtn = screen.getByRole("button", { name: /Logout/i });
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("toggles mobile menu correctly", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: mockLogout,
    });

    renderLayout();

    const toggleBtn = screen.getByLabelText("Toggle menu");

    fireEvent.click(toggleBtn);

    const homeLinks = screen.getAllByText("Home");
    expect(homeLinks.length).toBeGreaterThan(1);

    fireEvent.click(homeLinks[1]);

    expect(screen.getAllByText("Home").length).toBe(1);
  });
});
