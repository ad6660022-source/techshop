import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Файлы не выбраны" }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "techshop/products",
        transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
      });

      urls.push(result.secure_url);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return NextResponse.json({ error: "Ошибка загрузки. Проверьте настройки Cloudinary." }, { status: 500 });
  }
}
