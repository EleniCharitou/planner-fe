import { User } from "../../types";

interface ProfileDisplayProps {
  user: User;
  onEdit: () => void;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ user, onEdit }) => {
  return (
    <div className="flex flex-col gap-4 text-lg">
      <p>
        <strong className="text-gray-700 mr-2">First Name:</strong>
        {user.name}
      </p>
      <p>
        <strong className="text-gray-700 mr-2">Last Name:</strong>
        {user.last_name}
      </p>
      <p>
        <strong className="text-gray-700 mr-2">Email:</strong>
        {user.email}
      </p>

      <div className="w-full flex justify-end mt-4">
        <button
          onClick={onEdit}
          className="px-6 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ProfileDisplay;
