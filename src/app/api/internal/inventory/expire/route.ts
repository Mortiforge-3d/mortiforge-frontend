import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { releaseExpiredReservations } from "../../../../../lib/inventory";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Scheduled job is not configured." },
      { status: 503 },
    );
  }

  const authorization = request.headers.get("authorization") ?? "";
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(authorization);

  const authorized =
    expected.length === received.length &&
    timingSafeEqual(expected, received);

  if (!authorized) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const result = await releaseExpiredReservations();

    return NextResponse.json({
      message: "Expired reservation cleanup completed.",
      ...result,
    });
  } catch (error) {
    console.error("Inventory expiry job failed:", error);

    return NextResponse.json(
      { error: "Inventory cleanup failed." },
      { status: 500 },
    );
  }
}
