import { NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";

export async function GET() {
  await inngest.send({
    name: "app/production.test",
    data: {
      ok: true,
      env: process.env.NODE_ENV,
      timestamp: Date.now(),
    },
  });

  return NextResponse.json({ sent: true });
}
