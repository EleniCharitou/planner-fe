import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <ToastContainer />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
