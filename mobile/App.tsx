import React from 'react'
import {AppLoading} from 'expo'
import {StatusBar} from 'react-native'
import {Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto'
import {Ubuntu_700Bold, useFonts} from '@expo-google-fonts/ubuntu' /*useFonts 
pode ser importado por qualquer uma das fontes*/
import Home from './src/pages/Home'

export default function App() {
  const [fontsLoaded]=useFonts({
    Roboto_400Regular, Roboto_500Medium,
    Ubuntu_700Bold
  })

  if(!fontsLoaded){
    return <AppLoading/>
  }

  return (
    /*Encapsular elementos sem realmente produzir essa view em tela (Fragment).
    translucent é para a statusbar ficar por cima do conteúdo e não ser 
    exatamente algo que a aplicação não possa ocupar o conteúdo atrá dela, 
    se colocar um background ele irá para atrás da statusbar*/
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <Home/>
    </>
  )
}
