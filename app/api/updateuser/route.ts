
import { NextResponse } from "next/server";

import prisma from '@/prisma/client';
import { checkAdmin } from "@/app/actions/getAdmin";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await req.json();
    const admin = await getCurrentUser();
    const {  ustate, role } = body;

    if (!params.userId) {
      return new NextResponse("Companion ID required", { status: 400 });
    }

    if (!admin || !admin.id || !admin.name) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!ustate || !role ) {
      return new NextResponse("Missing required fields", { status: 400 });
    };

    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return new NextResponse("Admin required", { status: 403 });
    }

    const user = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        // ustate:user.ustate
        ustate,
        role,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.delete({
      where: {
        id: params.userId
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
