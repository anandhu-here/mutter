import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (value) => {
    try {
        await AsyncStorage.setItem('username', value);
    } catch (e) {
        // saving error
    }
};
  
  

export const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('username');
        return value != null ? value : null;
    } catch (e) {
        // error reading value
    }
};