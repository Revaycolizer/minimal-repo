import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const posts = await prisma.post.findMany();
    console.log(posts)
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return  new NextResponse("Internal Error", { status: 500 });
  }
}
