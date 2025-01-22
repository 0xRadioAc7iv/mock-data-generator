"use client";

import { useState } from "react";
import SchemaInput from "@/components/SchemaInput";
import DataDisplay from "@/components/DataDisplay";
import DataActions from "@/components/DataActions";

export default function Home() {
  const [schema, setSchema] = useState("");
  const [generatedData, setGeneratedData] = useState("");

  const handleSchemaSubmit = async (submittedSchema: string, count: number) => {
    setSchema(submittedSchema);

    const rowNumberGeneration = `Generate ONLY ${count} rows.`;
    const response = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ query: submittedSchema + rowNumberGeneration }),
    });

    if (!response.ok) {
      console.error("Error Generating Data");
      return;
    }

    const body = await response.json();
    const text = body.message;
    setGeneratedData(text);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">Mock Data Generator</h1>
      <SchemaInput onSubmit={handleSchemaSubmit} />
      {generatedData && (
        <>
          <DataDisplay data={generatedData} />
          <DataActions data={generatedData} schema={schema} />
        </>
      )}
    </div>
  );
}
