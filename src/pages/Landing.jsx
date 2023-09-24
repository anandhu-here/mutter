import { View, Text, StyleSheet, TouchableOpacity, TextInput, PermissionsAndroid, Alert, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import LottieView from 'lottie-react-native';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Geolocation from 'react-native-geolocation-service';
import { socket } from './socket';
import { storeData } from '../components/storage';
import Icon from 'react-native-vector-icons/AntDesign'
import axios from 'axios';
import { api_endpoint } from './api';

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    console.log(err, "error")
    return false;
  }
};





const Landing = () => {
  const [ loading, setLoading ] = useState(false);
  const [location, setLocation] = useState(false);
  const [ username, setUname ] = useState('')
  const [usernameStatus, setUsernameStatus] = useState(null);
    const animation = useRef(null);
    const navigation = useNavigation();
    const getLocation = () => {
      const result = requestLocationPermission();
      result.then(res => {
        if (res) {
          Geolocation.getCurrentPosition(
            position => {
              console.log(position);
              setLocation(position);
            },
            error => {
              // See error code charts below.
              console.log(error.code, error.message);
              setLocation(false);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        }
      });
      console.log(location);
    };
    
    useEffect(() => {
      getLocation();
    }, []);

    let userInputColor = '#343434';


    console.log(usernameStatus, "9090")
    if(usernameStatus){
      if(usernameStatus === 404){
        userInputColor = '#343434'
      }
      else{
        userInputColor = 'brown'
      }
    }
  return (
    <View style={{
        flex:1,
        justifyContent:"center",
        alignItems:'center',
        backgroundColor:'#fff'
    }} >
        <View style={{
          flex:0.6,
          width:'100%',
          alignItems:'center',
          justifyContent:'center'
        }} >
          <LottieView style={{
            width:'80%',
            height:'100%'
          }} source={require("../assets/landing.json")} autoPlay  />

          
        </View>
        <View style={{
          flex:0.4,
          width:'100%',
          alignItems:'center',
        }} >
          <Image source={require('../assets/logo.png')} style={{position:'relative', width:'90%', height:60, objectFit:'contain', bottom:100 }} />
          <TextInput
            placeholder='Username'
            placeholderTextColor="white"
            value={username}
            
            style={{
              width:'80%',
              textAlign:'center',
              height:50,
              backgroundColor:userInputColor,
              elevation:2,
              fontFamily:'Playfair Display',
              borderRadius:10,
              marginBottom:30,
              color:'white',
              borderWidth:1,
              
              borderColor:userInputColor
            }}
            onChangeText={(text)=>{
              setUname(text)
              axios.get(`${api_endpoint}/checkusername/${text}`).then(res=>{
                console.log(res.data)
                setUsernameStatus(res.data.status);
              }).catch(error=>{
                console.log(error)
              })
              
            }}
          />
          {/* <View style={{display:'flex', width:'80%', height:'auto', flexDirection:'row', justifyContent:'space-around'}} >
            <TouchableOpacity style={{display: 'flex', flexDirection:'row',  alignItems:'center', paddingVertical:8, borderRadius:7, width:'35%', justifyContent:'space-evenly', backgroundColor:'#EDF0EF', elevation:5}} onPress={()=>{
              setGender('MALE')
            }} >
              <Icon name={gender==='MALE'?'checkcircle':'checkcircleo'} size={20} style={{}}/>
              <Text style={{color:'gray'}} >MALE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{display: 'flex', flexDirection:'row',  alignItems:'center', paddingVertical:8, borderRadius:7, width:'35%', justifyContent:'space-evenly', backgroundColor:'#EDF0EF', elevation:5}} onPress={()=>{
              setGender('FEMALE')
            }} >
              <Icon name={gender==='FEMALE'?'checkcircle':'checkcircleo'} size={20} style={{}}/>
              <Text style={{color:'gray'}} >FEMALE</Text>
            </TouchableOpacity>
          </View> */}
          <View style={{display:'flex', width:'80%', height:'auto', marginTop:30, flexDirection:'row', justifyContent:'space-around'}} >
            <TouchableOpacity onPress={()=>{
              if(location && username){
                setLoading(true)
                axios.post(`${api_endpoint}/join`, {username:username, location:{
                  latitude: 54.5703933, longitude: -1.2108255,
                }}, {headers:{
                  "Content-Type":'application/json'
                }}).then(res=>{
                  socket.emit('initialJoin', username)
                  if(res.status === 200 || res.status === 201){
                    setLoading(false)
                    navigation.navigate('chat', {username})
                  }
                }).catch(error=>{
                  setLoading(false)
                  console.log(error)
                })
                
                
              }
              else{
                setLoading(false)
                getLocation();
              }
            }}  style={{display: 'flex', justifyContent:'center', alignItems:'center', borderTopLeftRadius:100, borderTopRightRadius:100, borderBottomRightRadius:100, height:60, width:100, backgroundColor:'#343434', elevation:5, }} >
                {
                  loading?(
                    <ActivityIndicator size={50} color={"#EAA842"} />
                  ):(
                    <Text style={{color:'white',fontFamily:'Playfair Display', fontSize:16, fontWeight:'500'}} >Chat</Text>
                  )
                }
              </TouchableOpacity>
            </View>
        </View>
       

    </View>
  )
}

const styles = StyleSheet.create({
    animationContainer: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    buttonContainer: {
      paddingTop: 20,
    },
  });

export default Landing

