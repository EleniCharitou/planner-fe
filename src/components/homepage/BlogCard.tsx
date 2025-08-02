import { Link } from "react-router-dom";
import { BlogDetails } from "../../types";

interface BlogCardProps {
  blog: BlogDetails;
}
const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const blogContent = blog.content.substring(0, 80) + " ...";

  const baseURL = "http://127.0.0.1:8000";
  const imageUrl = blog.picture ? `${baseURL}${blog.picture}` : undefined;

  return (
    <div className="flex-1 max-w-60 rounded-xl shadow bg-amber-50 p-1 flex flex-col">
      <img
        className="rounded-xl w-full h-40 object-cover mb-2"
        src={imageUrl}
        alt={blog.title}
      />
      <h5 className="mb-2 text-teal-950 font-bold tracking-tight text-sm leading-tight flex-grow">
        {blog?.title}
      </h5>
      {/* <p className="mb-3 font-normal text-gray-700">{blogContent}</p> */}
      <Link
        to={`/blogs/${blog.slug}`}
        className="text-end text-sm font-medium text-teal-500 hover:text-teal-800 p-1 mt-auto"
      >
        Read more
      </Link>
    </div>
  );
};

export default BlogCard;
