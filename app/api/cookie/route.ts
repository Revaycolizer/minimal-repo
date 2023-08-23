import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers'
import { headers } from 'next/headers';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const cookieStore = cookies()
    const authorization = cookieStore.get('adminToken')
    const i = cookieStore.get('userToken')
   const user = JSON.parse(authorization!.value)

   req.cookies.get('adminToken')

    if (authorization) {
      console.log(authorization)
      console.log(i)
      console.log(new Headers(req.headers))
      return NextResponse.json(user)
      // return new NextResponse(JSON.parse(authorization.value), {
      //   status: 200,
      //   headers: { 
      //     'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      // 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      
      //    },
      // });
    } else {
      return new NextResponse("User token not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error retrieving user token:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
