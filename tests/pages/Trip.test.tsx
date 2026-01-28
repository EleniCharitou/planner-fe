import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import Trip from "../../src/pages/Trip";
import api from "../../src/api";

vi.mock("../../src/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn() },
}));

vi.mock("../../src/components/trip-planning/TripModal", () => ({
  default: ({ isOpen, onSuccess }: any) =>
    isOpen ? (
      <div data-testid="mock-modal">
        <button
          data-testid="confirm-trip-btn"
          onClick={() => onSuccess(mockNewTripData)}
        >
          Confirm Mock Trip
        </button>
      </div>
    ) : null,
}));

const mockNewTripData = {
  id: 123,
  destination: "Paris",
  start_date: "2023-10-01",
  end_date: "2023-10-03",
  budget: "1000",
  travelers: 2,
};

describe("Trip Page (Program) Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, "setItem");
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Trip />
      </MemoryRouter>,
    );
  };

  it("renders the start button initially", () => {
    renderComponent();
    expect(screen.getByText("Start planning your trip")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
  });

  it("opens the modal when start button is clicked", () => {
    renderComponent();

    const startBtn = screen.getByRole("button", {
      name: /Start planning your trip/i,
    });
    fireEvent.click(startBtn);

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
  });

  it("generates columns, saves data, and navigates on trip creation", async () => {
    (api.post as any).mockResolvedValue({ data: { id: 1, title: "Column" } });

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Start planning/i }));

    fireEvent.click(screen.getByTestId("confirm-trip-btn"));

    expect(screen.getByText("Creating your trip board...")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/during");
    });

    expect(api.post).toHaveBeenCalledTimes(4);

    expect(localStorage.setItem).toHaveBeenCalledWith("currentTripId", "123");
  });

  it("handles API errors gracefully", async () => {
    (api.post as any).mockRejectedValue(new Error("Network Error"));
    const alertSpy = vi.spyOn(globalThis, "alert").mockImplementation(() => {});
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Start planning/i }));
    fireEvent.click(screen.getByTestId("confirm-trip-btn"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining("failed to set up columns"),
      );
    });

    expect(mockNavigate).not.toHaveBeenCalled();

    alertSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
