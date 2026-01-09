import { toast } from "react-toastify";
import { BlogDetails } from "../types";

export const useShare = () => {
  const shareArticle = async (article: BlogDetails) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `Check out this article: ${article.title}`,
          url: window.location.href,
        });
        return true;
      } catch (err) {
        console.log("Error sharing:", err);
        return false;
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
        return true;
      } catch (err) {
        toast.error("Failed to copy link");
        return false;
      }
    }
  };

  return { shareArticle };
};
