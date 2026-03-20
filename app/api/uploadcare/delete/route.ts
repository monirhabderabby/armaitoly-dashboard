// app/api/uploadcare/delete/route.ts

import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from "@uploadcare/rest-client";
import { NextRequest, NextResponse } from "next/server";

const authSchema = new UploadcareSimpleAuthSchema({
  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_KEY!,
  secretKey: process.env.UPLOADCARE_SECRET_KEY!,
});

export async function DELETE(req: NextRequest) {
  try {
    const { uuid } = await req.json();

    if (!uuid || typeof uuid !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid file UUID." },
        { status: 400 },
      );
    }

    await deleteFile({ uuid }, { authSchema });

    return NextResponse.json({ success: true, uuid });
  } catch (err) {
    console.error("[Uploadcare] Delete failed:", err);
    return NextResponse.json(
      { error: "Failed to delete file." },
      { status: 500 },
    );
  }
}
