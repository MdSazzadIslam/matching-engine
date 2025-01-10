import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./common/Card";
import "./ResultsDisplay.css";

interface Props {
  results: string;
}

export function ResultsDisplay({ results }: Props) {
  const resultLines = results.split("\n").filter(Boolean);
  const recordCount = resultLines.length;

  return (
    <div className="results-container">
    <Card className="results-card">
      <CardHeader className="results-header">
        <CardTitle className="results-title">Results</CardTitle>
        <span className="record-count">{recordCount} records found</span>
      </CardHeader>
      <CardContent className="results-content">
        <div className="table-container">
          <table className="results-table">
            <thead className="table-header">
              <tr>
                <th>Vacancy ID</th>
                <th>Candidate ID</th>
                <th>Overall Score</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {resultLines.map((line, index) => {
                const [vacancyId, candidateId, score] = line.split(",");
                return (
                  <tr key={index}>
                    <td className="vacancy-cell">{vacancyId}</td>
                    <td className="candidate-cell">{candidateId}</td>
                    <td className="score-cell">{score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

export default ResultsDisplay;
