import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

import Trip from "../../src/pages/Trip";

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
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../src/components/trip-planning/TripModal", () => ({
  default: (props: any) => {
    const submitHandler =
      props.onTripCreated || props.onSuccess || props.onSubmit;

    if (!props.isOpen) return null;

    return (
      <div data-testid="mock-modal">
        <button
          data-testid="confirm-trip-btn"
          onClick={() => {
            if (typeof submitHandler === "function") {
              submitHandler(mockNewTripData);
            }
          }}
        >
          Confirm Mock Trip
        </button>

        <button
          data-testid="confirm-day-trip-btn"
          onClick={() => {
            if (typeof submitHandler === "function") {
              submitHandler(mockDayTripData);
            }
          }}
        >
          Confirm Day Trip
        </button>
      </div>
    );
  },
}));

const mockNewTripData = {
  id: 123,
  destination: "Paris",
  start_date: "2023-10-01",
  end_date: "2023-10-03",
  budget: "1000",
  travelers: 2,
  trip_members: [],
};

const mockDayTripData = {
  id: 124,
  destination: "Day Trip Beach",
  start_date: "2023-10-01",
  end_date: "2023-10-01",
  budget: "50",
  travelers: 1,
  trip_members: [],
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
    expect(
      screen.getByRole("button", { name: /Start planning/i }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
  });

  it("opens the modal when start button is clicked", () => {
    renderComponent();
    const startBtn = screen.getByRole("button", { name: /Start planning/i });
    fireEvent.click(startBtn);
    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
  });

  it("navigates to /during when a trip is successfully created", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Start planning/i }));

    fireEvent.click(screen.getByTestId("confirm-trip-btn"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/during");
    });

    expect(localStorage.setItem).toHaveBeenCalledWith("currentTripId", "123");
  });

  it("navigates correctly for a single-day trip", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Start planning/i }));
    fireEvent.click(screen.getByTestId("confirm-day-trip-btn"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/during");
    });

    expect(localStorage.setItem).toHaveBeenCalledWith("currentTripId", "124");
  });
});
