import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { KeyWords, description, selectedTags, input, adID } = await req.json();

    console.log("KeyWords:", KeyWords);
    console.log("description:", description);
    console.log("selectedTags:", selectedTags);
    console.log("input:", input);
    console.log("adID:", adID);

    const cleanTags = selectedTags.map((tag: string) =>
        tag.replace(/[^\p{L}\p{N}\s]/gu, "").trim()
    );




    if (input) {
        console.log("taggggggggg")
        const res = await prisma.ad.update({
            
            where: {
                id: adID
            },
            data: ({
                Description: description,
                Tags: cleanTags,
                keywords: [input]
            })
        })
    } else {
        console.log("inputtttttttt")
        console.log("lengthhh" , selectedTags.length)

        const res = await prisma.ad.update({

            where: {
                id: adID
            },
            data: ({
                Description: description,
                Tags: cleanTags,
                keywords: KeyWords
            })
        })
    }


    return NextResponse.json({ success: true })

}