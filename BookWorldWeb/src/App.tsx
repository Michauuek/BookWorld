import './App.css'
import BookList from "./components/pages/book/BookList.tsx";
import { Footer } from "./components/page_elements/Footer.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookScreen from './components/pages/book/BookScreen.tsx';
import Navbar from './components/page_elements/Navbar.tsx';
import NotFoundScreen from './components/page_elements/NotFoundScreen.tsx';

function App() {

  return (
    <div className="App">
      <div className="app-content">
        <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path="/" element={<BookList />}></Route>
            <Route path="/book/:bookId" element={<BookScreen />}></Route>
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
