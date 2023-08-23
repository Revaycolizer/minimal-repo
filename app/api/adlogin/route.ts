import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";
import { serialize } from "cookie";
import {setCookie} from 'cookies-next'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest, res: NextResponse) {
  try {
  
  cookies().set({'adminToken', Revaycolizer,   httpOnly: true,
    path: '/',})
  const cookieStore = cookies()
  const authorization = cookieStore.get('adminToken')
  console.log(authorization)

   
    

    // Return the combined response
    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: {
         'Set-Cookie': Revaycolizer, },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
