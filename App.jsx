import { View, Text, StatusBar, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Chat from './src/pages/Chat';
import Landing from './src/pages/Landing';
import Geolocation from 'react-native-geolocation-service';
import GChat from './src/components/GChat';
import { socket } from './src/pages/socket';

const Stack = createStackNavigator();

function NavigationStack({isAuth}) {
  console.log(isAuth, "auuuu")
  return (
    <Stack.Navigator>
      
      <Stack.Screen options={{headerShown:false}} name="Landing" component={Landing} />
      <Stack.Screen name="chat" component={Chat} />
      <Stack.Screen name="Gchat" component={GChat} />
      
    </Stack.Navigator>
  );
}

const App = () => {
  const [loading, setLoading] = useState(false);
  const [isAuth, setAuth] = useState(false);

  useEffect(()=>{
    return()=>{
      socket.emit('socdisconnect')
    }
  }, [])
  return (
    <View style={{flex:1, justifyContent:"center", backgroundColor:'#F3E982'}} >
      {
        loading?(
          <ActivityIndicator size={50} />
        ):(
          <NavigationContainer>
              <NavigationStack isAuth={isAuth} />
          </NavigationContainer>
        )
      }
    </View>
  )
}

export default App