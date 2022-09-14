import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableHighlight, TouchableOpacity, Image, Dimensions } from 'react-native';
import Notes from '../icons/27-notes.png';
import NotesSel from '../icons/28-notes-selected.png';
import Record from '../icons/29-record.png';
import RecordSel from '../icons/30-record-selected.png';
import Close from '../icons/05-close.png';
const screenWidth = Dimensions.get('window').width;
const NotesScreen = ({ route, navigation }) => {
    const uri = route.params.uri;
    const place = route.params.place;
    const [selected, setSelected] = useState([false, false])
    const iconWidth = screenWidth / 4 - 20
    useEffect(() => {
        navigation.setOptions({ headerShown: false, tabBarVisible: false });
    }, []);
    return (
        <ImageBackground source={{ uri: uri }} style={{ flex: 1, width: 'auto', height: 'auto' }}>
            <View style={{ backgroundColor: 'rgba(200,200,200,0.3)', flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                <View style={styles.bottomContainer}>
                    <TouchableHighlight onPress={() => {
                        navigation.navigate('Home');
                    }} style={{
                        position: 'absolute', width: 40, height: 40, top: -20, borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }} >
                        <Image source={Close} style={{ height: 40, width: 40 }} />
                        {/* <Text style={{ paddingTop: 5, alignItems: 'center', textAlign: 'center' }}>X</Text> */}
                    </TouchableHighlight>
                    <Text style={{ color: '#393939', fontSize: 18, fontWeight: 'bold', paddingTop: 24, paddingBottom: 10, textAlign: 'center' }}>
                        {place}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10 }}>
                        <TouchableOpacity onPress={() => setSelected([true, false])}>
                            <View style={styles.buttonView}>
                                <Image source={selected[0] ? NotesSel : Notes} style={{ height: iconWidth, width: iconWidth }} />
                                <Text style={styles.buttonText}>
                                    Notes
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelected([false, true])}>
                            <View style={styles.buttonView}>
                                <Image source={selected[1] ? RecordSel : Record} style={{ height: iconWidth, width: iconWidth }} />
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
        flex: 0.31,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    },
    buttonView: {
        flex: 1, flexDirection: 'column', alignItems: 'center', minWidth: screenWidth / 4
    },
    buttonText: {
        textAlign: 'center', fontSize: 15, fontWeight: 'bold', color: 'rgba(178,178,178,1)', padding: 5
    }
});
export default NotesScreen;