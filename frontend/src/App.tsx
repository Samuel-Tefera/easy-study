import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased text-foreground">
        <Routes>
          <Route path="/" element={<div className="p-10 text-center"><h1 className="text-4xl font-bold text-primary">Easy Study</h1><p className="mt-4 text-muted-foreground">Frontend initialized with Vite + React + Tailwind + TS</p></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
