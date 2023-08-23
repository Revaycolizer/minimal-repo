import { getServerSession } from "next-auth";
import { authOptions } from "../api/admin/auth";
import prisma from '@/prisma/client';

// const DAY_IN_MS = 86_400_000;

export const checkAdmin = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role =="USER") {
    return false;
  }

  const userAdmin = await prisma.user.findFirst({
    where: {
      email: session?.user.email,
    },
    select: {
      role: true,
    },
  })

  if (!userAdmin) {
    return false;
  }
  return true; 
};
