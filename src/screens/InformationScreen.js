import React from 'react';
import { View, Button, ImageBackground, Text } from 'react-native';
const InformationScreen = ({ route, navigation }) => {
    const { itemId, otherParam } = route.params;
    return (
        <ImageBackground source={{ uri: itemId }} style={{ width: '100%', height: '100%' }}>
            <View style={{ backgroundColor: 'rgba(200,200,200,0.3)', width: '100%', height: '100%' }}>
                <Text>
                    SPORTSKI POZDRAV INFO SCREEN
                </Text>
                <Text>itemId: {JSON.stringify(itemId)}</Text>
                <Text>otherParam: {JSON.stringify(otherParam)}</Text>
                <View style={{ bottom: 0, height: '50%', width: '100%' }}>
                    <Text>TEXT</Text>
                </View>
                <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
            </View>
        </ImageBackground>
    );
}
export default InformationScreen;