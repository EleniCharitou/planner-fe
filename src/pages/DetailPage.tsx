import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BlogDetails } from "../types";
import Spinner from "../components/Spinner";
import { BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import ErrorState from "../components/blog/components/ErrorState";
import DeleteModal from "../sub-components/DeleteModal";
import ArticleContent from "../components/blog/components/ArticleContent";
import { useShare } from "../utilities/useShare";

const DetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { shareArticle } = useShare();

  const [article, setArticle] = useState<BlogDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError("No article specified");
      setLoading(false);
      return;
    }

    api
      .get(`/posts/${slug}/`)
      .then((res) => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.message);
        setError("Failed to load article");
        setLoading(false);
      });
  }, [slug]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/posts/${slug}/`);
      toast.success("Article deleted successfully");
      navigate("/articles");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete article");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleShareClick = () => {
    if (article) {
      setArticle(article);
      shareArticle(article);
    }
  };

  const isAuthor = article
    ? String(user?.id) === String(article.author)
    : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex justify-center items-center">
        <Spinner loading={loading} />
      </div>
    );
  }

  if (error || !article) {
    return (
      <ErrorState
        error={error || "The article you're looking for doesn't exist."}
      />
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <DeleteModal
        show={showDeleteModal}
        articleTitle={article.title}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <div className="relative h-96 bg-gradient-to-br from-teal-400 to-teal-600 overflow-hidden">
        {article.picture ? (
          <>
            <img
              src={article.picture}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size="120px" className="text-white opacity-30" />
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-6 -mt-20 relative z-10">
        <ArticleContent
          title={article.title}
          author={article.author_username || "no name"}
          content={article.content}
          slug={article.slug}
          isAuthor={isAuthor}
          onDelete={() => setShowDeleteModal(true)}
          onShare={handleShareClick}
        />
      </div>
    </div>
  );
};

export default DetailPage;
