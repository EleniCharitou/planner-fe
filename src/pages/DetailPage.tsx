import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BlogDetails } from "../types";
import Spinner from "../components/Spinner";
import { ArrowLeft, BookOpen, Clock, Share2, User } from "lucide-react";
// import Modal from '../components/Modal'

const DetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("No article specified");
      setLoading(false);
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/posts/${slug}/`)
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

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: `Check out this article: ${article.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      //Copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex justify-center items-center">
        <Spinner loading={loading} />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-amber-50 flex justify-center items-center">
        <div className="text-center">
          <BookOpen size="80px" className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Article Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            {error || "The article you're looking for doesn't exist."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 
                     text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <ArrowLeft size="20px" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section with Image */}
      <div className="relative h-96 bg-gradient-to-br from-teal-400 to-teal-600 overflow-hidden">
        {article.picture ? (
          <>
            <img
              src={`${article.picture}`}
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

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
        <article className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8 pb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-2">
                <User size="18px" className="text-teal-500" />
                <span className="font-medium">by {article.author}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock size="18px" className="text-teal-500" />
                <span>{estimateReadTime(article.content)} min read</span>
              </div>
              <button
                onClick={handleShare}
                className="inline-flex items-center absolute right-16 space-x-2 text-teal-500 hover:text-teal-700 
                         font-medium transition-colors hover:cursor-pointer"
              >
                <Share2 size="18px" />
                <span>Share</span>
              </button>
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
                {article.content}
              </div>
            </div>
          </div>
        </article>

        <div className="mt-8 mb-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 
                     text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 
                     transform hover:scale-105 hover:shadow-lg"
          >
            <ArrowLeft size="20px" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
