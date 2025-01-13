import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface DataActionsProps {
  data: string;
  schema: string;
}

export default function DataActions({ data, schema }: DataActionsProps) {
  const [dbType, setDbType] = useState("postgresql");

  const generateInsertQuery = () => {
    if (data.length === 0) return "";

    const tableName = "generated_data";
    const columns = Object.keys(data[0]).join(", ");

    switch (dbType) {
      case "postgresql":
      case "mysql":
        const parsedData = JSON.parse(data);
        const values = parsedData
          .map(
            (row: any) =>
              `(${Object.values(row)
                .map((value) =>
                  typeof value === "string" ? `'${value}'` : value
                )
                .join(", ")})`
          )
          .join(",\n");
        return `INSERT INTO ${tableName} (${columns})\nVALUES\n${values};`;

      case "mongodb":
        return `db.${tableName}.insertMany(${JSON.stringify(data, null, 2)});`;

      default:
        return "";
    }
  };

  const copyToClipboard = () => {
    const query = generateInsertQuery();
    navigator.clipboard.writeText(query).then(
      () => {
        toast({
          title: "Query copied to clipboard",
          description: `The ${dbType.toUpperCase()} INSERT query has been copied to your clipboard.`,
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Error",
          description: "Failed to copy query to clipboard.",
          variant: "destructive",
        });
      }
    );
  };

  const downloadData = (format: "json" | "csv") => {
    let content: string;
    let mimeType: string;
    let fileExtension: string;

    if (format === "json") {
      content = JSON.stringify(data, null, 2);
      mimeType = "application/json";
      fileExtension = "json";
    } else {
      const parsedData = JSON.parse(data);
      const headers = Object.keys(parsedData[0]).join(",");
      const csvData = parsedData.map((row: any) =>
        Object.values(row).join(",")
      );
      content = [headers, ...csvData].join("\n");
      mimeType = "text/csv";
      fileExtension = "csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `generated_data.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data downloaded",
      description: `The data has been downloaded in ${format.toUpperCase()} format.`,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-4">
        <Select value={dbType} onValueChange={setDbType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select database" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="postgresql">PostgreSQL</SelectItem>
            <SelectItem value="mysql">MySQL</SelectItem>
            <SelectItem value="mongodb">MongoDB</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={copyToClipboard}>Copy INSERT Query</Button>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => downloadData("json")}>Download JSON</Button>
        <Button onClick={() => downloadData("csv")}>Download CSV</Button>
      </div>
    </div>
  );
}
