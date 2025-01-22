import { model } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const query = body.query;

  if (!query)
    return NextResponse.json(
      { error: "Please Provide a Query!" },
      { status: 400 }
    );

  const response = await model.generateContent(query);
  const text = response.response.text();

  try {
    return NextResponse.json({ message: text }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Interval Server Error" },
      { status: 500 }
    );
  }
}
