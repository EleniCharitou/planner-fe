import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Type,
  AlignLeft,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import Spinner from "../components/Spinner";
import api from "../api";

interface EditBlogPageProps {
  editBlog: (blog: FormData, slug: string | undefined) => Promise<void>;
}

const EditBlogPage: React.FC<EditBlogPageProps> = ({ editBlog }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [currentPicture, setCurrentPicture] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/posts/${slug}/`)
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setAuthor(res.data.author);
        setCurrentPicture(res.data.picture);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching article:", err.message);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);

    if (selectedFile) {
      formData.append("picture", selectedFile);
    }

    try {
      await editBlog(formData, slug);
      navigate(`/articles`);
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex justify-center items-center">
        <Spinner loading={loading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to={`/blogs/${slug}`}
            className="flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            <ArrowLeft size="20px" className="mr-2" />
            Back to Article
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit Article</h1>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="h-4 w-full bg-gradient-to-r from-teal-400 to-teal-600"></div>

          <form onSubmit={handleSubmit} className="p-8 text-black">
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-4">
                  <ImageIcon size="16px" className="mr-2 text-teal-500" />
                  Article Cover Image
                </label>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="relative w-full md:w-64 h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {previewUrl || currentPicture ? (
                      <>
                        <img
                          src={previewUrl || currentPicture || ""}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        {previewUrl && (
                          <button
                            type="button"
                            onClick={removeSelectedFile}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon
                          size={32}
                          className="mx-auto text-gray-400 mb-2"
                        />
                        <p className="text-xs text-gray-500">
                          No image selected
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-3">
                      {currentPicture && !previewUrl
                        ? "Currently showing the saved image. Upload a new one to replace it."
                        : "Upload a high-resolution image to make your article stand out."}
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 bg-white border border-teal-500 text-teal-600 rounded-lg cursor-pointer hover:bg-teal-50 transition-colors font-medium shadow-sm"
                    >
                      <Upload size={18} className="mr-2" />
                      {currentPicture || previewUrl
                        ? "Change Image"
                        : "Upload Image"}
                    </label>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Type size="16px" className="mr-2 text-teal-500" />
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <AlignLeft size="16px" className="mr-2 text-teal-500" />
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all leading-relaxed"
                  required
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-4 px-6 rounded-lg hover:shadow-lg transition-all transform hover:scale-[1.01] hover:cursor-pointer"
                >
                  <Save size="20px" />
                  <span>Update Article</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlogPage;
