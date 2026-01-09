import { useEffect, useState } from "react";
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
        setLoading(false);
      })
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <div className="flex justify-start items-start gap-2 p-1">
      {loading ? (
        <div className="flex justify-center w-full">
          <Spinner loading={loading} />
        </div>
      ) : (
        blogs.slice(0, 3).map((blog) => <BlogCard key={blog.id} blog={blog} />)
      )}
    </div>
  );
};

export default BlogContainer;
