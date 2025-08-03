import Trip from "./pages/Trip";
import During from "./pages/During";
import Memories from "./pages/Memories";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AddBlogPage from "./pages/AddBlogPage";
import PageNotFound from "./pages/PageNotFound";
import DetailPage from "./pages/DetailPage";
import EditBlogPage from "./pages/EditeBlogPage";
import axios from "axios";
import { BlogDetails } from "./types";
import { toast } from "react-toastify";
import NewMainLayout from "./new_pages/NewMainLayout";
import Homepage from "./new_pages/Homepage";
import AllBlogsPage from "./pages/AllBlogsPage";

const App = () => {
  const createBlog = (data: Omit<BlogDetails, "id" | "slug">) => {
    axios
      .post("http://127.0.0.1:8000/api/posts/", data)
      .then((res) => {
        toast.success("Blog added successfully!");
      })
      .catch((err) => console.log(err.message));
  };

  const editBlog = (
    data: Omit<BlogDetails, "id" | "slug">,
    slug: string | undefined
  ) => {
    axios
      .put(`http://127.0.0.1:8000/api/posts/${slug}/`, data)
      .then(() => {
        toast.success("Blog updated successfully!");
      })
      .catch((err) => console.log(err.message));
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NewMainLayout />}>
        <Route index element={<Homepage />} />
        <Route path="/program" element={<Trip />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/during" element={<During />} />
        <Route path="/articles" element={<AllBlogsPage />} />
        <Route
          path="/add-blog"
          element={<AddBlogPage createBlog={createBlog} />}
        />
        <Route path="/blogs/:slug" element={<DetailPage />} />
        <Route
          path="/blogs/edit/:slug"
          element={<EditBlogPage editBlog={editBlog} />}
        />

        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  );
};

export default App;
