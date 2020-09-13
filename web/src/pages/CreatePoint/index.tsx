import React, {useEffect, useState, ChangeEvent, MouseEvent, FormEvent} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {FiArrowLeft, FiCheckCircle, FiXCircle} from 'react-icons/fi'
import {Map, TileLayer, Marker} from 'react-leaflet'
import {LeafletMouseEvent} from 'leaflet'
import * as Yup from 'yup'

import axios from 'axios'
import api from '../../services/api'

import Dropzone from '../../components/Dropzone'
import './styles.css'
import logo from '../../assets/logo.svg'

/*Sempre que criarmos um estado para um array ou objeto, precisamos manualmente
informar o tipo da variável que será armazenada*/
interface Item{
  id: number,
  title: string,
  image_url: string
}

interface IBGEUFResponse{
  sigla: string
}

interface IBGECityResponse{
  nome: string
}

interface formError{
  [path: string]: string
}

const CreatePoint=()=>{
  //const [items, setItems]=useState<Array<Item>>([])
  const [items, setItems]=useState<Item[]>([])
  const [ufs, setUfs]=useState<string[]>([])
  const [cities, setCities]=useState<string[]>([])
  const [formMessages, setFormMessages]=useState<formError | undefined>(undefined)
  
  /*Map center={initialPosition}*/
  const [initialPosition, setInitialPosition]=useState<[number, number]>([-15.792253570362446, -47.88394004702046])

  const [formData, setFormData]=useState({
    name:'',
    email:'',
    whatsapp:''
  })

  const [selectedUf, setSelectedUF]=useState('0')
  const [selectedCity, setSelectedCity]=useState('0')
  const [selectedItems, setSelectedItems]=useState<number[]>([])
  const [selectedPosition, setSelectedPosition]=useState<[number, number]>([0, 0])
  const [selectedFile, setSelectedFile]=useState<File>()
  const [pointCreated, setPointCreated]=useState<boolean>(false)

  const validations=Yup.object().shape({
    name: Yup.string().trim('').min(2, 'Preencha no mínimo 2 caracteres.').max(45, 'Preencha no máximo 45 caracteres.').required('Preencha o campo de nome.'),
    email: Yup.string().email('Preencha um e-mail válido.').required('Preencha o campo de e-mail.'),
    whatsapp: Yup.string().trim('').required('Preencha o campo de Whatsapp.'),
    position: Yup.array().of(Yup.number().notOneOf([0], 'Ponto inválido.')).max(2, 'Preencha apenas latitude e longitude.').required('Selecione um ponto no mapa.'),
    uf: Yup.string().length(2, 'UF inválida.').required('Selecione uma UF.'),
    city: Yup.string().min(2, 'Cidade inválida.').required('Selecione uma cidade.'),
    items: Yup.array().of(Yup.number().min(1, 'Item inválido.').max(6, 'Item inválido.')).min(1, 'Selecione no mínimo um item.').max(6,'Selecione no máximo 6 itens.').required('Selecione pelo menos um item.'),
    image: Yup.mixed().required('Selecione uma imagem.')
  })

  const history=useHistory()
  /*useEffect é uma função que recebe dois parâmetros, o primeiro é qual função
  quero executar, o segundo é quando quero executar. O quando é baseado na 
  mudança da informação*/
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(position=>{
      const {latitude, longitude}=position.coords
      setInitialPosition([latitude, longitude])
    })
  }, [])

  useEffect(()=>{
    api.get('items').then(response=>{
      setItems(response.data)
    })
  }, [])

  useEffect(()=>{
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response=>{
      const ufInitials=response.data.map(uf=>uf.sigla)
      setUfs(ufInitials.sort())
    })
  },[])

  useEffect(()=>{
    if(selectedUf==='0'){
      return 
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response=>{
      const cityNames=response.data.map(city=>city.nome)
      setCities(cityNames.sort(function(a,b){
        return a.localeCompare(b)
      }))
    })
    //Carregar as cidades sempre que a UF mudar
  }, [selectedUf])

  /*Caso fosse executar uma função toda vez que a informação mudasse, uma 
  variável seria colocada no array de useEffect. Se deixar ele vazio, a função
  que foi colocada como primeiro parâmetro será disparada uma única vez 
  independente de quantas vezes o componente por ex. createPoint, 
  mude(estado, etc). Tudo que for colocado dentro desta função será executado
  assim que o componente for exibido em tela*/
  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
    const uf=event.target.value
    setSelectedUF(uf)
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
    const city=event.target.value
    setSelectedCity(city)
  }

  function handleMapClick(event: LeafletMouseEvent){
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng,
    ])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const {name, value}=event.target
    setFormData({...formData, [name]: value})
  }

  function handleSelectItem(id: number){
    const alreadySelected=selectedItems.findIndex(item=>item===id)
    if(alreadySelected>=0){
      const filteredItems=selectedItems.filter(item=>item!==id)
      setSelectedItems(filteredItems)
    }else{
      setSelectedItems([...selectedItems, id])
    }
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault()

    let inputs = event.currentTarget.getElementsByTagName('input')

    const {name, email, whatsapp}=formData
    const uf=selectedUf
    const city=selectedCity
    const [latitude, longitude]=selectedPosition
    const items=selectedItems
    const image=selectedFile

    try{
      await validations.validate({
        name, 
        email,
        whatsapp,
        position: [latitude, longitude],
        uf,
        city,
        items,
        image
      },{
        abortEarly: false
      })

      registerPoint()

    }catch(err){
      if(err instanceof Yup.ValidationError){
        const errorMessages: formError={}

        err.inner.forEach(error=>{
          errorMessages[error.path]=error.message
        })

        setFormMessages(errorMessages)
      }
    }

    async function registerPoint(){
      const data=new FormData()
      data.append('name', name)
      data.append('email', email)
      data.append('whatsapp', whatsapp)
      data.append('uf', uf)
      data.append('city', city)
      data.append('latitude', String(latitude))
      data.append('longitude', String(longitude))
      data.append('items', items.join(','))
      if(image){
        data.append('image', image)
      }

      await api.post('points', data)
      
      //history.push('/')
      setPointCreated(true)
      setSelectedPosition([0, 0])

      for(let i=1; i<inputs.length; i++) {
        inputs[i].value=''
      }

      setSelectedUF('0')
      setCities([])
      setSelectedCity('0')
      setSelectedItems([])
      setFormMessages(undefined)
    }
  }

  function outsideClick(event: MouseEvent<HTMLFormElement>){
    if(event.currentTarget.id==='form-create-point' && pointCreated===true) setPointCreated(false)
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Logo Ecoleta"/>
        <Link to="/">
          <FiArrowLeft/>
          Voltar para a Home
        </Link>
      </header>
      <form id="form-create-point" onSubmit={handleSubmit} onClick={outsideClick}>
        <h1>Cadastro do <span id="form-title">ponto de coleta.</span></h1>
        <div id="drop">
          <Dropzone onFileUploaded={setSelectedFile}/>
          {formMessages && formMessages['image'] ? <span className="error-message">{formMessages['image']}</span> : null}
        </div>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label className="label-title" htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" onChange={handleInputChange} placeholder="Nome" required/>
            {formMessages && formMessages['name'] ? <span className="error-message">{formMessages['name']}</span> : null}
          </div>
          <div className="field-group">
            <div className="field">
              <label className="label-title" htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" onChange={handleInputChange} placeholder="email@provedor.com" required/>
              {formMessages && formMessages['email'] ? <span className="error-message">{formMessages['email']}</span> : null}
            </div>

            <div className="field">
              <label className="label-title" htmlFor="name">WhatsApp</label>
              <input type="tel" pattern="[0-9]{2}[0-9]{2}[0-9]{5}[0-9]{4}" name="whatsapp" 
                id="whatsapp" onChange={handleInputChange} placeholder="5511912345678" required/>
              {formMessages && formMessages['whatsapp'] ? <span className="error-message">{formMessages['whatsapp']}</span> : null}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span className="clue">Selecione o endereço no mapa</span>
          </legend>
          <div id="map-container">
            <Map center={initialPosition} zoom={3} onClick={handleMapClick}>
              <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

              <Marker position={selectedPosition}/>
            </Map>
            {formMessages && (formMessages['position[0]'] || formMessages['position[1]']) ?
             <span className="error-message">{formMessages['position[0]']}</span> : null}
          </div>
          <div className="field-group">
            <div className="field">
              <label className="label-title" htmlFor="uf">Estado (UF)</label>
                <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf} required>
                  <option value="0" disabled>Selecione a UF</option>
                  {ufs.map(uf=>(
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
                {formMessages && formMessages['uf'] ? <span className="error-message">{formMessages['uf']}</span> : null}
            </div>

            <div className="field">
              <label className="label-title" htmlFor="city">Cidade</label>
                <select name="city" id="city" value={selectedCity} onChange={handleSelectCity} required>
                  <option value="0" disabled>Selecione a cidade</option>
                  {cities.map(city=>(
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {formMessages && formMessages['city'] ? <span className="error-message">{formMessages['city']}</span> : null}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span className="clue">Selecione um ou mais ítens abaixo</span>
          </legend>
          <div id="items-container">
            <ul className="items-grid">
              {items.map(item=>(
                <li key={item.id} onClick={()=>handleSelectItem(item.id)} className={selectedItems.includes(item.id)? 'selected' : ''}>
                  <img src={item.image_url} alt={`Item ${item.title}`}/>
                  <span className="item-title">{item.title}</span>
                </li>
              ))}
            </ul>
            {formMessages && formMessages['items'] ? <span className="error-message">{formMessages['items']}</span> : null}
          </div>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>

      { pointCreated ? 
        <div id="modal">
          <button className="close" onClick={()=> setPointCreated(false)}>
            <FiXCircle color="#34CB79"/>
          </button>
          <div className="success">
            <FiCheckCircle color="#34CB79"/>
            <p>Cadastro concluído!</p>
          </div>
        </div> : null
      }
    </div>
  )
}

export default CreatePoint