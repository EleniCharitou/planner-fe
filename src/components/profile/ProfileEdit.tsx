import { UpdateProfileData } from "../../types";
import EyeIcon from "../../utilities/EyeIcon";

const inputClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500";

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
    <form onSubmit={onSave} className="flex flex-col min-w-4">
      <div className="bg-slate-100 rounded-t-none rounded-xl px-8 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold text-slate-500">ACCOUNT DETAILS</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="text-xs text-slate-500 mb-1 block"
              >
                FIRST NAME
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
                className="text-xs text-slate-500 mb-1 block"
              >
                LAST NAME
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

            <div className="col-span-2">
              <label
                htmlFor="email"
                className="text-xs text-slate-500 mb-1 block"
              >
                EMAIL
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
          </div>
        </div>

        <div className="border-t border-slate-300 pt-5 flex flex-col gap-4">
          <div>
            <p className="text-xs font-bold text-slate-500">CHANGE PASSWORD</p>
            <p className="text-xs text-slate-500 bg-slate-200 rounded-md p-1 mt-1">
              Leave blank if you do not want to change it.
            </p>
          </div>

          {(["current", "new", "confirm"] as const).map((field) => {
            const labelMap: Record<typeof field, string> = {
              current: "CURRENT PASSWORD",
              new: "NEW PASSWORD",
              confirm: "CONFIRM PASSWORD",
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
                  className="text-xs text-slate-500 mb-1 block"
                >
                  {labelMap[field]}
                </label>
                <div className="relative">
                  <input
                    id={nameMap[field]}
                    type={showPasswords[field] ? "text" : "password"}
                    name={nameMap[field]}
                    value={profile[nameMap[field]] ?? ""}
                    onChange={onChange}
                    className={`${inputClasses} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => onTogglePassword(field)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-teal-600"
                  >
                    <EyeIcon visible={showPasswords[field]} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-300 transition-all font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileEdit;
