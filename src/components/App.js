import React from 'react';
import '../styles/App.css';
import GraphVisualizer from './GraphVisualizer.js';

function App() {
  return (
    <div className="App">
        <GraphVisualizer
          className="toolbar"
          graphDrawX={30}
          graphDrawY={20}
          graphDrawHeight={600}
          graphDrawWidth={800}
        />
    </div>
  );
}

export default App;
