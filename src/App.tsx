import React, {useState} from 'react';
import {Routes, Route} from "react-router-dom";
import AuthRootComponent from './components/auth';

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="login" element={<AuthRootComponent/>}/>
      <Route path="userlist" element={<AuthRootComponent />}/>
      
        
      </Routes>
    </div>
  );
}

export default App;
