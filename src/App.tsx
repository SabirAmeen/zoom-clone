import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';

const App = () => {
    
    return (
        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/:room' component={Home} />
        </Switch>
    )
}

export default App;