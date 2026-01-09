import estimateReadTime from "../../../utilities/readTime";
import ArticleActions from "./ArticleActions";
import ArticleMetadata from "./ArticleMetadata";

interface ArticleContentProps {
  title: string;
  author: string | number;
  content: string;
  slug: string;
  isAuthor: boolean;
  onDelete: () => void;
  onShare: () => void;
}

const ArticleContent = ({
  title,
  author,
  content,
  slug,
  isAuthor,
  onDelete,
  onShare,
}: ArticleContentProps) => {
  const readTime = estimateReadTime(content);

  return (
    <article className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-8 pb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
          {title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-6 text-gray-600 border-b border-gray-200 pb-6">
          <ArticleMetadata author={author} readTime={readTime} />
          <ArticleActions
            isAuthor={isAuthor}
            slug={slug}
            onDelete={onDelete}
            onShare={onShare}
          />
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="prose prose-lg max-w-none">
          <div
            className="text-gray-700 leading-relaxed"
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              whiteSpace: "pre-wrap",
            }}
          >
            {content}
          </div>
        </div>
      </div>
    </article>
  );
};
export default ArticleContent;
