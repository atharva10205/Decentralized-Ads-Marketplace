import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

async function uploadToS3(file: File, folder = "campaign-images"): Promise<string> {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileExtension = file.name.split(".").pop() || "jpg";
        const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        return fileUrl;

    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error("Failed to upload image");
    }
}

export async function POST(req: Request) {
    const formData = await req.formData();

    const image = formData.get("image") as File | null;
    const KeyWords = JSON.parse(formData.get("KeyWords") as string);
    const description = formData.get("description") as string;
    const selectedTags = JSON.parse(formData.get("selectedTags") as string);
    const input = formData.get("input") as string;
    const adID = formData.get("adID") as string;
    const Title = formData.get("Title") as string;

    if (!Title || !description || !selectedTags.length || (!KeyWords.length && !input)) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    const cleanTags = selectedTags.map((tag: string) =>
        tag.replace(/[^\p{L}\p{N}\s]/gu, "").trim()
    );

    let imageUrl: string | null = null;

    if (image && image instanceof File) {
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(image.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Please upload a valid image." },
                { status: 400 }
            );
        }


        if (image.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File size too large. Maximum 5MB allowed." },
                { status: 400 }
            );
        }

        imageUrl = await uploadToS3(image);
        if (input) {
            const res = await prisma.ad.update({

                where: {
                    id: adID
                },
                data: ({
                    title: Title,
                    Description: description,
                    Tags: cleanTags,
                    keywords: [input],
                    imageUrl: imageUrl,
                })
            })
        } else {
            const res = await prisma.ad.update({

                where: {
                    id: adID
                },
                data: ({
                    title: Title,
                    Description: description,
                    Tags: cleanTags,
                    keywords: KeyWords,
                    imageUrl: imageUrl,
                })
            })
        }
        return NextResponse.json({
            success: true,
            imageUrl: imageUrl
        });
    }
}