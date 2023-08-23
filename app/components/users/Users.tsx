"use client"
import { useState } from "react";
import Button from "../button/Button";
import axios from "axios";
import toast from "react-hot-toast";
import {useRouter} from 'next/navigation'
import { updateUser } from "@/app/actions/updateUser";


interface Props {
  name: string;
  email: string;
  ustate: string;
  role: string;
  id:string;
}

export default function Users({ user }: { user: Props }) {
    const router = useRouter()
    const [userUpdated, setUserUpdated] = useState(false);
    const [updatedUser, setUpdatedUser] = useState<Props | null>(null);
    const [originalUser, setOriginalUser] = useState<Props>(user);
  const [open, setOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({
    role: user.role,
    ustate: user.ustate,
  });

  const handleForm = () => {
    setOpen(!open);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedUser({
      ...editedUser,
      role: event.target.value,
    });
  };

  const handleUstateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedUser({
      ...editedUser,
      ustate: event.target.value,
    });
  };

  const handleSubmit = async() => {
    try {
    // const response = await axios.patch(`/api/updateuser/${user.id}`, {
    // ustate: editedUser.ustate,
    // role: editedUser.role,
    //     });
    
    //     if (response.data) {
    //       setUpdatedUser(response.data); 
    //       toast.success("User updated successfully");
    //       setOpen(false);
    //     } else {
    //       toast.error("Failed to update user");
    //     }

    await updateUser({
      id: user.id,
      role: editedUser.role,
      ustate: editedUser.ustate,
    });

    setUpdatedUser({
      ...originalUser,
      role: editedUser.role,
      ustate: editedUser.ustate,
    });
    router.refresh()
    toast.success("User updated successfully")
    setOpen(false)
    
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("An error occurred while updating user");
      }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/updateuser/${user.id}`);

      if (response.data) {
        console.log(response.data);
        toast.success("User deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting user");
    }
  };

  return (
    <main className="py-2">
      
       {updatedUser ? (
        <div>
          <p>Name: {updatedUser.name}</p>
          <p>Email: {updatedUser.email}</p>
          <p>Role: {updatedUser.role}</p>
          <p>User State: {updatedUser.ustate}</p>
          <div className="flex flex-col gap-2">
          <Button onClick={handleForm}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      ) : (
        <div>
          <p>Name: {originalUser.name}</p>
          <p>Email: {originalUser.email}</p>
          <p>Role: {originalUser.role}</p>
          <p>User State: {originalUser.ustate}</p>
          <div className="flex flex-col gap-2">
          <Button onClick={handleForm}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      )}

      {open && (
        <div>
          <select value={editedUser.role} onChange={handleRoleChange}>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
          <select value={editedUser.ustate} onChange={handleUstateChange}>
            <option value="BLOCKED">BLOCKED</option>
            <option value="NON_BLOCKED">NON_BLOCKED</option>
          </select>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      )}
    </main>
  );
}
