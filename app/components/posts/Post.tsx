"use client"

import React, { useState } from "react";
import Button from "../button/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@material-tailwind/react";


interface Props {
  name: string;
  description: string;
  src: string;
  id: string;
}

export default function Posts({ post }: { post: Props }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [updatedPost, setUpdatedPost] = useState<Props | null>(null);
  const [originalPost, setOriginalPost] = useState<Props>(post);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({
    name: post.name,
    description: post.description,
  });

  const handleForm = () => {
    setOpen(!open);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPost({
      ...editedPost,
      name: event.target.value,
    });
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditedPost({
      ...editedPost,
      description: event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(`/api/post/${post.id}`, {
        name: editedPost.name,
        description: editedPost.description,
      });

      if (response.data) {
        setUpdatedPost(response.data)
        toast.success("Post updated successfully");
        setOpen(false);
      } else {
        toast.error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("An error occurred while updating post");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/deletepost/${post.id}`);

      if (response.data) {
        toast.success("Post deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting post");
    }
  };

  return (
    <main>
      <div>
        {/* <video src={post.src} />
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editedPost.name}
              onChange={handleNameChange}
            />
            <input
              type="text"
              value={editedPost.description}
              onChange={handleDescriptionChange}
            />
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleEditToggle}>Cancel</Button>
          </div>
        ) : (
          <div>
            <p>Name: {post.name}</p>
            <p>Description: {post.description}</p>
            <div className="flex flex-col gap-2">
              <Button onClick={handleEditToggle}>Edit</Button>
              <Button onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        )} */}
         {updatedPost ? (
        <div>
          <video src={updatedPost.src} controls />
          <p>Name: {updatedPost.name}</p>
          <p>Description: {updatedPost.description}</p>
          <div className="flex flex-col gap-2">
          <Button onClick={handleForm}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      ) : (
        <div>
           <video src={originalPost.src} controls />
          <p className="text-center font-extrabold">{originalPost.name}</p>
          <p>Description: {originalPost.description}</p>
          <div className="flex flex-col gap-2">
          <Button onClick={handleForm}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      )}

      {open && (
        <div className="py-2 flex flex-col gap-2">
          <Input
              type="text"
              value={editedPost.name}
              onChange={handleNameChange}
            />
            <Input
              type="text"
              value={editedPost.description}
              onChange={handleDescriptionChange}
            />
          <Button onClick={handleSave}>Save</Button>
        </div>
      )}
      </div>
    </main>
  );
}
