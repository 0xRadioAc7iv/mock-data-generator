import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface InsertDataButtonProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data: any[];
}

export default function InsertDataButton({ data }: InsertDataButtonProps) {
  // const [dbType, setDbType] = useState("postgresql");
  const { toast } = useToast();

  const generateInsertQuery = useCallback(() => {
    if (data.length === 0) return "";

    const tableName = "generated_data"; // You can make this dynamic later
    const columns = Object.keys(data[0]).join(", ");
    const values = data
      .map(
        (row) =>
          `(${Object.values(row)
            .map((value) => (typeof value === "string" ? `'${value}'` : value))
            .join(", ")})`
      )
      .join(",\n");

    return `INSERT INTO ${tableName} (${columns})\nVALUES\n${values};`;
  }, [data]);

  const copyToClipboard = () => {
    const query = generateInsertQuery();
    navigator.clipboard.writeText(query).then(
      () => {
        toast({
          title: "Query copied to clipboard",
          description: "The INSERT query has been copied to your clipboard.",
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

  return (
    <Button onClick={copyToClipboard} className="mt-4">
      Copy INSERT Query to Clipboard
    </Button>
  );
}
