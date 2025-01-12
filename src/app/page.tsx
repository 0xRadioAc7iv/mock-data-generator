"use client";

import { useState } from "react";
import SchemaInput from "../components/SchemaInput";
import DataDisplay from "../components/DataDisplay";
import InsertDataButton from "../components/InsertDataButton";

export default function Home() {
  const [schema, setSchema] = useState("");
  const [generatedData, setGeneratedData] = useState(null);

  const handleSchemaSubmit = async (submittedSchema: string) => {
    setSchema(submittedSchema);

    const res = await fetch("/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: schema }),
    });

    const body = await res.json();
    const data = JSON.parse(body.message);

    setGeneratedData(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot Data Generator</h1>
      <SchemaInput onSubmit={handleSchemaSubmit} />
      {generatedData && (
        <>
          <DataDisplay data={generatedData} />
          <InsertDataButton data={generatedData} />
        </>
      )}
    </div>
  );
}
