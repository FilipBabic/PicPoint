import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
const Album = ({ album, navigation }) => {
    const test = () => {
        console.log("clicked", album.title)
        console.log("NAVIGATION", navigation.getState())
    }
    return (
        <View style={{ paddingTop: 4 }}>
            <Button onPress={() => {
                navigation.navigate('Details', {
                    albumTitle: album.title,
                    otherParam: 'anything you want here',
                });
            }} title={`${album.title}`} />
        </View>
    )
}

export default Album;