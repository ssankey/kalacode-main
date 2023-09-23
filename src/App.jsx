/* eslint-disable no-unused-vars */
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter as Router
import Routers from './router/Routers'


function App() {

  return (
    <>   
      <Router>
        <Routers />
      </Router>

    </>
  )
}

export default App
