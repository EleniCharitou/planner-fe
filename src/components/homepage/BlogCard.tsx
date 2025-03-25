import { Link } from "react-router-dom";
import { BlogDetails } from "../../types";

interface BlogCardProps {
  blog: BlogDetails;
}
const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const blogContent = blog.content.substring(0, 150) + " ...";

  return (
    <div className="max-w-sm bg-white mb-6 border border-gray-200 rounded-lg shadow">
      <img
        className="rounded-t-lg"
        src="/docs/images/blog/image-1.jpg"
        alt=""
      />
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight">
          {blog?.title}
        </h5>
        <p className="mb-3 font-normal text-gray-700">{blogContent}</p>
        <Link
          to={`/blogs/${blog.slug}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Read more
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
