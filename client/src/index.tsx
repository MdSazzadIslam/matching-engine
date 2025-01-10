import React from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from './components/Layout';
import { FileUpload } from './components/upload/FileUpload';

function App() {
  return (
    <Layout>
      <FileUpload />
    </Layout>
  );
}

const root = createRoot(document.getElementById('app')!);
root.render(<App />);