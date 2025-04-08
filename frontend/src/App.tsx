import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/homePage"
import NavBar from "./components/NavBar"
function App() {

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
