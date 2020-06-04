import React from 'react'
import {Link} from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi'
import {Map, TileLayer, Marker} from 'react-leaflet'
import './styles.css'
import logo from '../../assets/logo.svg'

const CreatePoint=()=>{
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Logo Ecoleta"/>
        <Link to="/">
          <FiArrowLeft/>
          Voltar para a Home
        </Link>
      </header>
      <form>
        <h1>Cadastro do <span>ponto de coleta.</span></h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label className="label-title" htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" placeholder="Nome" required/>
          </div>
          <div className="field-group">
            <div className="field">
              <label className="label-title" htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" placeholder="email@provedor.com" required/>
            </div>

            <div className="field">
              <label className="label-title" htmlFor="name">WhatsApp</label>
              <input type="text" name="whatsapp" id="whatsapp" placeholder="5511912345678" required/>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={[-27.2092052, -49.6401092]} zoom={15}>
            <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          
            <Marker position={[-27.2092052, -49.6401092]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label className="label-title" htmlFor="uf">Estado (UF)</label>
                <select name="uf" id="uf" required>
                  <option disabled selected>Selecione a UF</option>
                </select>
            </div>

            <div className="field">
              <label className="label-title" htmlFor="city">Cidade</label>
                <select name="city" id="city" required>
                  <option disabled selected>Selecione a cidade</option>
                </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">
            <li className="selected">
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Item"/>
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Item"/>
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Item"/>
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Item"/>
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Item"/>
              <span>Óleo de cozinha</span>
            </li>
            <li>
              <img src="http://localhost:3333/uploads/oleo.svg" alt="Item"/>
              <span>Óleo de cozinha</span>
            </li>
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint