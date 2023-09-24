import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput, Keyboard, KeyboardAvoidingView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import { socket } from '../pages/socket';

import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native';


const UserList = ({users, curUser, refreshing, onRefresh, socket_id}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [textInput, setTextInput] = useState('');
    const [users_, setUsers] = useState(users);
    const [ newMessageUser, setNewMUser ] = useState({});
    

    const onSend = useCallback((messages_= [], username) => {
        setMessages(previousMessages =>

            {
                console.log(previousMessages, "prev")
                return GiftedChat.append(previousMessages, messages_)
            }
          )

        socket.emit('newMessage', {reciever: username, message:messages_, sender:curUser} );
        
      }, [])

    useEffect(() => {
        // socket.on('joined', (username)=>{
        //   console.log(username, "username")
        //     if(username !== 500){
        //         socket.emit('load', {username:username, mile:3})
        //     }
        // })

        function onNewMessage(data){
          const {message, sender, reciever} = data;
          const mess = messages.length>0?[...messages]:[{message, sender, reciever}];
          var new_ = false;
          console.log(data, "datattt")
          messages.length>0&&mess.map(mes=>{
            if(mes.sender === sender){
              mes = {...mes, message:message};
              return
            }
            
          })
          

          setMessages(mess)

          console.log(message, "andiiii")
        }

        function onSocketCreated({username, target_user}){
          navigate.navigate('Gchat', {username:target_user, curUser:curUser, latest_message:null})
        }

        socket.on('newMessage', onNewMessage)
        socket.on('loaded', (users)=>{
            setUsers(users.sort((a, b) => a.distance - b.distance));
          });

        socket.on('socket_created', onSocketCreated)


    return()=>{
      // socket.off('newMessage', onNewMessage)
        // socket.off('newMessage')
        // socket.off('joined')
        // socket.off('loaded')
        // socket.emit('socdisconnect', curUser)
    }
    }, [])
    
    const handleSend = (username) => {
        if (textInput.trim() === '') {
          return; // Prevent sending empty messages
        }
    
        // Add the new message to the messages array
        const newMessage = {
          _id: Math.random().toString(),
          text: textInput,
          createdAt: new Date(),
          user: {
            _id: 1, // Sender's user ID
            name: 'Your Name', // Sender's name
          },
        };
    
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
        socket.emit('newMessage', {reciever: username, message:[newMessage], sender:curUser} );
        setTextInput('');
    };
    const navigate = useNavigation();
  return (
    <ScrollView refreshControl={
      <RefreshControl 
        refreshing={refreshing}
        onRefresh={()=>onRefresh(curUser)}
      />
    } style={{flex:1,paddingTop:0, height:'100%' }} contentContainerStyle={{alignItems:"center", height:'100%', paddingTop:20}} >
        {
            users.map((user, index)=>{
                const me = messages.filter(mes=>mes.sender === user.username);
                console.log(me, "ppp")
                return(
                    <View key={index}  style={{width:'90%', borderRadius:5, display:'flex', flexDirection:'row', height:60, marginBottom:5, alignItems:'center', justifyContent:'space-between' }} >
                        <View style={{display:'flex', width:30, height:30, justifyContent:'center', borderRadius:50, alignItems:'center'}} >
                            <Icon name="map-marker" size={30} color={"#E4C91F"} />
                            <Text style={{color:'gray',fontFamily:'NexaDemo-Bold'}} >{parseFloat(user?.distance?.toFixed(1))}</Text>
                        </View>
                        <TouchableOpacity onPress={()=>{
                              socket.emit('socket_create', {username:curUser, target_user: user.username})
                              setMessages(prev=>prev.filter(i=>i.reciever !== curUser));

                              
                            }} style={{width:'90%', height:'100%', backgroundColor:'white',borderRadius:20,elevation:3, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}} >
                            <View style={{ marginLeft:10,  }} >
                              <Text style={{color:'gray', fontFamily:'NexaDemo-Bold',fontSize:18,}} >{user?.username}</Text>
                              {me.length>0&&<Text numberOfLines={1} ellipsizeMode="tail" style={{maxWidth:'90%', color:'#343535', fontWeight:'400', fontStyle:'italic' }}>{me[0].message[0].text}</Text>}
                            </View>
                            {messages.filter(mes=>mes.sender === user.username).length>0&&<Icon1 name="chat-alert" size={20} color={'#EAA842'} style={{paddingRight: 20,}} />}
                        </TouchableOpacity>
                    </View>
                )
            })
        }
        {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible?.open?true:false}
        
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <Pressable style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flex:0.08, width:'100%', alignItems:'center', justifyContent:'center', elevation:1, backgroundColor:'#fff', borderRadius:10 }} >
                <Text style={{color:'gray'}} >{modalVisible?.username}</Text>
            </View>
            <View style={{flex:0.9}} >
                <GiftedChat
                messages={messages}
                keyboardShouldPersistTaps="always"
                onSend={messages => onSend(messages, modalVisible?.username)}
                user={{
                    _id: 1,
                }}
                renderBubble={renderBubble}
                renderAvatar={null}
                renderInputToolbar={props => null}
                textInputProps={
                    {
                        style:{
                            color:'gray',
                            width:'80%'
                        }
                    }
                    
                }
                // renderMessageText={(props)=>{
                //     console.log(props, 'props')
                //     return(
                //         <Text
                //             {...props}
                           
                //             />
                //     )
                // }}
                
                />
                <KeyboardAvoidingView onPress={()=>Keyboard.dismiss()} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
                    <TextInput
                    style={{ flex: 1, padding: 10, borderRadius:10, backgroundColor:'#C0E6F7', elevation:3, }}
                    placeholder="Type here"
                    value={textInput}
                    onChangeText={(text) => setTextInput(text)}
                    onSubmitEditing={()=>handleSend( modalVisible?.username)}
                    returnKeyType="done"
                    keyboardAppearance="dark"
                    />
                    
                </KeyboardAvoidingView >
            </View>
          </View>
        </Pressable>
      </Modal> */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    marker: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    markerPin: {
      width: 20,
      height: 20,
      backgroundColor: 'red',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
      transform: [{ rotate: '45deg' }],
    },
    markerTextContainer: {
      backgroundColor: 'transparent',
      alignItems: 'center',
      marginTop: -10,
    },
    markerText: {
      color: 'white',
      fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,0.7)'
      },
      modalView: {
        flex:0.9,
        zIndex:10000000000,
        width:'100%',
        height:'100%',
        backgroundColor: 'white',
        
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
  });

export default UserList