import React, {useState, useEffect} from 'react'
import {Feather as Icon} from '@expo/vector-icons'
import {View, ImageBackground, Text, Image, KeyboardAvoidingView, Platform} from 'react-native'
import {RectButton} from 'react-native-gesture-handler'
import {useNavigation} from '@react-navigation/native'
import {Picker} from '@react-native-community/picker'
import axios from 'axios'

import styles from './styles'

interface IBGEUFResponse{
  sigla: string
}

interface IBGECityResponse{
  nome: string
}

const Home=()=>{

  const [ufs, setUfs]=useState<string[]>([])
  const [cities, setCities]=useState<string[]>([])

  const [selectedUf, setSelectedUF]=useState('0')
  const [selectedCity, setSelectedCity]=useState('0')

  const navigation=useNavigation()

  function handleNavigationToPoints(){
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    })
  }

  function handleSelectUf(uf: string){
    setSelectedUF(uf)
  }

  function handleSelectCity(city: string){
    setSelectedCity(city)
  }

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
  }, [selectedUf])

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS===`ios` ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{width: 274, height: 268}}
      >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')}/>
        <View>
          <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.label}>Estado (UF)</Text>
          <View style={styles.input}>
          <Picker style={styles.select} mode={"dropdown"}
            onValueChange={(value: string | number) => {
              if(typeof value!=='string') throw new Error('O valor deve ser uma string!')
              handleSelectUf(value)
            }}
            selectedValue={selectedUf}
          >
          <Picker.Item label="Todos os estados" key="0" value="0"/>
          {ufs.map(uf=>(
            <Picker.Item label={uf} key={uf} value={uf}/>
          ))}
          </Picker>
        </View>
        <Text style={styles.label}>Cidade</Text>
        <View style={styles.input}>
          <Picker style={styles.select} mode={"dropdown"}
            onValueChange={(value: string | number) => {
              if(typeof value!=='string') throw new Error('O valor deve ser uma string!')
              handleSelectCity(value)
            }}
            selectedValue={selectedCity}
          >
          <Picker.Item label="Todas as cidades" key="0" value="0"/>
          {cities.map(city=>(
            <Picker.Item label={city} key={city} value={city}/>
          ))}
          </Picker>
        </View>
        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text><Icon name="arrow-right" color="#FFF" size={24}/></Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default Home