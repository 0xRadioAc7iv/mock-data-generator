import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface DataDisplayProps {
  data: string;
}

export default function DataDisplay({ data }: DataDisplayProps) {
  const [activeTab, setActiveTab] = useState("json");

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "The selected data has been copied to your clipboard.",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Error",
          description: "Failed to copy data to clipboard.",
          variant: "destructive",
        });
      }
    );
  };

  const renderJsonView = () => {
    const parsedData = JSON.parse(data);

    return (
      <pre
        className="bg-gray-100 p-4 rounded-md overflow-x-auto overflow-y-auto max-h-80"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {parsedData.map((item: any, index: number) => (
          <div
            key={index}
            className="mb-2 p-2 hover:bg-gray-200 cursor-pointer rounded"
            onClick={() => copyToClipboard(JSON.stringify(item, null, 2))}
          >
            <code className="language-json">
              {JSON.stringify(item, null, 2)}
            </code>
          </div>
        ))}
      </pre>
    );
  };

  const renderTableView = () => {
    const parsedData = JSON.parse(data);

    if (parsedData.length === 0) return <p>No data available</p>;

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
            {parsedData.map((row: any, index: number) => (
              <tr
                key={index}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => copyToClipboard(JSON.stringify(row, null, 2))}
              >
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
