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
import LoginPage from "./new_pages/LoginPage";
import { toast } from "react-toastify";
import NewMainLayout from "./new_pages/NewMainLayout";
import Homepage from "./new_pages/Homepage";
import AllBlogsPage from "./pages/AllBlogsPage";
import api from "./api";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  const createBlog = (data: FormData) => {
    return api
      .post(`/posts/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success("Blog added successfully!", res);
      })
      .catch((err) => {
        console.error(err.message);
        toast.error("Failed to add blog");
        throw err;
      });
  };

  const editBlog = (data: FormData, slug: string | undefined) => {
    return api
      .patch(`/posts/${slug}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast.success("Article updated successfully!");
      })
      .catch((err) => {
        console.error(err.message);
        toast.error("Failed to update Article");
        throw err;
      });
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NewMainLayout />}>
        <Route index element={<Homepage />} />
        <Route
          path="/program"
          element={
            <ProtectedRoute>
              <Trip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/memories"
          element={
            <ProtectedRoute>
              <Memories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/during"
          element={
            <ProtectedRoute>
              <During />
            </ProtectedRoute>
          }
        />
        <Route path="/articles" element={<AllBlogsPage />} />
        <Route
          path="/add-blog"
          element={
            <ProtectedRoute>
              <AddBlogPage createBlog={createBlog} />
            </ProtectedRoute>
          }
        />
        <Route path="/blogs/:slug" element={<DetailPage />} />
        <Route
          path="/blogs/edit/:slug"
          element={
            <ProtectedRoute>
              <EditBlogPage editBlog={editBlog} />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage initialView="login" />} />
        <Route
          path="/register"
          element={<LoginPage initialView="register" />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    ),
    {
      future: {
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      },
    }
  );
  return (
    <AuthProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </AuthProvider>
  );
};

export default App;
