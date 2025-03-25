import { useNavigate } from "react-router";
import "../../style/Modal.css";

interface ModalProps {
  title: string;
  changeModal: () => void;
  deleteBlog: () => void;
}
const Modal: React.FC<ModalProps> = ({ title, changeModal, deleteBlog }) => {
  const navigate = useNavigate();

  const deleteCurrentBlog = () => {
    deleteBlog();
    changeModal();
    navigate("/home");
  };
  return (
    <div id="popup-modal" className="modal">
      <div className="modal-content">
        <button
          type="button"
          className="close-button"
          data-modal-hide="popup-modal"
          onClick={changeModal}
        >
          <svg
            className="close-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
        <div className="modal-body">
          <svg
            className="modal-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 className="modal-title">
            Are you sure you want to delete this blog - {title}?
          </h3>
          <button
            type="button"
            className="confirm-button"
            onClick={deleteCurrentBlog}
          >
            Yes, I'm sure
          </button>
          <button type="button" className="cancel-button" onClick={changeModal}>
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
