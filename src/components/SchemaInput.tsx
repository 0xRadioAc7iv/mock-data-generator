import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SchemaInputProps {
  onSubmit: (schema: string, rowCount: number) => void;
}

export default function SchemaInput({ onSubmit }: SchemaInputProps) {
  const [schema, setSchema] = useState("");
  const [rowCount, setRowCount] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(schema, rowCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div>
        <Label htmlFor="schema">Database Schema</Label>
        <Textarea
          id="schema"
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          placeholder="Specify Schema like this: TABLE_NAME (COLUMN_1, COLUMN_2, ...)"
          className="mt-1"
          rows={5}
        />
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-1/3">
          <Label htmlFor="rowCount">Number of Rows</Label>
          <Input
            id="rowCount"
            type="number"
            min={1}
            max={50}
            value={rowCount}
            onChange={(e) => setRowCount(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <Button type="submit" className="mt-6" disabled={loading}>
          {loading ? "Generating..." : "Generate Data"}
        </Button>
      </div>
    </form>
  );
}
