import { useState } from 'react'
import { 	
  BrowserRouter,
	Routes,
	Route,
	Link,
}  from 'react-router-dom'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./components/Home"

function App() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes >
    </BrowserRouter>
  )
}

export default App
