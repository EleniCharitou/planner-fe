import { UpdateProfileData, User } from "../types";

export interface UpdateProfileResponse {
  user: User;
  detail: string;
}

export function validatePasswordChange(
  profile: UpdateProfileData,
): string | null {
  if (profile.new_password || profile.confirm_password) {
    if (!profile.current_password) {
      return "Please enter your current password to set a new one.";
    }
    if (profile.new_password !== profile.confirm_password) {
      return "Your new passwords do not match.";
    }
  }
  return null;
}

export function buildProfilePayload(
  profile: UpdateProfileData,
): UpdateProfileData {
  return {
    name: profile.name,
    last_name: profile.last_name,
    email: profile.email,
    ...(profile.new_password && {
      current_password: profile.current_password,
      new_password: profile.new_password,
      confirm_password: profile.confirm_password,
    }),
  };
}

// Sends a PATCH request to update the user's profile.
export async function updateUserProfile(
  payload: UpdateProfileData,
): Promise<UpdateProfileResponse> {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/users/user`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update profile");
  }

  return data as UpdateProfileResponse;
}
