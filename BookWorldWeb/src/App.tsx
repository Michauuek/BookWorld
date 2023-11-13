import './App.css'
import BookList from "./components/BookList.tsx";
import {Footer} from "./components/Footer.tsx";

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <h1>BookWorld</h1>
      </header>
        <div className="app-content">
            <BookList />
        </div>
        <Footer />
    </div>
  )
}

export default App
