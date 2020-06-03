import React, {useState} from 'react';
import './App.css';
import HeaderTeste from './HeaderTeste'
//JSX: Sintaxe XML dentro do JavaScript
//Extensão .tsx (typescript com JSX)
function AppTeste() {
  // div#app>ul>li*5 e tecla enter para utilizar o emmet
  /*Conceito de imutabilidade: Ao invés de alterar o valor pré-existente do 
  estado, criamos um novo valor para o estado com as modificações que queremos*/
  const [counter, setCounter]=useState(0)
  // [valor do estado, função pra atualizar o valor do estado]

  function handleButtonClick(){
    //Para repor o valor de counter
    setCounter(counter+1)
  }

  return (
    <div>
      <HeaderTeste title={`Contador: ${counter*2}`}/>
      <h1>{counter}</h1>
      <button type="button" onClick={handleButtonClick}>Aumentar</button>
    </div>
  )
}

export default AppTeste;
