import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  show: boolean;
  articleTitle: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal = ({
  show,
  articleTitle,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <AlertTriangle className="text-red-600" size={24} />
        </div>
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
          Delete Article?
        </h3>
        <p className="text-gray-500 text-center mb-6">
          This action cannot be undone. This will permanently remove{" "}
          <span className="font-semibold">"{articleTitle}"</span>.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 hover:cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete Article"}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors hover:cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteModal;
