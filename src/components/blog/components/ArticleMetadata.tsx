import { Clock, User } from "lucide-react";

interface ArticleMetadataProps {
  author: string | number;
  readTime: number;
}

const ArticleMetadata = ({ author, readTime }: ArticleMetadataProps) => (
  <div className="flex space-x-2 md:space-x-4">
    <div className="flex items-center space-x-2">
      <User size="18px" className="text-teal-500" />
      <span className="font-medium">by {author}</span>
    </div>
    <div className="flex items-center space-x-2">
      <Clock size="18px" className="text-teal-500" />
      <span>{readTime} min read</span>
    </div>
  </div>
);
export default ArticleMetadata;
