import React from "react";
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <main className="main">
        <h1 className="title">
          Candidate Matching Engine || Harver Assignment
        </h1>
        {children}
      </main>
    </div>
  );
}

export default Layout;