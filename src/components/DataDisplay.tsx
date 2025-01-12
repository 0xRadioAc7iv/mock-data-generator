import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DataDisplayProps {
  data: any[];
}

export default function DataDisplay({ data }: DataDisplayProps) {
  const [activeTab, setActiveTab] = useState("json");

  const renderJsonView = () => {
    console.log(data);
    return (
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
        <code className="language-json">{data}</code>
      </pre>
    );
  };

  const renderTableView = () => {
    if (data.length === 0) return <p>No data available</p>;

    const headers = Object.keys(data[0]);

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
            {data.map((row, index) => (
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
    <div className="mb-4">
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
