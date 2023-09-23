/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, BrowserRouter as Router, Routes,Link } from 'react-router-dom'; // Import BrowserRouter as Router

import Generate from '../components/generator/Generator';
import GenerateThen from '../components/generatedThen/GenerateThen';
import Exp from '../components/Exp';


const Routers = () => {
  return (
    <Routes>
      {/* <Link to="/generate">Generate</Link> */}
      <Route path='/' element={<Exp />} />
      <Route path='/generate' element={<Generate/>}/>
      <Route path='/generated-then' element={<GenerateThen/>}/>
    </Routes>
  );
};

export default Routers;
