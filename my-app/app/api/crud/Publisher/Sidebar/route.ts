import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await prisma.user.findUnique({
        where :{
            email : session.user.email
        },
        select:{
            email :true,
            image : true ,
            name : true,
            accent : true
        }
    })

    return  NextResponse.json({data})

}