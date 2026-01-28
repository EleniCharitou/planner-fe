import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AddBlogPage from "../../../src/pages/blogs/AddBlogPage";

vi.mock("../../../src/context/AuthContext", () => ({
  useAuth: () => ({
    user: { name: "Test Author" },
  }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AddBlogPage Integration", () => {
  const mockCreateBlog = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AddBlogPage createBlog={mockCreateBlog} />
      </MemoryRouter>,
    );
  };

  it("renders form elements correctly", () => {
    renderComponent();

    expect(screen.getByLabelText(/Article Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Article Content/i)).toBeInTheDocument();
    expect(screen.getByText("Write New Article")).toBeInTheDocument();
  });

  it('keeps "Publish" button disabled initially', () => {
    renderComponent();
    const publishBtn = screen.getByRole("button", { name: /Publish Article/i });
    expect(publishBtn).toBeDisabled();
  });

  it('enables "Publish" button only when inputs are valid', async () => {
    renderComponent();
    const titleInput = screen.getByLabelText(/Article Title/i);
    const contentInput = screen.getByLabelText(/Article Content/i);
    const publishBtn = screen.getByRole("button", { name: /Publish Article/i });

    expect(publishBtn).toBeDisabled();

    fireEvent.change(titleInput, { target: { value: "My New Trip" } });
    expect(publishBtn).toBeDisabled();

    const longContent = "A".repeat(101);
    fireEvent.change(contentInput, { target: { value: longContent } });

    expect(publishBtn).toBeEnabled();
  });

  it("submits the form and navigates on success", async () => {
    mockCreateBlog.mockResolvedValueOnce({});
    renderComponent();

    const titleInput = screen.getByLabelText(/Article Title/i);
    const contentInput = screen.getByLabelText(/Article Content/i);
    const publishBtn = screen.getByRole("button", { name: /Publish Article/i });

    fireEvent.change(titleInput, { target: { value: "Valid Title" } });

    const longContent = "This is valid content ".repeat(10);
    fireEvent.change(contentInput, { target: { value: longContent } });

    fireEvent.click(publishBtn);

    expect(screen.getByText(/Publishing.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockCreateBlog).toHaveBeenCalledTimes(1);
    });

    const formData = mockCreateBlog.mock.calls[0][0] as FormData;
    expect(formData.get("title")).toBe("Valid Title");
    expect(formData.get("content")).toContain("This is valid content");

    expect(mockNavigate).toHaveBeenCalledWith("/articles");
  });

  it("shows alerts for invalid image types", async () => {
    const alertSpy = vi.spyOn(globalThis, "alert").mockImplementation(() => {});
    renderComponent();

    const fileInput = screen.getByLabelText(/Choose Image/i);

    const invalidFile = new File(["hello"], "test.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining("valid image file"),
    );

    alertSpy.mockRestore();
  });
});
