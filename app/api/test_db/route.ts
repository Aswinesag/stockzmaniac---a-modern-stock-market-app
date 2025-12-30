import { connectToDatabase } from "@/lib/database/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();
        return NextResponse.json({ success: true, message: "DB Connected 🚀" });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
