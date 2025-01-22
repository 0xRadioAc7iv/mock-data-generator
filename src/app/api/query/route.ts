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

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const responseStream = await model.generateContentStream(query);

        for await (const chunk of responseStream.stream) {
          const chunkText = chunk.text();
          console.log(chunkText);
          controller.enqueue(encoder.encode(chunkText));
        }

        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/json",
      "Transfer-Encoding": "chunked",
    },
  });

  // const response = await model.generateContent(query);
  // const text = response.response.text();

  // try {
  //   return NextResponse.json({ message: text }, { status: 200 });
  // } catch (error) {
  //   console.log(error);
  //   return NextResponse.json(
  //     { error: "Interval Server Error" },
  //     { status: 500 }
  //   );
  // }
}
