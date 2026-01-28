import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PageNotFound from "../../src/pages/PageNotFound";

describe("PageNotFound Integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <PageNotFound />
      </MemoryRouter>,
    );
  };

  it("renders 404 text and error messages", () => {
    renderComponent();

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText(/The page you're looking for doesn't exist/i),
    ).toBeInTheDocument();
  });

  it("contains correct navigation links", () => {
    renderComponent();

    const homeLink = screen.getByRole("link", { name: /Go to Homepage/i });
    expect(homeLink).toHaveAttribute("href", "/");

    const planLink = screen.getByRole("link", { name: /Plan Trip/i });
    expect(planLink).toHaveAttribute("href", "/program");
  });

  it('triggers browser history back when "Go Back" is clicked', () => {
    const backSpy = vi.spyOn(globalThis.history, "back");

    renderComponent();

    const backBtn = screen.getByRole("button", { name: /Go Back/i });
    fireEvent.click(backBtn);

    expect(backSpy).toHaveBeenCalledTimes(1);
  });
});
