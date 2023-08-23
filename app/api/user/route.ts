import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return  new NextResponse("Internal Error", { status: 500 });
  }
}
