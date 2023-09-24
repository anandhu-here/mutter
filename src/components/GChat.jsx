import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import { socket } from '../pages/socket';
import axios from 'axios';
import { api_endpoint } from '../pages/api';
import Icon from 'react-native-vector-icons/Octicons';
const customtInputToolbar = props => {
    return (
    
      <InputToolbar
        
        {...props}
        containerStyle={{
            width:'100%'
        }}
      />
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor:'#007AFF', // Change the background color for your own color
          },
          left: {
            backgroundColor: props.currentMessage.user._id===0?'transparent':'#E5E5EA', // Change the background color for received messages
          },
        }}
        textStyle={{
          right: {
            color: 'white', // Change the text color for your own messages
          },
          left: {
            fontWeight:props.currentMessage.user._id===0?'700':"300",
            color: props.currentMessage.user._id===0?'#EAA842':'black', // Change the text color for received messages
          },
        }}
      />
    );
  };
  
const GChat = ({route, navigation}) => {

  const {socket_id, latest_message} = route.params;
    const [messages, setMessages] = useState(latest_message?latest_message:[]);
    const [textInput, setTextInput] = useState('');
    const [ newMessageUser, setNewMUser ] = useState({});
    const [pending, setPending] = useState(true);
    const handleSend = () => {
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
          }
        };
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
        
        socket.emit('newMessage', {reciever: route.params.username, message:[newMessage], sender:route.params.curUser} );
        setTextInput(''); // Clear the text input after sending
      };


      const onSend = useCallback((messages_= [], username) => {
        setMessages(previousMessages =>

            {
                return GiftedChat.append(previousMessages, messages_)
            }
          )

        socket.emit('newMessage', {reciever: username, message:messages_, sender:route.params.curUser} );
        
      }, [])


      useEffect(() => {
        navigation.setOptions({title: route.params.username, headerTitleStyle:{
          fontFamily:'NexaDemo-Bold'
        }});

        axios.get(`${api_endpoint}/getMessages/${route.params.curUser}/${route.params.username}`).then(res=>{
          setMessages(res.data.data);
        }).catch(error=>{
          console.log(error, "error")
        })
        socket.on('newMessage', (data)=>{
            const {message, sender, reciever} = data;
            if(pending){
              setPending(false);
            }
           setMessages(previousMessages =>
              GiftedChat.append(previousMessages, message),
            )
        })

        function onMessagePending(id){

          setMessages(previousMessages=>previousMessages.filter(message=>message._id!== id));
          setMessages((previousMessages) => GiftedChat.append(previousMessages, [{
            _id: Math.random().toString(),
            text: `Wait for ${route.params.username} to text back...`,
            createdAt: new Date(),
            user: {
              _id: 0, // Sender's user ID
              name: 'Your Name', // Sender's name
            }
          }]));
          // if(messages.length>0){
          //   const temp = [...messages];
          //   temp.pop();

          //   setMessages(temp);
          // }
        }
        
        socket.on('newMessagePending', onMessagePending)

    return()=>{
        // socket.off('newMessage');
        socket.off('newMessagePending', onMessagePending)
        // socket.off('joined')
        // socket.off('loaded')
    }
    }, [])


    const renderInputToolbar = (props) => {
      return (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholderTextColor={"white"}
            placeholder="Type your message..."
            {...props}
            value={textInput}
            multiline
            onChangeText={(text)=>setTextInput(text)}

          />
          <TouchableOpacity style={{ display:'flex', height:40, width:40,backgroundColor:'rgba(228, 255, 255,0.4)', justifyContent:'center', alignItems:'center', borderRadius:10, elevation:5 }} onPress={() => handleSend(textInput)}>
            <Icon name='paper-airplane' size={25} color="white" />
          </TouchableOpacity>
        </View>
      );
    };

    
  return (
    <ImageBackground style={{
      flex:1
    }} source={require('../assets/chatwal6.jpg')} >
      <GiftedChat
        messages={messages}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages, route.params?.username)}
        user={{
            _id: 1,
        }}
        renderBubble={renderBubble}
        renderAvatar={null}
        
        textInputProps={
            {
                style:{
                    color:'gray',
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
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#ccc',
    display:'flex',
    width:'100%',
    justifyContent:"space-evenly"
  },
  input: {
    display:'flex',
    width:'85%',
    height: 40,
    borderColor: '#ccc',
    backgroundColor:'rgba(228, 255, 255,0.3)',
    borderRadius: 10,
    color:'white',
    paddingHorizontal: 10,
    
    
  },
  sendButton: {
    color: 'blue',
    fontSize: 16,
  },
});

export default GChat