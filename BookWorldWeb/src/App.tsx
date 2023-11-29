import './App.css'
import BookList from "./components/pages/book/BookList.tsx";
import { Footer } from "./components/page_elements/Footer.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookScreen from './components/pages/book/BookScreen.tsx';
import Navbar from './components/page_elements/Navbar.tsx';
import NotFoundScreen from './components/page_elements/NotFoundScreen.tsx';
import AuthorScreen from './components/pages/author/AuthorScreen.tsx';
import RegisterScreen from './components/pages/register/RegisterScreen.tsx';
import RankingScreen from './components/pages/ranking/RankingScreen.tsx';
import { setUpAxios } from './common/auth.tsx';
import LoginScreen from './components/pages/register/LoginScreen.tsx';
import GenreScreen from './components/pages/genre/GenreScreen.tsx';
import AdminScreen from './components/pages/admin/admin/AdminScreen.tsx';
import { UsersScreen } from './components/pages/admin/users/UsersScreen.tsx';

function App() {
  setUpAxios()
  
  return (
    <div className="App">
      <div className="app-content">
        <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path="/" element={<BookList />}></Route>
            <Route path="/book/:bookId" element={<BookScreen />}></Route>
            <Route path="/author/:authorId" element={<AuthorScreen />}></Route>
            <Route path="/genre/:genreId" element={<GenreScreen />}></Route>
            <Route path="/register/" element={<RegisterScreen />}></Route>
            <Route path="/ranking/" element={<RankingScreen />}></Route>
            <Route path="/login" element={<LoginScreen />}></Route>
            <Route path="/admin" element={<AdminScreen />}></Route>
            <Route path="/admin/users" element={<UsersScreen />}></Route>
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
