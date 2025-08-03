import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Search,
  Plus,
  Filter,
} from "lucide-react";
import axios from "axios";
import Spinner from "../components/Spinner";

interface BlogDetails {
  id: number;
  title: string;
  content: string;
  slug: string;
  author: string;
  picture: string | null;
  created_at?: string;
  updated_at?: string;
}

const AllBlogsPage = () => {
  const [articles, setArticles] = useState<BlogDetails[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<BlogDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all");

  const uniqueAuthors = React.useMemo(() => {
    const authors = articles.map((article) => article.author);
    return ["all", ...Array.from(new Set(authors))];
  }, [articles]);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterAndSortArticles();
  }, [articles, searchTerm, sortBy, selectedAuthor]);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/posts/");
      setArticles(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setLoading(false);
    }
  };

  const filterAndSortArticles = () => {
    let filtered = articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAuthor =
        selectedAuthor === "all" || article.author === selectedAuthor;

      return matchesSearch && matchesAuthor;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at || "").getTime() -
            new Date(b.created_at || "").getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + "...";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("newest");
    setSelectedAuthor("all");
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-8 text-blacke">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold mb-4">Travel Articles</h1>
                <p className="text-xl opacity-90 mb-2">
                  Discover amazing destinations and travel tips from our
                  community
                </p>
                <p className="text-lg opacity-75">
                  {articles.length} article{articles.length !== 1 ? "s" : ""}{" "}
                  available
                </p>
              </div>
              <div className="hidden lg:block">
                <BookOpen size="100px" className="opacity-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative text-black">
                <Search
                  size="20px"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search articles by title, author, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter size="18px" className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "oldest" | "title")
                  }
                  className="p-2 border border-gray-300 text-black rounded-lg 
                             focus:ring-1 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>

              {/* Author Filter */}
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="px-3 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {uniqueAuthors.map((author) => (
                  <option key={author} value={author}>
                    {author === "all" ? "All Authors" : author}
                  </option>
                ))}
              </select>

              {(searchTerm ||
                sortBy !== "newest" ||
                selectedAuthor !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-white bg-teal-500 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 flex justify-center lg:justify-end">
          <Link
            to="/add-blog"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 
                     text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 
                     transform hover:scale-105 hover:shadow-lg"
          >
            <Plus size="20px" />
            <span>Write New Article</span>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Spinner loading={loading} />
          </div>
        )}

        {!loading && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600 font-medium">
                {filteredArticles.length} article
                {filteredArticles.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedAuthor !== "all" && ` by ${selectedAuthor}`}
              </p>

              {filteredArticles.length > 0 && (
                <p className="text-sm text-gray-500">
                  Sorted by{" "}
                  {sortBy === "newest"
                    ? "newest first"
                    : sortBy === "oldest"
                    ? "oldest first"
                    : "title"}
                </p>
              )}
            </div>
            {/* No existing articles */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-20">
                <BookOpen size="80px" className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">
                  No Articles Found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedAuthor !== "all"
                    ? "No articles match your current filters. Try adjusting your search criteria."
                    : "No articles available yet."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  {(searchTerm || selectedAuthor !== "all") && (
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                  <Link
                    to="/add-blog"
                    className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 
                             text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    <Plus size="20px" />
                    <span>Write the First Article</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            {filteredArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl 
                             transition-all duration-300 transform hover:-translate-y-1 group flex flex-col h-full"
                  >
                    {/* Article Image */}
                    <div className="h-48 bg-gradient-to-br from-teal-400 to-teal-600 relative overflow-hidden">
                      {article.picture ? (
                        <img
                          src={article.picture}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen
                            size="60px"
                            className="text-white opacity-50"
                          />
                        </div>
                      )}

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                      {/* Reading time badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                          {estimateReadTime(article.content)} min read
                        </span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-teal-600 transition-colors">
                        <Link to={`/blogs/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>

                      {/* Content Preview */}
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3 flex-grow">
                        {truncateContent(article.content)}
                      </p>

                      {/* Author and Date */}
                      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <User size="16px" />
                          <span>by {article.author}</span>
                        </div>

                        {article.created_at && (
                          <div className="flex items-center space-x-2">
                            <Calendar size="16px" />
                            <span>{formatDate(article.created_at)}</span>
                          </div>
                        )}
                      </div>

                      {/* Read More Button - Now sticky at bottom */}
                      <Link
                        to={`/blogs/${article.slug}`}
                        className="inline-flex items-center space-x-1 text-teal-500 hover:text-teal-600 
                                 font-medium text-sm transition-colors group/link w-full justify-center
                                 py-2 border border-teal-500 rounded-lg hover:bg-teal-50 mt-auto"
                      >
                        <span>Read Full Article</span>
                        <ArrowRight
                          size="16px"
                          className="group-hover/link:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllBlogsPage;
