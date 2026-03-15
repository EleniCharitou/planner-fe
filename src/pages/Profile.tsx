import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UpdateProfileData } from "../types";
import {
  buildProfilePayload,
  updateUserProfile,
  validatePasswordChange,
} from "../services/profileApi";
import ProfileEdit from "../components/profile/ProfileEdit";
import ProfileDisplay from "../components/profile/ProfileDisplay";

const EMPTY_PASSWORDS = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UpdateProfileData>({
    name: "",
    last_name: "",
    email: "",
    ...EMPTY_PASSWORDS,
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Sync local form state whenever the authenticated user changes or edit mode
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        ...EMPTY_PASSWORDS,
      });
    }
  }, [user, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFeedback({ type: "", message: "" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    const validationError = validatePasswordChange(profile);
    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      return;
    }

    try {
      const payload = buildProfilePayload(profile);
      const data = await updateUserProfile(payload);

      setUser(data.user);
      setFeedback({
        type: "success",
        message: data.detail || "Profile updated successfully!",
      });
      setProfile((prev) => ({ ...prev, ...EMPTY_PASSWORDS }));
      setIsEditing(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      console.error("Error saving profile:", error);
      setFeedback({ type: "error", message });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-br from-amber-100 via-teal-300 to-teal-600">
      <div className="w-[50%] max-w-2xl min-h-fit bg-amber-50 rounded-3xl p-8 mx-auto shadow-lg text-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-teal-900">User Profile</h2>

        {feedback.message && (
          <div
            className={`p-4 mb-6 rounded-lg font-medium ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {isEditing ? (
          <ProfileEdit
            profile={profile}
            showPasswords={showPasswords}
            onTogglePassword={handleTogglePassword}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          user && (
            <ProfileDisplay user={user} onEdit={() => setIsEditing(true)} />
          )
        )}
      </div>
    </div>
  );
};

export default Profile;
