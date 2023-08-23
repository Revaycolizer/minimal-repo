
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
import Link from "next/link";

type Inputs = {
  email: string
  password: string
}

export default function Login(){
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<Inputs>({
        defaultValues: {
          email: '',
          password:'',
        },})
      const onSubmit: SubmitHandler<Inputs> = (data) => {
        setIsLoading(true);

        signIn('credentials', { 
            ...data, 
            redirect: false,
          })
          .then((callback) => {
            setIsLoading(false);
      
            if (callback?.ok) {
              toast.success('Logged in');
              router.push("/home");
            }
            
            if (callback?.error) {
              toast.error(callback.error);
            }
          });
      }
      
    
    //   console.log(watch("exampleRequired"))
    
    return(
        <section className="pt-24 flex justify-center items-center">
         <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        Sign In
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Enter your details to Sign In.
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col gap-6">
          <Input size="lg" label="Name" {...register("email", { required: true })} />
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
          Sign In
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Create an account?{" "}
          <Link href="/register" className="font-medium text-gray-900">
           Register
          </Link>
        </Typography>
        
      </form>
    </Card>
        </section>
    )
}