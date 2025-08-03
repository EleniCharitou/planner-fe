import { Link } from "react-router-dom";
import { BlogDetails } from "../../types";
import { BookOpen } from "lucide-react";

interface BlogCardProps {
  blog: BlogDetails;
}
const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const baseURL = "http://127.0.0.1:8000";
  const imageUrl = blog.picture ? `${baseURL}${blog.picture}` : undefined;

  return (
    <div className="flex-1 max-w-60 rounded-xl shadow bg-amber-50 flex flex-col">
      <div className="h-36 bg-gradient-to-br rounded-t-xl from-teal-400 to-teal-600 relative overflow-hidden">
        {blog.picture ? (
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size="60px" className="text-white opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <h5 className="p-2 text-teal-950 font-bold tracking-tight text-sm leading-tight flex-grow">
        <Link to={`/blogs/${blog.slug}`}>{blog?.title}</Link>
      </h5>
      <Link
        to={`/blogs/${blog.slug}`}
        className="text-end text-sm font-medium text-teal-500 hover:text-teal-800 p-2 mt-auto"
      >
        Read more
      </Link>
    </div>
  );
};

export default BlogCard;
