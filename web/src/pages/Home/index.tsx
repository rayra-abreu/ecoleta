import React from 'react'
import {FiLogIn} from 'react-icons/fi'
import {Link} from 'react-router-dom'
import './styles.css'
import logo from '../../assets/logo.svg'

const Home=()=>{
  return(
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Logo Ecoleta"></img>
        </header>

        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
          <form>
            <Link to="/create-point">
              <span id="register-icon">
                <FiLogIn/>
              </span>
              <span id="register">Cadastre um ponto de coleta</span>
            </Link>
          </form>
        </main>
      </div>
    </div>
  )
}

export default Home