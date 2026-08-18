import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadBox from "./components/UploadBox";
import PreviewPanel from "./components/PreviewPanel";
import ResultPanel from "./components/ResultPanel";
import Footer from "./components/Footer";
import LoadingPanel from "./components/LoadingPanel";

// NEW IMPORTS
import HowItWorks from "./components/HowItWorks";
import SupportedDocs from "./components/SupportedDocs";
import Privacy from "./components/Privacy";

function App() {
  const [mode, setMode] = useState("demo");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleReset = () => {
    setMode("demo");
    setFile(null);
    setResult(null);
  };

  return (
    <div className="App bg-paper min-h-screen flex flex-col">
      <Navbar onReset={handleReset} />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <main className="flex-1 w-full">
              <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-10 lg:pt-16 pb-16">
                <div className="grid grid-cols-12 gap-8 lg:gap-14">

                  <section className="col-span-12 lg:col-span-5 lg:sticky lg:top-24">
                    <Hero />
                    <UploadBox
                      file={file}
                      setFile={setFile}
                      setLoading={setLoading}
                      setMode={setMode}
                      setResult={setResult}
                    />
                  </section>

                  <section className="col-span-12 lg:col-span-7">
                    {loading ? (
                      <LoadingPanel fileName={file?.name} />
                    ) : mode === "result" && result ? (
                      <ResultPanel data={result} onReset={handleReset} />
                    ) : (
                      <PreviewPanel />
                    )}
                  </section>

                </div>
              </div>
            </main>
          }
        />

        {/* NEW PAGES */}
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/supported-docs" element={<SupportedDocs />} />
        <Route path="/privacy" element={<Privacy />} />

      </Routes>

      <Footer />
    </div>
  );
}

export default App;