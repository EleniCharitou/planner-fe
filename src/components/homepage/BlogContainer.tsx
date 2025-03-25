import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import axios from "axios";
import { BlogDetails } from "../../types";
import Spinner from "../Spinner";

const BlogContainer = () => {
  const [blogs, setBlogs] = useState<BlogDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/posts/recent")
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <div className="container mx-auto mt-8 mb-8 px-4 flex flex-wrap justify-evenly">
      <Spinner loading={loading} />
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogContainer;
