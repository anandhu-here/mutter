import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, ScrollView, ImageBackground, Text,Pressable, TouchableOpacity, Modal } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { socket } from './socket';
import { getData } from '../components/storage';
import UserList from '../components/UserList';
import axios from 'axios';
import { calculateDistance } from './calculate';
import { api_endpoint } from './api';

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
var min=2; var max = 4;
const avatarData = [
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  { id: 1,  numColumns: getRandomNumber(min, max) },
  
  // Add more avatar data as needed
];



const App = ({route, navigation}) => {
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ avatarData, setAD ] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  const renderRow = (row) => (
    <View style={[styles.row, {justifyContent:"space-evenly",  marginBottom:getRandomNumber(20,50)}]} >
      {row.map((item) => (
        <TouchableOpacity onPress={()=>setModalVisible(true)} style={styles.avatarContainer} >
          <Image style={styles.avatar} source={require('../assets/pin2.png')} />
          <Text style={{color:'grey'}} >{item.username}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );



  useEffect(() => {
    navigation.setOptions({title: "MUTTER", headerTitleStyle:{
      fontFamily:'NexaDemo-Bold'
    }})
    const { username} = route.params;
    axios.get(`${api_endpoint}/load/${username}/${3}`).then(res=>{
      setAD(res.data.sort((a, b) => a.distance - b.distance));
    }).catch(error=>{
      console.log(error, "error")
    })
    

    // socket.emit('load', {username, mile:3});
    // // socket.emit('load', )s

    // socket.on('loaded', (users)=>{
    //   // console.log(users, "userosss")
      // setAD(users.sort((a, b) => a.distance - b.distance));
    // });

    // socket.on('joined', ({username, location})=>{
    //   console.log(location, "endiiiiii")
    //   // console.log(username, route.params.username, "periiiiii")
    //   //   if(username !== 500 && username !== route.params.username){
    //   //     const { latitude, longitude } = location;
          
    //   //       const distance = calculateDistance(latitude, longitude, route.params.location.latitude, route.params.location.longitude)
    //   //       console.log(distance)
    //   //       if(distance <= 3){
    //   //         setAD(prev=>([...prev, {username:username, distance:distance}]))
    //   //       }
    //   //   }
    // })

    
    // socket.on('loadedtest', (data)=>{
      
    // })
    

    return()=>{
      // socket.off('loaded', ()=>{});

      socket.emit('socdisconnect', username);
    }
  }, [])


  const onSend = useCallback((messages = []) => {
    console.log(messages, "mes")
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])
  

  const onRefresh = (curUser) =>{
    axios.get(`${api_endpoint}/load/${curUser}/3`).then(res=>{
      setAD(res.data.sort((a, b)=>a.distance - b.distance));
    }).catch(error=>{
      console.log(error, "error")
    })
  }

  return (
    <View style={{flex:1, backgroundColor:'#fff'}} >
      <UserList users = {avatarData} curUser={route.params.username} refreshing={refreshing} onRefresh={onRefresh} socket_id={route.params.socket_id}/>
      
    </View>
  );
};

const styles = {
  row: {
    flexDirection: 'row',
    marginBottom: 10,

  },
  avatarContainer: {
    marginRight: 10,
    display:'flex',
    alignItems:'center'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 25,
    elevation:4,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor:'rgba(0,0,0,0.7)'
  },
  modalView: {
    flex:0.8,
    width:'100%',
    height:'100%',
    backgroundColor: 'white',
    
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
};

export default App;
