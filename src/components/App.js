import React from 'react';
import '../styles/App.css';
import Toolbar from './Toolbar.js';
import Graph from './Graph.js';

function App() {
  return (
    <div className="App">
        <Toolbar className="toolbar"/>
        <Graph />
    </div>
  );
}

export default App;
