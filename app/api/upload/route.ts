import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

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

    const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const filename = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      urls.push(`/api/uploads/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return NextResponse.json({ error: "Ошибка загрузки файла." }, { status: 500 });
  }
}
