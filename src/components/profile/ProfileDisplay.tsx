import { User } from "../../types";

interface ProfileDisplayProps {
  user: User;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ user }) => {
  return (
    <div className="flex flex-col min-w-4 text-lg">
      <div className="bg-slate-100 rounded-t-none rounded-xl px-8 py-4 flex flex-col gap-4">
        <p className="text-xs font-bold text-slate-500 mb-0.5">
          ACCOUNT DETAILS
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">FIRST NAME</p>
            <p className="text-sm font-medium text-slate-700">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">LAST NAME</p>
            <p className="text-sm font-medium text-slate-700">
              {user.last_name}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-slate-500 mb-0.5">EMAIL</p>
            <p className="text-sm font-medium text-slate-700">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
