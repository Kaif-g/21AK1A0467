import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [average, setAverage] = useState(null);

  const fetchNumbers = async (numberid) => {
    try {
      const response = await fetch(`http://localhost:9876/numbers/${numberid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setNumbers(data.windowCurrState);
      setAverage(data.avg);
    } catch (error) {
      console.error('Error fetching numbers:', error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Average Calculator</h1>
      </header>
      <main className="App-main">
        <div className="App-controls">
          <button onClick={() => fetchNumbers('p')}>Fetch Prime Numbers</button>
          <button onClick={() => fetchNumbers('f')}>Fetch Fibonacci Numbers</button>
          <button onClick={() => fetchNumbers('e')}>Fetch Even Numbers</button>
          <button onClick={() => fetchNumbers('r')}>Fetch Random Numbers</button>
        </div>
        <div className="App-results">
          <h2>Results</h2>
          <p>Numbers: {numbers.join(', ')}</p>
          {average && <p>Average: {average}</p>}
        </div>
      </main>
    </div>
  );
};

export default App;
