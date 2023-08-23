
import { NextResponse } from "next/server";
import { checkAdmin } from "@/app/actions/getAdmin";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const admin = await getCurrentUser();
    const { src, name, description} = body;

    if (!admin || !admin.id || !admin.name) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

    if (!src || !name || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    };

    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return new NextResponse("Admin required", { status: 403 });
    }

    const post = await prisma.post.create({
      data: {
        userId: admin.id,
        src,
        name,
        description,
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log("[POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
