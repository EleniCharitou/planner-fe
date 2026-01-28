import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "../../../src/pages/home/LoginPage";

vi.mock("../../../src/components/login-register/LoginForm", () => ({
  default: () => <div data-testid="login-form">Mocked Login Form</div>,
}));

vi.mock("../../../src/components/login-register/RegisterForm", () => ({
  default: () => <div data-testid="register-form">Mocked Register Form</div>,
}));

describe("LoginPage Integration", () => {
  it("renders Login view by default", () => {
    render(<LoginPage initialView="login" />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();

    expect(screen.queryByTestId("register-form")).not.toBeInTheDocument();

    const loginBtn = screen.getByRole("button", { name: "Login" });
    expect(loginBtn).toHaveClass("bg-teal-500");
  });

  it("renders Register view when specified by prop", () => {
    render(<LoginPage initialView="register" />);

    expect(screen.getByTestId("register-form")).toBeInTheDocument();
    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();

    const registerBtn = screen.getByRole("button", { name: "Register" });
    expect(registerBtn).toHaveClass("bg-teal-500");
  });

  it("toggles between forms when buttons are clicked", () => {
    render(<LoginPage initialView="login" />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();

    const registerBtn = screen.getByRole("button", { name: "Register" });
    fireEvent.click(registerBtn);

    expect(screen.getByTestId("register-form")).toBeInTheDocument();
    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();
    expect(registerBtn).toHaveClass("bg-teal-500");

    const loginBtn = screen.getByRole("button", { name: "Login" });
    fireEvent.click(loginBtn);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});
