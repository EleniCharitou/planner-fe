import { Edit, Share2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ArticleActionsProps {
  isAuthor: boolean;
  slug: string;
  onDelete: () => void;
  onShare: () => void;
}

const ArticleActions = ({
  isAuthor,
  slug,
  onDelete,
  onShare,
}: ArticleActionsProps) => (
  <div className="flex items-center space-x-2">
    {isAuthor && (
      <>
        <Link
          to={`/blogs/edit/${slug}`}
          className="flex items-center space-x-1 text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-lg hover:cursor-pointer"
        >
          <Edit size="18px" />
          <span className="hidden sm:inline">Edit</span>
        </Link>
        <button
          onClick={onDelete}
          className="flex items-center space-x-1 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg hover:cursor-pointer"
        >
          <Trash2 size="18px" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </>
    )}
    <button
      onClick={onShare}
      className="flex items-center space-x-1 text-teal-500 hover:bg-teal-50 px-3 py-2 rounded-lg hover:cursor-pointer"
    >
      <Share2 size="18px" />
      <span className="hidden sm:inline">Share</span>
    </button>
  </div>
);
export default ArticleActions;
