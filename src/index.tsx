import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

render(
    <Router>
        <div>
            <App />
        </div>
    </Router>
, document.getElementById('app-root'))