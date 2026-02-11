import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "./BlogCard";
import { BlogDetails } from "../../types";
import Spinner from "../Spinner";
import api from "../../api";

const BlogContainer = () => {
  const [blogs, setBlogs] = useState<BlogDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/posts/recent`)
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="absolute inset-0 z-10">
        <img
          src="/img-placeholder.jpg"
          alt="Landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <p className="text-white font-semibold text-xl drop-shadow-md">
            More adventures coming soon...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white text-left flex flex-col h-full animate-fade-in">
      <h2 className="text-2xl font-semibold mb-2">Useful articles:</h2>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.slice(0, 3).map((blog) => (
          <div key={blog.id} className="flex justify-center">
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>
      <Link
        to="/articles"
        className="flex items-center justify-center pt-2 text-white hover:cursor-pointer hover:text-teal-800 transition-colors font-medium"
      >
        Explore more articles
      </Link>
    </div>
  );
};

export default BlogContainer;
