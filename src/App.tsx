import Trip from "./pages/Trip";
import During from "./pages/During";
import Memories from "./pages/Memories";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import AddBlogPage from "./pages/AddBlogPage";
import PageNotFound from "./pages/PageNotFound";
import DetailPage from "./pages/DetailPage";
import EditBlogPage from "./pages/EditeBlogPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/program" element={<Trip />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/during" element={<During />} />
        <Route path="/add-blog" element={<AddBlogPage />} />
        <Route path="/blogs/slug" element={<DetailPage />} />
        <Route path="/blogs/edit/slug" element={<EditBlogPage />} />

        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  );
};

export default App;
