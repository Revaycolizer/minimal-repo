
"use client"

import { useForm, SubmitHandler } from "react-hook-form";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Posts from "@/app/components/posts/Post";
import AddedPost from "@/app/components/posts/Posts";
import { useRouter } from "next/navigation";

type Inputs = {
  name: string;
  description: string;
};

export default function AdUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [vfile, setVfile] = useState<File | null>(null);
 const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const load = toast.loading("Posting");
    try {
      setIsLoading(true);
  
      if (!vfile) {
        toast.error("Please select a video to upload");
        return;
      }
  
      
      const formData = new FormData();
      formData.append("file", vfile);
  
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dloouwccf/auto/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            upload_preset: "iqb6omil", 
          },
        }
      );
  
      if (!cloudinaryResponse.data.secure_url) {
        throw new Error("Failed to upload video to Cloudinary");
      }
  
      const cloudinaryUrl = cloudinaryResponse.data.secure_url;
  
      await axios.post("/api/post", {
        ...data,
        src: cloudinaryUrl,
      });
      toast.dismiss(load);
      router.refresh()
      toast.success("Post Uploaded successfully!");
    } catch (error) {
      toast.dismiss(load);
      console.error("Error uploading post:", error);
      toast.error("An error occurred while uploading the post");
    } finally {
      setIsLoading(false);
    }
  };
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (!file) return;
    setVfile(file[0]);
  };

  return (
    <section className="pt-12 flex justify-center items-center">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Create a Post
        </Typography>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            size="lg"
            label="Name"
            {...register("name", { required: true })}
          />
          {errors.name && <span>This field is required</span>}
          <input
            type="file"
            multiple={false}
            accept="video/*"
            onChange={onChange}
            required
          />
          
          <Input
            size="lg"
            label="Description"
            {...register("description", { required: true })}
          />
          {errors.description && <span>This field is required</span>}
          <Button
            className="mt-6"
            fullWidth
            type="submit"
            disabled={isLoading}
          >
            Post
          </Button>
        </form>
      </Card>


    </section>
  );
}
