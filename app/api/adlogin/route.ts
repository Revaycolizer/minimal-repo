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
        role: "ADMIN",
        ustate: "NON_BLOCKED"
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role:true,
      },
    });

    if (!user) {
      return new NextResponse("Admin not found", { status: 404 });
    }
    
    const sessionData = {
      id: user.id,
      email: user.email,
      name:user.name,
      image:user.image,
      role:user.role
    };

    const oneDay = 24 * 60 * 60 * 1000
  cookies().set('adminToken', user.id, { maxAge: 60 * 60 * 24 * 30 })
  const cookieStore = cookies()
  const authorization = cookieStore.get('adminToken')
  console.log(authorization)

    const sessionToken = JSON.stringify(sessionData);

    // setCookie('test', sessionToken ,{req,res, maxAge: 60 * 60 * 24})

    // Set the cookie with the session token
    const cookieValue = serialize("adminToken", sessionToken, {
      httpOnly: true, // The cookie is not accessible from JavaScript
      maxAge: 60 * 60 * 24 * 30, // Expires in 30 days
      path: "/", // Set the cookie for the whole domain
    });

    // Combine user data and cookie response
    const responseData = {
      user,
      cookieValue,
    };

    // Return the combined response
    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: {
         'Set-Cookie': cookieValue, },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
