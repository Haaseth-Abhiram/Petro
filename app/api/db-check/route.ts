import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await query("SELECT NOW() as current_time, version() as pg_version, current_database() as database;");
    const row = result.rows[0];

    return NextResponse.json({
      status: "connected",
      message: "Successfully connected to Supabase PostgreSQL database.",
      timestamp: row.current_time,
      database: row.database,
      version: row.pg_version.split(" on ")[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Supabase database.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
