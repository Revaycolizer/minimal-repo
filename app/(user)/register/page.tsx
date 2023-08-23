
"use client"
import { useForm, SubmitHandler } from "react-hook-form"
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
  } from "@material-tailwind/react";
  import { signIn } from 'next-auth/react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

type Inputs = {
  name: string
  email: string
  password: string
}

export default function Register(){
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<Inputs>({
        defaultValues: {
          name: '',
          email: '',
          password:'',
        },})
      const onSubmit: SubmitHandler<Inputs> = (data) => {
        setIsLoading(true);

        axios.post('/api/register', data)
        .then(() => {
          toast.success('Registered!');
        })
        .catch((error) => {
          toast.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        })
      }
      
    
    //   console.log(watch("exampleRequired"))
    
    return(
        <section className="flex justify-center items-center">
         <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        Sign Up
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Enter your details to register.
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col gap-6">
          <Input size="lg" label="Name"  {...register("name", { required: true })} />
          {errors.name && <span>This field is required</span>}
          <Input size="lg" label="Email" {...register("email", { required: true })} />
          {errors.email && <span>This field is required</span>}
          <Input type="password" size="lg" label="Password" {...register("password", { required: true })} />
          {errors.password && <span>This field is required</span>}
        </div>
        <Checkbox
          label={
            <Typography
              variant="small"
              color="gray"
              className="flex items-center font-normal"
            >
              I agree the
              <a
                href="#"
                className="font-medium transition-colors hover:text-gray-900"
              >
                &nbsp;Terms and Conditions
              </a>
            </Typography>
          }
          containerProps={{ className: "-ml-2.5" }}
        />
        <Button className="mt-6" fullWidth type="submit">
          Register
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <a href="/register" className="font-medium text-gray-900">
            Sign In
          </a>
        </Typography>
        
      </form>
    </Card>
        </section>
    )
}