import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import During from "../../src/pages/During";

vi.mock("../../src/components/board/TripPlannerKanban", () => ({
  default: () => <div data-testid="kanban-board">Mocked Kanban Board</div>,
}));

describe("During Page Integration", () => {
  it("renders the Kanban board successfully", () => {
    render(<During />);

    expect(screen.getByTestId("kanban-board")).toBeInTheDocument();
  });
});
