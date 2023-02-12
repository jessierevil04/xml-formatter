import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { XMLValidator, XMLParser } from "fast-xml-parser";
import Titlebar from "./components/Titlebar";
import copy from "copy-to-clipboard";
import xmlButPrettier from "xml-but-prettier";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [rawXML, setRawXML] = useState("");
  const [formattedXML, setFormattedXML] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<string | number>(4);

  const beautify = (xml: string) => {
    if (!xml) {
      setFormattedXML("");
      setError("");
      return;
    }

    try {
      const result = XMLValidator.validate(xml, {
        allowBooleanAttributes: true,
      });

      if (result !== true) {
        setError("Invalid XML");
        return;
      }

    } catch (err) {
      setError("Invalid XML");
      return;
    }

    setError("");
    setFormattedXML(
      xmlButPrettier(xml, { indentor: getTab(tab), textNodesOnSameLine: true })
    );
  };

  const getTab = (value: string | number) => {
    let num = Number(value);

    if (!Number.isNaN(num)) {
      return " ".repeat(num);
    }

    return "\t";
  };

  const copyBtnClick = () => {
    copy(formattedXML, { format: "text/plain" });
    toast.info("Copied to clipboard", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  useEffect(() => {
    beautify(rawXML);
  }, [tab, rawXML]);

  return (
    <div className="App">
      <ToastContainer />
      <Titlebar error={error} />
      <main id="container">
        <section id="config">
          <div>
            <select
              name="tabs"
              id="tabs"
              value={tab}
              onChange={(e) => setTab(e.target.value)}
            >
              <option value="4">4 Space Tab</option>
              <option value="3">3 Space Tab</option>
              <option value="2">2 Space Tab</option>
              <option value="t">1 Tab</option>
            </select>
          </div>
        </section>
        <section id="mainForm">
          <div>
            <textarea
              value={rawXML}
              onChange={(e) => setRawXML(e.target.value)}
              placeholder="XML Data"
            />
          </div>
          <div>
            {formattedXML ? (
              <button id="copyBtn" onClick={copyBtnClick}>
                📋
              </button>
            ) : (
              <></>
            )}
            <pre>{formattedXML}</pre>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
