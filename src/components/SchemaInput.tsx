import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SchemaInputProps {
  onSubmit: (schema: string) => void;
}

export default function SchemaInput({ onSubmit }: SchemaInputProps) {
  const [schema, setSchema] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(schema);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <Textarea
        value={schema}
        onChange={(e) => setSchema(e.target.value)}
        placeholder="Enter your schema here..."
        className="mb-2"
        rows={5}
      />
      <Button type="submit">Generate Data</Button>
    </form>
  );
}
