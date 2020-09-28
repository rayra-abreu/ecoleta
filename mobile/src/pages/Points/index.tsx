import React, {useState, useEffect} from 'react'
import {Feather as Icon} from '@expo/vector-icons'
import {useNavigation, useRoute} from '@react-navigation/native'
import {View, Text, Image, TouchableOpacity, ScrollView, Alert} from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import {SvgUri} from 'react-native-svg'
import * as Location from 'expo-location'
import api from '../../services/api'

import styles from './styles'

interface Item{
  id: number
  title: string
  image_url: string
}

interface Point{
  id: number
  name: string
  image: string
  image_url: string
  latitude: number
  longitude: number
}

interface Params{
  uf: string
  city: string
}

const Points=()=>{
  const [items, setItems]=useState<Item[]>([])
  const [points, setPoints]=useState<Point[]>([])
  const [selectedItems, setSelectedItems]=useState<number[]>([])

  const [initialPosition, setInitialPosition]=useState<[number, number]>([0, 0])

  const navigation=useNavigation()
  const route=useRoute()

  const routeParams=route.params as Params

  useEffect(()=>{
    async function loadPosition(){
      try{
        const {status}=await Location.requestPermissionsAsync()

        if(status!='granted'){
          Alert.alert('Ops', 'Precisamos da sua permissão para obter a localização.')
          setInitialPosition([-15.792253570362446, -47.88394004702046])
          return
        }
        
        const location=await Location.getCurrentPositionAsync()

        const {latitude, longitude}=location.coords
        
        setInitialPosition([latitude, longitude])
      }catch(error){
        setInitialPosition([-15.792253570362446, -47.88394004702046])
      }
    }

    loadPosition() /*Chamando abaixo para poder usar async await */
  }, [])

  useEffect(()=>{
    api.get('items').then(response=>{
      setItems(response.data)
    })
  }, [])

  useEffect(()=>{
    api.get('points', {
      params:{
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems
      }
    }).then(response=>{
      setPoints(response.data)
    })
  }, [selectedItems])

  function handleNavigateBack(){
    navigation.goBack()
  }

  function handleNavigateToDetail(id: number){
    navigation.navigate('Detail', {point_id: id})
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

  return (
    /*Para utilizar o border radius é necessário utilizar views por volta dos 
    components*/
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.navigateBack} onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34CB79"/>
        </TouchableOpacity>
        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
        <View style={styles.mapContainer}>
          {/*Operador ternário só com a primeira condição (no React) */
          initialPosition[0]!==0 && (
            <MapView style={styles.map} loadingEnabled={initialPosition[0]===0} initialRegion={{
              latitude: initialPosition[0], 
              longitude: initialPosition[1],
              latitudeDelta: 0.014,
              longitudeDelta: 0.014
          }}>
            {points.map(point=>(
              <Marker key={String(point.id)} style={styles.mapMarker} 
                onPress={()=>handleNavigateToDetail(point.id)} 
                coordinate={{
                  latitude: point.latitude, 
                  longitude: point.longitude,
                }}>
                <View style={styles.mapMarkerContainer}>
                  <Image style={styles.mapMarkerImage} source={{
                    uri: point.image_url
                  }}/>
                  <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                </View>
                <View style={styles.tooltip}></View>
              </Marker>
            ))}
          </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{paddingHorizontal: 20}} >
          {items.map(item=>(
            <TouchableOpacity key={String(item.id)} 
            style={[
              styles.item,
              selectedItems.includes(item.id) ? styles.selectedItem : {}
            ]} 
            onPress={()=>handleSelectItem(item.id)}
            activeOpacity={0.6}>
            <SvgUri width={42} height={42} uri={item.image_url}/>
            <Text style={styles.itemTitle}>{item.title}</Text>
          </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  )
}

export default Points