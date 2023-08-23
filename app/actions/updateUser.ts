import axios from "axios";

interface UserUpdateData {
  id: string;
  role: string;
  ustate: string;
}

export async function updateUser(data: UserUpdateData) {
  try {
    const response = await axios.patch(`/api/updateuser/${data.id}`, {
      role: data.role,
      ustate: data.ustate,
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error("Failed to update user");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("An error occurred while updating user");
  }
}
