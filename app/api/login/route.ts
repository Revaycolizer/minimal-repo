import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";

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
        image: true
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
