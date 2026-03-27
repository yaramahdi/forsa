import React from 'react'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import WhyForsa from './components/WhyForsa'
import Craftsmen from './components/Craftsmen'
import Specialists from './components/Specialists'
import Footer from './components/Footer'

function App() {
  
  return (
    <LanguageProvider>
      <div className="app">
        <Navbar />
        <section id="hero">
          <Hero />
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
          <Specialists />
        </section>
        <section id="contact">
          <Footer />
        </section>
      </div>
    </LanguageProvider>
  )
}

export default App
