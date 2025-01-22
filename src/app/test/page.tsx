"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const Test = () => {
  const [data, setData] = useState("");

  const handleSubmit = async () => {
    const response = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ query: "users (name)" + "Generate only 5 rows." }),
    });

    if (!response.body) {
      console.error("ReadableStream not supported");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = "";

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      if (value) {
        buffer += decoder.decode(value, { stream: true });
      }

      setData(buffer);
    }
  };

  return (
    <div>
      <Button onClick={handleSubmit}>Get Data</Button>
      <div className="bg-gray-500 p-4 m-4">{data && <pre>{data}</pre>}</div>
    </div>
  );
};

export default Test;
