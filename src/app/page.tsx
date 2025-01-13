"use client";

import InsertDataButton from "@/components/InsertDataButton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";

export default function Home() {
  const [schema, setSchema] = useState("");
  const [responseData, setResponseData] = useState("");
  const [activeTab, setActiveTab] = useState("json");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: schema }),
      });

      if (!res.ok) throw new Error("Error generating data! Please try again.");

      const body = await res.json();
      const data = body.message;

      setResponseData(data);
    } catch (error) {
      alert(error);
    }
  };

  const renderJsonView = () => {
    return (
      <pre
        className="bg-gray-100 p-4 rounded-md overflow-x-auto overflow-y-auto max-h-80"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        <code className="language-json">{responseData}</code>
      </pre>
    );
  };

  const renderTableView = () => {
    const dataArray = JSON.parse(responseData);

    if (dataArray.length === 0) return <p>No data available</p>;

    const headers = Object.keys(dataArray[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className="py-2 px-4 border-b text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataArray.map(
              (
                row: {
                  [x: string]:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<AwaitedReactNode>
                    | null
                    | undefined;
                },
                index: Key | null | undefined
              ) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td
                      key={`${index}-${header}`}
                      className="py-2 px-4 border-b"
                    >
                      {row[header]}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot Data Generator</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <Textarea
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          placeholder="Enter your schema here..."
          className="mb-2"
          rows={6}
        />
        <Button type="submit">Generate Data</Button>
      </form>
      {responseData.length !== 0 && (
        <div className="mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="json">JSON View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            <TabsContent value="json">{renderJsonView()}</TabsContent>
            <TabsContent value="table">{renderTableView()}</TabsContent>
          </Tabs>
          <InsertDataButton data={JSON.parse(responseData)} />
        </div>
      )}
    </div>
  );
}
