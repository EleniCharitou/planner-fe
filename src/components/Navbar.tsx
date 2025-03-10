import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-violet-950 fixed w-full z-20 top-0 start-0">
      <div className="text-white text-xl max-w-screen-xl flex flex-wrap items-center justify-evenly mx-auto p-4">
        <Link to="/" className="bg-red-700 rounded-full p-2">
          Logo
        </Link>
        <Link to="/home"> Home</Link>
        <Link to="/program"> Program</Link>
        <Link to="/during"> During</Link>
        <Link to="/memories"> Memories</Link>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Link to="/add-blog">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add New Article
            </button>
          </Link>
        </div>

        <div>User</div>
      </div>
    </nav>
  );
};

export default Navbar;
