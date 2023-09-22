import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";
import { cookies } from 'next/headers'
import { serialize } from "cookie";
import { SEARCHED } from "@/app/constants/cookie";

export const revalidate = 0;
const MAX_AGE = 60 * 60 * 24 * 1;

export async function POST(req:NextRequest){

    try{
        const body = await req.json();
       const {name}=body;

       if (!name) {
        return new Response("Name of post is required", { status: 400 });
      }
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          name: {
            contains: name as string,
          },
        },
      ],
    }, include: {
        comments: {
        include:{
          user:{
            select:{
              name:true
            }
          }
        }
        },
        likes:{
          include:{
            user:{
              select:{
                id:true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }

  })
  const response = {
    message: "Post Found!",
  };

  const searched = serialize(SEARCHED, JSON.stringify(posts), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Set-Cookie": searched },
  });
  
    }catch(error){
        console.error("Error fetching user:", error);
        return new Response("Internal Error", { status: 500 });
    }
}


export async function GET(req:Request,res:Response){
  try{
    const cookieStore = cookies();

    const token = cookieStore.get(SEARCHED);
    
    const posts = JSON.parse(token!.value)

    console.log(posts)

    return NextResponse.json(posts)


  }catch(error){
       console.error(error);
  }
}
