import React, { useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Notes from '../icons/13Notes.png';
import Record from '../icons/14Record.png';
const screenWidth = Dimensions.get('window').width;
const NotesScreen = ({ route, navigation }) => {
    const uri = route.params.uri;
    const place = route.params.place;
    const iconWidth = screenWidth / 4 - 20
    useEffect(() => {
        navigation.setOptions({ headerShown: false, tabBarVisible: false });
    }, []);
    return (
        <ImageBackground source={{ uri: uri }} style={{ flex: 1, width: 'auto', height: 'auto' }}>
            <View style={{ backgroundColor: 'rgba(200,200,200,0.3)', flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                <View style={styles.bottomContainer}>
                    <Text style={{ fontSize: 16, padding: 10 }}>
                        {place}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10 }}>
                        <TouchableOpacity >
                            <View style={styles.buttonView}>
                                <Image source={Notes} style={{ height: iconWidth, width: iconWidth }} />
                                <Text style={styles.buttonText}>
                                    Notes
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <View style={styles.buttonView}>
                                <Image source={Record} style={{ height: iconWidth, width: iconWidth }} />
                                <Text style={styles.buttonText}>
                                    Record
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    bottomContainer: {
        flex: 0.3,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    buttonView: {
        flex: 1, flexDirection: 'column', alignItems: 'center', minWidth: screenWidth / 4
    },
    buttonText: {
        textAlign: 'center', fontSize: 15, fontWeight: 'bold', color: 'rgba(178,178,178,1)', padding: 5
    }
});
export default NotesScreen;