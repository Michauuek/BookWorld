import './App.css'
import BookList from "./components/pages/book/BookList.tsx";
import { Footer } from "./components/page_elements/Footer.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookScreen from './components/pages/book/BookScreen.tsx';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <h1>BookWorld</h1>
      </header>
      <div className="app-content">

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BookList />}></Route>
            <Route path="/book/:bookId" element={<BookScreen />}></Route>
          </Routes>
        </BrowserRouter>

      </div>
      <Footer />
    </div>

  )
}

export default App
