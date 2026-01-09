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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
      {loading ? (
        <div className="col-span-full flex justify-center py-10">
          <Spinner loading={loading} />
        </div>
      ) : (
        blogs.slice(0, 3).map((blog) => (
          <div className="flex justify-center">
            <BlogCard key={blog.id} blog={blog} />
          </div>
        ))
      )}
    </div>
  );
};

export default BlogContainer;
