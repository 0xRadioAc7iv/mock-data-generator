import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | React.ReactNode>(
    "Waiting for response..."
  );
  const [isRawView, setIsRawView] = useState(true);
  const [parsedData, setParsedData] = useState<any[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResponse("Connecting to API...");
    setParsedData([]);
    setIsRawView(true);

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

      try {
        const parsed = JSON.parse(accumulatedText);
        setParsedData(parsed);
      } catch (error) {
        console.warn("Failed to parse response as JSON:", error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponse(`Error: ${error.message}`);
      } else {
        setResponse("An unknown error occurred.");
      }
    }
  };

  const handleCopyJSON = () => {
    if (parsedData.length) {
      const jsonString = JSON.stringify(parsedData, null, 2);
      navigator.clipboard
        .writeText(jsonString)
        .then(() => {
          alert("Raw JSON data copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy JSON data:", err);
        });
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "20px",
        maxWidth: "800px",
      }}
    >
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <label htmlFor="query" style={{ marginRight: "10px" }}>
          Enter Query:
        </label>
        <input
          type="text"
          id="query"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
          style={{
            padding: "8px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>

      <button
        onClick={() => setIsRawView(!isRawView)}
        disabled={!parsedData.length}
        style={{
          padding: "8px 12px",
          marginBottom: "20px",
          backgroundColor: parsedData.length ? "#28a745" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: parsedData.length ? "pointer" : "not-allowed",
        }}
      >
        Toggle to {isRawView ? "Tabular View" : "Raw JSON View"}
      </button>

      <button
        onClick={handleCopyJSON}
        disabled={!parsedData.length}
        style={{
          padding: "8px 12px",
          backgroundColor: parsedData.length ? "#007bff" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: parsedData.length ? "pointer" : "not-allowed",
        }}
      >
        Copy Raw JSON Data
      </button>

      <h2>Response:</h2>
      <div
        id="response-container"
        style={{
          whiteSpace: "pre-wrap",
          backgroundColor: "#f4f4f4",
          border: "1px solid #ddd",
          padding: "10px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {parsedData.length && !isRawView ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {Object.keys(parsedData[0]).map((key) => (
                  <th
                    key={key}
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                      padding: "8px",
                    }}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedData.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, idx) => (
                    <td
                      key={idx}
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {value as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          response
        )}
      </div>
    </div>
  );
}

export default App;
