"use client";

import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import SchemaInput from "@/components/SchemaInput";
import DataDisplay from "@/components/DataDisplay";
import DataActions from "@/components/DataActions";

export default function Home() {
  const [schema, setSchema] = useState("");
  const [generatedData, setGeneratedData] = useState(null);
  const [rowCount, setRowCount] = useState(10);

  const handleSchemaSubmit = async (submittedSchema: string, count: number) => {
    setSchema(submittedSchema);
    setRowCount(count);

    console.log(rowCount);

    const rowNumberGeneration = `Generate ONLY ${count} rows.`;

    const response = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ query: submittedSchema + rowNumberGeneration }),
    });

    const body = await response.json();
    const data = body.message;

    setGeneratedData(data);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="container mx-auto p-4 min-h-screen bg-background text-foreground">
        <h1 className="text-3xl font-bold mb-6">AI Data Generator</h1>
        <SchemaInput onSubmit={handleSchemaSubmit} />
        {generatedData && (
          <>
            <DataDisplay data={generatedData} />
            <DataActions data={generatedData} schema={schema} />
          </>
        )}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
