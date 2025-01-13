import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DataDisplayProps {
  data: string;
}

export default function DataDisplay({ data }: DataDisplayProps) {
  const [activeTab, setActiveTab] = useState("json");

  const renderJsonView = () => {
    return (
      <pre
        className="bg-gray-100 p-4 rounded-md overflow-x-auto overflow-y-auto max-h-80"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        <code className="language-json">{data}</code>
      </pre>
    );
  };

  const renderTableView = () => {
    const parsedData = JSON.parse(data);

    if (data.length === 0) return <p>No data available</p>;

    const headers = Object.keys(parsedData[0]);

    return (
      <div className="overflow-x-auto overflow-y-auto max-h-96">
        <table className="min-w-full border border-border">
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
            {parsedData.map((row: any, index: any) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={`${index}-${header}`} className="py-2 px-4 border-b">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="json">JSON View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        <TabsContent value="json">{renderJsonView()}</TabsContent>
        <TabsContent value="table">{renderTableView()}</TabsContent>
      </Tabs>
    </div>
  );
}
