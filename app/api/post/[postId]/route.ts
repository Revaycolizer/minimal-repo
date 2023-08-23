



import { NextResponse } from "next/server";

import prisma from '@/prisma/client';
import { checkAdmin } from "@/app/actions/getAdmin";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const body = await req.json();
    const admin = await getCurrentUser();
    const {  name, description} = body;

    if (!params.postId) {
      return new NextResponse("User ID required", { status: 400 });
    }

    if (!admin || !admin.id || !admin.name) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !description ) {
      return new NextResponse("Missing required fields", { status: 400 });
    };

    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return new NextResponse("Admin required", { status: 403 });
    }

    const post = await prisma.post.update({
      where: {
        id: params.postId,
      },
      data: {
        name,
        description,
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log("[USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await prisma.post.delete({
      where: {
        id: params.postId
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log("[POST_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
