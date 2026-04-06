import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import WhyForsa from './components/WhyForsa'
import Craftsmen from './components/Craftsmen'
import Specialists from './components/Specialists'
import Footer from './components/Footer'
import Signup from './pages/signup'
import Login from './pages/login'
import CreateNewPassword from "./pages/createNewPassword"
import ProfessionCraftsmen from './pages/ProfessionCraftsmen'
import ProfilePage from './pages/ProfilePage'
import SearchResults from './pages/SearchResults'

function HomePage() {
  const [searchProfession, setSearchProfession] = useState(null)

  return (
    <div className="app">
      <Navbar />

      <section id="hero">
        <Hero onProfessionSelect={setSearchProfession} />
      </section>

      <section id="categories">
        <Categories />
      </section>

      <section id="why-forsa">
        <WhyForsa />
      </section>

      <section id="craftsmen">
        <Craftsmen />
      </section>

      <section id="specialists">
        <Specialists searchProfession={searchProfession} />
      </section>

      <section id="contact">
        <Footer />
      </section>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/login" element={<Login />} />
          <Route path="/create-new-password" element={<CreateNewPassword />} />

          <Route path="/craftsmen/:profession" element={<ProfessionCraftsmen />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search-results" element={<SearchResults />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App