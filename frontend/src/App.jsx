import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [report, setReport] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeIncident = async () => {
    if (!report.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report: report.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed");
      }

      setResult(data.incident);
    } catch (err) {
      setError(
        "Unable to connect to ResQIntel backend. Make sure the FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="shield">✚</div>
          <div>
            <h1>RESQINTEL AI</h1>
            <p>Emergency Response Intelligence</p>
          </div>
        </div>

        <div className="system-status">
          <span></span>
          SYSTEM ONLINE
        </div>
      </header>

      {/* MAIN */}
      <main className="main">
        <div className="ai-icon">♧</div>

        <div className="eyebrow">
          ◆ AI-POWERED INCIDENT INTELLIGENCE ◆
        </div>

        <h2>From Emergency Reports to Response Intelligence.</h2>

        <p className="subtitle">
          Transform unstructured emergency information into structured incident
          intelligence in seconds.
        </p>

        {/* TWO MAIN CARDS */}
        <section className="cards">

          {/* INCIDENT REPORT */}
          <div className="card">
            <div className="card-header">
              <div className="number">01</div>

              <div className="card-title">
                <h3>Incident Report</h3>
                <p>Submit emergency information for analysis</p>
              </div>

              <div className="header-icon">▤</div>
            </div>

            <div className="divider"></div>

            <div className="input-top">
              <span>TEXT INPUT</span>
              <span>{report.length} characters</span>
            </div>

            <textarea
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="Type or paste the emergency report here..."
            />

            <button
              className="analyze-btn"
              onClick={analyzeIncident}
              disabled={loading || !report.trim()}
            >
              {loading ? "ANALYZING..." : "ANALYZE INCIDENT"}
              <span>➤</span>
            </button>
          </div>

          {/* RESPONSE INTELLIGENCE */}
          <div className="card">
            <div className="card-header">
              <div className="number">02</div>

              <div className="card-title">
                <h3>Response Intelligence</h3>
                <p>AI-generated incident understanding</p>
              </div>

              <div className="live">
                <span></span>
                LIVE
              </div>
            </div>

            <div className="divider"></div>

            {!result && !error && (
              <div className="waiting">
                <div className="brain">♧</div>
                <h3>Awaiting Incident Report</h3>
                <p>
                  Submit an emergency report to generate response intelligence.
                </p>
              </div>
            )}

            {error && (
              <div className="error-box">
                <div className="error-icon">!</div>
                <h3>Connection Error</h3>
                <p>{error}</p>
              </div>
            )}

            {result && (
              <div className="analysis">

                <div className="analyzed">
                  ✓ &nbsp; INCIDENT ANALYZED
                </div>

                <div className="result-grid">

                  <div className="result-item">
                    <span className="result-icon fire">♨</span>
                    <div>
                      <label>INCIDENT TYPE</label>
                      <strong>{result.incident_type || "Not specified"}</strong>
                    </div>
                  </div>

                  <div className="result-item">
                    <span className="result-icon location">⌖</span>
                    <div>
                      <label>LOCATION</label>
                      <strong>{result.location || "Not specified"}</strong>
                    </div>
                  </div>

                  <div className="result-item">
                    <span className="result-icon people">♟</span>
                    <div>
                      <label>PEOPLE AT RISK</label>
                      <strong>
                        {result.people_at_risk || "Not specified"}
                      </strong>
                    </div>
                  </div>

                  <div className="result-item">
                    <span className="result-icon urgency">△</span>
                    <div>
                      <label>URGENCY</label>
                      <strong>{result.urgency || "Not specified"}</strong>
                    </div>
                  </div>

                  <div className="result-item full">
                    <span className="result-icon hazard">△</span>
                    <div>
                      <label>POTENTIAL HAZARDS</label>
                      <strong>
                        {result.potential_hazards || "Not specified"}
                      </strong>
                    </div>
                  </div>

                  <div className="result-item full">
                    <span className="result-icon info">ⓘ</span>
                    <div>
                      <label>MISSING INFORMATION</label>
                      <strong>
                        {result.missing_information || "Not specified"}
                      </strong>
                    </div>
                  </div>

                  <div className="response-brief">
                    <span>▤</span>
                    <div>
                      <label>RESPONSE BRIEF</label>
                      <p>
                        {result.response_brief || "Not specified"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </section>

        {/* PIPELINE */}
        <section className="pipeline-section">
          <div className="pipeline-title">
            ◆ &nbsp; INTELLIGENCE PIPELINE &nbsp; ◆
          </div>

          <div className="pipeline">

            <div className="pipeline-card">
              <div className="pipeline-icon">◎</div>
              <div>
                <h3>Classify</h3>
                <p>Identify the incident type from unstructured reports.</p>
              </div>
            </div>

            <div className="pipeline-card">
              <div className="pipeline-icon">⌖</div>
              <div>
                <h3>Extract</h3>
                <p>
                  Pull locations, hazards, people at risk and critical details.
                </p>
              </div>
            </div>

            <div className="pipeline-card">
              <div className="pipeline-icon yellow">⚡</div>
              <div>
                <h3>Prioritize</h3>
                <p>
                  Generate an AI-assisted urgency indicator from available
                  information.
                </p>
              </div>
            </div>

            <div className="pipeline-card">
              <div className="pipeline-icon purple">✦</div>
              <div>
                <h3>Summarize</h3>
                <p>
                  Convert complex reports into concise response intelligence.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* DECISION SUPPORT */}
        <section className="decision">
          <div className="decision-icon">✚</div>

          <div>
            <h3>Decision-support system</h3>
            <p>
              ResQIntel AI assists authorized responders with information
              processing. Final emergency response decisions remain with
              qualified human responders.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div>
          <strong>RESQINTEL AI</strong>
          <span>|</span>
          Emergency Response Intelligence
        </div>

        <strong>CodeNova</strong>
      </footer>
    </div>
  );
}

export default App;
