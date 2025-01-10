import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("Waiting for response...");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResponse("Connecting to API...");

    try {
      const res = await fetch("http://localhost:8000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.body || !res.ok) {
        setResponse("Error: Could not get response from server");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const parsedChunk = JSON.parse(chunk);

        if (parsedChunk.partial_response) {
          accumulatedText = parsedChunk.partial_response;
        }
        setResponse(accumulatedText);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponse(`Error: ${error.message}`);
      } else {
        setResponse("An unknown error occurred.");
      }
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="query">Enter Query:</label>
        <input
          type="text"
          id="query"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <h2>Response:</h2>
      <div
        id="response-container"
        style={{
          whiteSpace: "pre-wrap",
          backgroundColor: "#f4f4f4",
          border: "1px solid #ddd",
          padding: "10px",
          marginTop: "20px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {response}
      </div>
    </div>
  );
}

export default App;
