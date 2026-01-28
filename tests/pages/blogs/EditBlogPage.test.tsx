import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditBlogPage from "../../../src/pages/blogs/EditeBlogPage";
import api from "../../../src/api";

vi.mock("../../../src/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

globalThis.URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock-url");
globalThis.URL.revokeObjectURL = vi.fn();

const mockExistingBlog = {
  title: "Original Title",
  content: "Original content description.",
  author: "John Doe",
  picture: "http://example.com/old-pic.jpg",
};

describe("EditBlogPage Integration", () => {
  const mockEditBlog = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter
        initialEntries={["/edit/my-slug"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="/edit/:slug"
            element={<EditBlogPage editBlog={mockEditBlog} />}
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("shows loading spinner initially", () => {
    (api.get as any).mockReturnValue(new Promise(() => {}));

    renderComponent();

    expect(
      screen.queryByDisplayValue("Original Title"),
    ).not.toBeInTheDocument();
  });

  it("fetches and populates the form with existing data", async () => {
    (api.get as any).mockResolvedValue({ data: mockExistingBlog });

    renderComponent();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/posts/my-slug/");
    });

    expect(screen.getByDisplayValue("Original Title")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Original content description."),
    ).toBeInTheDocument();
  });

  it("updates data and submits the form correctly", async () => {
    (api.get as any).mockResolvedValue({ data: mockExistingBlog });
    mockEditBlog.mockResolvedValue({});

    renderComponent();

    await waitFor(() => screen.getByDisplayValue("Original Title"));

    const titleInput = screen.getByDisplayValue("Original Title");
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });

    const saveBtn = screen.getByRole("button", { name: /Update Article/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockEditBlog).toHaveBeenCalledTimes(1);
    });

    const formData = mockEditBlog.mock.calls[0][0] as FormData;
    const slug = mockEditBlog.mock.calls[0][1];

    expect(formData.get("title")).toBe("Updated Title");
    expect(formData.get("content")).toBe("Original content description.");
    expect(slug).toBe("my-slug");

    expect(mockNavigate).toHaveBeenCalledWith("/articles");
  });

  it("handles file selection correctly", async () => {
    (api.get as any).mockResolvedValue({ data: mockExistingBlog });
    renderComponent();
    await waitFor(() => screen.getByDisplayValue("Original Title"));

    const fileInput = screen.getByLabelText(/Change Image/i);

    const newFile = new File(["(⌐■_■)"], "cool.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [newFile] } });

    expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(newFile);
  });
});
