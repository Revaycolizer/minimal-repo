import { NextResponse,type NextRequest } from "next/server";
import prisma from "@/prisma/client";
import {Redis} from "@upstash/redis"
import bcrypt from "bcrypt";
import { verify,sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { serialize } from "cookie";
import { COOKIE_NAME } from "@/app/constants/cookie";


export const revalidate = 0;

// const redis = Redis.fromEnv();

const MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Email and password are required", { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email as string,
        role: "USER",
        ustate:"NON_BLOCKED",
      }, select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role:true,
        hashedPassword:true
      },
    });

    if (!user || !user.hashedPassword) {
      return new NextResponse("User not found", { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    // const member = await redis.set("user",user)
    // console.log(member)
    const secret = process.env.JWT_SECRET || "";
    

    const token = sign(
      {
        user,
      },
      secret,
      {
        expiresIn: MAX_AGE,
      }
    );

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
    };
    
    
    const response = {
      message: "Authenticated!",
    };
  
    const seralized = serialize(COOKIE_NAME, JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: MAX_AGE,
      path: "/",
    });
  
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      "Content-Type": "application/json" ,
        "Set-Cookie": seralized 
      },
    });

   
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function OPTIONS(req:Request){
return new Response('Successfully',{status:200, headers: { 
  'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type, Authorization',
"Content-Type": "application/json" ,
},})
}

export async function GET(req: Request, res: NextResponse) {
  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }


  

  // const member = await redis.get("user")

  // const useri = JSON.stringify(member)
  
  const usr = JSON.parse(token.value)
  
  // if(!usr || !member){
  //   return new Response("No user found", {status:404})
  // }
  
    try {

    
   
     
  
      const user = await prisma.user.findFirst({
        where:{
          email: usr.email,
          ustate: "NON_BLOCKED",
          role:"USER"
        },
        select:{
          id:true,
          email:true,
          role:true,
          image:true,
          name:true,
        }
      })
   
      return  NextResponse.json(user);
  
    } catch (error) {
      console.error("Error retrieving user token:", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
