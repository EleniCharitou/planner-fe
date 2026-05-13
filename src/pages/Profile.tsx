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
import { Edit2 } from "lucide-react";

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
      <div className="w-[40%] max-w-2xl min-h-fit mx-auto">
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

        {user && (
          <div className="bg-teal-700 rounded-xl border border-teal-300">
            <div className="relative flex items-center justify-between p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-400 text-white text-4xl border-teal-200 border-3 gap-6 m-4">
                <span>{user.name.charAt(0).toUpperCase()}</span>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-teal-100 hover:text-teal-700 transition-colors text-sm text-medium inline-flex items-center gap-1 text-white border-1 border-teal-300 rounded-lg"
                >
                  Edit profile <Edit2 className="w-3.5 h-3.5 ml-1" />
                </button>
              )}
              {isEditing && (
                <p className="absolute top-0 right-0 text-sm text-slate-200 italic bg-teal-400/30 rounded-lg rounded-tl-none px-2 py-1">
                  Editing mode
                </p>
              )}
            </div>
            <p className="text-white text-left text-sm text-medium pl-6 -mt-4 m-2">
              {user.name} {user.last_name} <br />
              {user.email}
            </p>

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
              <ProfileDisplay user={user} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
