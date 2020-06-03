import React from 'react'
//FC (Function Component) um componente escrito em formato de função
//FC é um generic dentro do typescript
interface HeaderProps{
  title: string
  //title?: string
}

const HeaderTeste: React.FC<HeaderProps>=(props)=>{
  return (
    <header>
      <h1>{props.title}</h1>
    </header>
  )
}

export default HeaderTeste