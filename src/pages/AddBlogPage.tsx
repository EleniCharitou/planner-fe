import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  PenTool,
  ArrowLeft,
  Save,
  Camera,
  X,
  Upload,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import estimateReadTime from "../utilities/readTime";

interface AddBlogPageProps {
  createBlog: (blog: FormData) => Promise<void>;
}

const AddBlogPage: React.FC<AddBlogPageProps> = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const author = user?.name;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, or WebP)");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert("Image size must be less than 5MB");
        return;
      }
      setPicture(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPicture(null);
    setPicturePreview(null);
    const fileInput = document.getElementById("picture") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (picture) {
      formData.append("picture", picture);
    }

    try {
      await createBlog(formData);
      navigate("/articles");
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4">Write New Article</h1>
                <p className="text-xl opacity-90">
                  Share your travel experiences and inspire others
                </p>
              </div>
              <div className="hidden lg:block">
                <PenTool size="80px" className="opacity-20" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Link
            to="/articles"
            className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 
                     font-medium transition-colors"
          >
            <ArrowLeft size="20px" />
            <span>Back to Articles</span>
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-8 text-center">
              <BookOpen size="48px" className="mx-auto text-teal-500 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Write Your Article
              </h2>
              <p className="text-gray-600">
                Fill in the details below to publish your travel story
              </p>
            </div>

            {(title || content || author || picture) && (
              <div className="mb-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="text-sm font-semibold text-teal-700 mb-2">
                  Article Preview
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-teal-600">
                  <span>
                    Title: {title ? `${title.length} characters` : "Not set"}
                  </span>
                  <span>
                    Content:{" "}
                    {content
                      ? `${
                          content.split(/\s+/).filter((word) => word.length > 0)
                            .length
                        } words`
                      : "0 words"}
                  </span>
                  <span>
                    Estimated read time:{" "}
                    {content ? `${estimateReadTime(content)} min` : "0 min"}
                  </span>
                  <span>Author: {author || "Not set"}</span>
                  <span>Image: {picture ? "Added" : "Not added"}</span>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="title"
                className="flex items-center space-x-2 text-gray-700 text-sm font-bold mb-3"
              >
                <FileText size="18px" className="text-teal-500" />
                <span>Article Title</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                placeholder="Enter an engaging title for your article..."
                required
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/200 characters
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="picture"
                className="flex items-center space-x-2 text-gray-700 text-sm font-bold mb-3"
              >
                <Camera size="18px" className="text-teal-500" />
                <span>Article Image</span>
                <span className="text-xs font-normal text-gray-500">
                  (Optional)
                </span>
              </label>

              {!picturePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
                  <div className="flex flex-col items-center space-y-4">
                    <Upload size="48px" className="text-gray-400" />
                    <div>
                      <label
                        htmlFor="picture"
                        className="cursor-pointer inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        <Camera size="18px" />
                        <span>Choose Image</span>
                      </label>
                      <input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Upload a beautiful image for your article</p>
                      <p className="text-xs mt-1">
                        Supports: JPEG, PNG, WebP • Max size: 5MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <img
                        src={picturePreview}
                        alt="Preview"
                        className="w-32 h-24 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-1">
                          Image Preview
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {picture?.name} (
                          {(picture?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                        </p>
                        <div className="flex space-x-2">
                          <label
                            htmlFor="picture"
                            className="cursor-pointer inline-flex items-center space-x-1 text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
                          >
                            <Camera size="16px" />
                            <span>Change Image</span>
                          </label>
                          <input
                            id="picture"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                          >
                            <X size="16px" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Adding an attractive image will make your article more engaging
                and help it stand out
              </p>
            </div>

            <div className="mb-8">
              <label
                htmlFor="content"
                className="flex items-center space-x-2 text-gray-700 text-sm font-bold mb-3"
              >
                <BookOpen size="18px" className="text-teal-500" />
                <span>Article Content</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400 resize-vertical"
                placeholder="Write your article content here... Share your travel experiences, tips, and stories that will inspire other travelers."
                required
                minLength={100}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Minimum 100 characters required</span>
                <span>{content.length} characters</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Link
                to="/articles"
                className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg
                 text-gray-700 hover:bg-gray-300 transition-all font-medium"
              >
                <span>Cancel</span>
              </Link>

              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r bg-teal-500 
                         text-white font-bold py-3 px-6 rounded-lg transition-colors hover:bg-teal-700
                         hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save size="20px" />
                    <span>Publish Article</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Writing Guidelines
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Write a descriptive and engaging title</li>
                <li>• Include practical tips and personal experiences</li>
                <li>• Use clear paragraphs and good structure</li>
                <li>• Minimum 100 characters for meaningful content</li>
                <li>
                  • Add a high-quality image to make your article more
                  attractive
                </li>
                <li>• Be authentic and share your unique perspective</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlogPage;
