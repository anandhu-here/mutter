import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import styles from './styles';

export default class UserItem extends Component {
    shouldComponentUpdate(nextProps) {
        
    }

    onPress = () => {
        alert('Clicked ');
    };

    render() {
        const { name, picture } = this.props.item;
        return (
            <TouchableOpacity
                onPress={this.onPress}
                rippleColor="rgba(0, 0, 0, .20)"
            >
                <View style={styles.item}>
                    {/* <Avatar uri={picture.thumbnail} enableDot /> */}
                    <Text style={styles.userName}>
                        {name.first[0].toUpperCase() +
                            name.first.slice(1) +
                            ' ' +
                            name.last[0].toUpperCase() +
                            name.last.slice(1)}
                    </Text>
                    {/* <Image style={styles.wave} source={Images.profile.wave} /> */}
                </View>
            </TouchableOpacity>
        );
    }
}
