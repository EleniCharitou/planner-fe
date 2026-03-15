import { UpdateProfileData } from "../../types";
import EyeIcon from "../../utilities/EyeIcon";

const inputClasses =
  "w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow";

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}
interface ProfileEditProps {
  profile: UpdateProfileData;
  showPasswords: ShowPasswords;
  onTogglePassword: (field: keyof ShowPasswords) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({
  profile,
  showPasswords,
  onTogglePassword,
  onChange,
  onSave,
  onCancel,
}) => {
  return (
    <form onSubmit={onSave} className="flex flex-col gap-5">
        {/* Basic User Info */}
      <div>
        <label htmlFor="name" className="block font-semibold text-gray-700">
          First Name:
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={profile.name}
          onChange={onChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label
          htmlFor="last_name"
          className="block font-semibold text-gray-700"
        >
          Last Name:
        </label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          value={profile.last_name}
          onChange={onChange}
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-semibold text-gray-700">
          Email:
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={profile.email}
          onChange={onChange}
          className={inputClasses}
          required
        />
      </div>

      <hr className="my-2 border-gray-300" />

      {/* Change Password */}
      <div>
        <h3 className="text-xl font-bold text-teal-900">Change Password</h3>
        <p className="text-sm text-gray-600">
          Leave blank if you do not want to change it.
        </p>
      </div>

      {(["current", "new", "confirm"] as const).map((field) => {
        const labelMap: Record<typeof field, string> = {
          current: "Current Password",
          new: "New Password",
          confirm: "Confirm New Password",
        };
        const nameMap: Record<typeof field, keyof UpdateProfileData> = {
          current: "current_password",
          new: "new_password",
          confirm: "confirm_password",
        };

        return (
          <div key={field}>
            <label
              htmlFor={nameMap[field]}
              className="block font-semibold text-gray-700"
            >
              {labelMap[field]}:
            </label>
            <div className="relative mt-1">
              <input
                id={nameMap[field]}
                type={showPasswords[field] ? "text" : "password"}
                name={nameMap[field]}
                value={profile[nameMap[field]] ?? ""}
                onChange={onChange}
                className={`${inputClasses} mt-0 pr-10`}
              />
              <button
                type="button"
                onClick={() => onTogglePassword(field)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-600 focus:outline-none"
                aria-label={`${showPasswords[field] ? "Hide" : "Show"} ${labelMap[field].toLowerCase()}`}
              >
                <EyeIcon visible={showPasswords[field]} />
              </button>
            </div>
          </div>
        );
      })}

      {/* Button Options */}
      <div className="w-full flex justify-end gap-4 mt-2">
        <button
          type="submit"
          className="px-6 py-2 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileEdit;
