import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./index.css"; // make sure Tailwind is imported

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Logos */}
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img
            src={viteLogo}
            className="w-20 h-20 hover:scale-110 transition-transform duration-300"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="w-20 h-20 hover:rotate-12 transition-transform duration-300"
            alt="React logo"
          />
        </a>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-6">
        Vite + <span className="text-sky-400">React</span>
      </h1>

      {/* Counter Card */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded-lg text-lg font-semibold transition-colors"
        >
          Count is {count}
        </button>
        <p className="mt-4 text-gray-300 text-sm">
          Edit <code className="text-yellow-300">src/App.jsx</code> and save to
          test HMRbgjgdrgje
        </p>
      </div>

      {/* Footer Note */}
      <p className="mt-6 text-gray-400 text-sm">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
