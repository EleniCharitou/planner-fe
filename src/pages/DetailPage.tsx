import { FaRegPenToSquare } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { IoReturnUpBack } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import Modal from "../components/homepage/Modal";
import { useEffect, useState } from "react";
import axios from "axios";
import { BlogDetails } from "../types";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
// import Modal from '../components/Modal'

const DetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogDetails | null>(null);
  const [title, setTitle] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/posts/${slug}`)
      .then((res) => {
        setBlog(res.data);
        setTitle(res.data.title);
      })
      .catch((err) => err.message);
  }, []);

  const changeModal = () => {
    setShowModal((showModal) => !showModal);
  };

  const deleteBlog = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/posts/${slug}/`)
      .then(() => {
        toast.success("Blog deleted successfully!");
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="container mx-auto mt-20 px-4 py-8 border">
      <div className="max-w-2xl mx-auto">
        <Link to="/home">
          <span className="flex items-center">
            <IoReturnUpBack fontSize={25} />
            <p className="ml-1">Back</p>
          </span>
        </Link>

        <h1 className="text-4xl font-extrabold blog-title mt-4 mb-4">
          {blog ? blog.title : <Spinner loading={true} />}
        </h1>
        <span className="mb-4 flex items-center">
          <Link to={`/blogs/edit/${slug}`}>
            <button
              type="button"
              className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
            >
              <FaRegPenToSquare className="mr-2 text-xl" /> edit
            </button>
          </Link>

          <button
            type="button"
            className="flex items-center focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            data-modal-target="popup-modal"
            data-modal-toggle="popup-modal"
            onClick={changeModal}
          >
            <MdDelete className="mr-2 text-xl" /> Delete
          </button>
        </span>
        <div className="prose prose-lg blog-body text-justify">
          <p className="leading-8">{blog?.content}</p>
        </div>
      </div>

      {showModal && (
        <Modal
          title={title}
          changeModal={changeModal}
          deleteBlog={deleteBlog}
        />
      )}
    </div>
  );
};

export default DetailPage;
