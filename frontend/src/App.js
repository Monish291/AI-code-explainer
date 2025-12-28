import React, { useState, useMemo } from "react";
import { explainCode } from "./api";
import "./styles/App.css";

// Helper function to format the response text with proper HTML structure
const formatResponse = (text) => {
  if (!text) return '';
  
  // Split by numbered sections (1., 2., 3., etc.)
  const sections = text.split(/\n\s*\d+\.\s+/);
  
  // If no numbered sections found, return as is
  if (sections.length <= 1) {
    return text;
  }
  
  // Process each section
  return sections.map((section, index) => {
    if (!section.trim()) return null;
    
    // Split section into title and content
    const [title, ...contentParts] = section.split(':');
    const content = contentParts.join(':').trim();
    
    return (
      <div key={index} className="response-section">
        <h4>{title.trim()}</h4>
        <p>{content}</p>
      </div>
    );
  });
};

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExplain = async () => {
    if (!code.trim()) {
      setError("Please enter some code to explain");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const data = await explainCode(code);
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.response || "No explanation available");
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>AI Code Explainer</h1>
      </header>

      <main className="main-content">
        <div className="code-container">
          <h2>Enter Your Code</h2>
          <textarea
            className="code-input"
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button 
            className="button" 
            onClick={handleExplain} 
            disabled={loading}
          >
            {loading ? "Explaining..." : "Explain Code"}
          </button>
        </div>

        <div className="response-container">
          <h3 className="response-title">Explanation</h3>
          {loading ? (
            <div className="loading">Analyzing your code...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : result ? (
            <div className="response-content">
              {formatResponse(result)}
            </div>
          ) : (
            <div className="empty-state">
              Your code explanation will appear here...
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>AI Code Explainer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;