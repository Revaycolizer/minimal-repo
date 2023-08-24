import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";
import { serialize } from "cookie";
import {setCookie} from 'cookies-next'
import { cookies } from 'next/headers'

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
        role:true
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const sessionData = {
      id: user.id,
      email: user.email,
      name:user.name,
      image:user.image,
      role:user.role
    };

    const oneDay = 24 * 60 * 60 * 1000

  const cookieStore = cookies()
  

    const sessionToken = JSON.stringify(sessionData);

    // setCookie('test', sessionToken ,{req,res, maxAge: 60 * 60 * 24})

    // Set the cookie with the session token
    const cookValue = serialize("userToken", sessionToken, {
     // The cookie is not accessible from JavaScript
      maxAge: 60 * 60 * 24 * 30, // Expires in 30 days
      path: "/", // Set the cookie for the whole domain
    });

    // Combine user data and cookie response
    const responseData = {
      user,
      cookValue,
    };
    
    cookies().set({name:'userToken', value: responseData.cookValue,  maxAge: 60 * 60 * 24 * 30 ,secure:false,httpOnly:false})
    const authorization = cookieStore.get('userToken')
  console.log(authorization)
    
    // Return the combined response
    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: {
         'Set-Cookie': cookValue, },
    });

    // return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const cookieStore = cookies()
    const authorization = cookieStore.get('userToken')
    const i = cookieStore.get('userToken')
   const user = JSON.parse(authorization!.value)

   const a = req.cookies.get('userToken')

    if (authorization) {
      console.log(authorization)
      console.log(i)
      console.log(a)
      console.log(new Headers(req.headers))
      return NextResponse.json(authorization)
    
    } else {
      return new NextResponse("User token not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error retrieving user token:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
