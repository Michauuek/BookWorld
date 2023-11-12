import './App.css'
import BookList from "./components/BookList.tsx";

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <h1>BookWorld</h1>
      </header>
        <div className="app-content">
            <BookList />
        </div>
    </div>
  )
}

export default App
