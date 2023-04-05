import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, ImageBackground, TextInput, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import Notes from '../icons/27-notes.png';
import NotesSel from '../icons/28-notes-selected.png';
import Record from '../icons/29-record.png';
import RecordSel from '../icons/30-record-selected.png';
import Close from '../icons/05-close.png';
import PlayIcon from '../icons/34-play-icon.png';
import SaveIcon from '../icons/35-save-icon.png';
import BackArrow from '../icons/04-arrow-back.png';

const screenWidth = Dimensions.get('window').width;
const NotesScreen = ({ route, navigation }) => {
    const uri = route.params.uri;
    const place = route.params.place;
    const itemId = route.params.itemId;
    const [selected, setSelected] = useState([false, false])
    const [showNotes, setShowNotes] = useState(false)
    const [addNote, setAddNote] = useState(true)
    const [showRecords, setShowRecords] = useState(false)
    const [recording, setRecording] = useState()
    const [recordings, setRecordings] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [errorMessageColor, setErrorMessageColor] = useState("red")
    const [errorRecordingsMessage, setRecordingsErrorMessage] = useState("")
    const [errorRecordingsMessageColor, setErrorRecordingsMessageColor] = useState("red")
    const [textFieldTitle, setTextFieldTitle] = useState("")
    const [textFieldBody, setTextFieldBody] = useState("")
    const scrollViewRef = useRef();
    const [notes, setNotes] = useState(null)
    const [edit, setEdit] = useState(null)
    const [sound, setSound] = useState()
    const iconWidth = screenWidth / 4 - 20
    const loadNotesFromLocalStorage = async (image_id) => {
        try {
            const item = await AsyncStorage.getItem(`@${image_id}`)
            const data = JSON.parse(item)
            const storedNotes = data?.notes
            if (typeof storedNotes === "undefined") {
                setNotes([])
            } else {
                setNotes(storedNotes)
            }
        } catch (e) {
            console.error(e)
        }
    }
    const saveNotesToLocalStorage = async (image_id, deleted) => {
        try {
            await AsyncStorage.mergeItem(`@${image_id}`, JSON.stringify({ notes: notes }))
            //let person = await AsyncStorage.getItem(`@${image_id}`)
            deleted ? setErrorMessage("Note successfully deleted!") : setErrorMessage("Note successfully added!")
            setErrorMessageColor("green")
            setAddNote(true)
            setTextFieldTitle("")
            setTextFieldBody("")
        } catch (e) {
            console.error(e);
        }
    }
    const loadRecordingsFromLocalStorage = async (image_id) => {
        try {
            const item = await AsyncStorage.getItem(`@${image_id}`)
            const data = JSON.parse(item)
            const storedRecordings = data?.recordings

            if (typeof storedRecordings === "undefined") {
                setRecordings([])
            } else {
                setRecordings(storedRecordings)
            }
            console.log("RECORDINGS", recordings)
            console.log("STORED RECORDINGS", storedRecordings)
        } catch (e) {
            console.error(e)
        }
    }
    const saveRecordingsToLocalStorage = async (image_id, deleted, obj) => {
        try {
            await AsyncStorage.mergeItem(`@${image_id}`, JSON.stringify({ recordings: obj }))
            let person = await AsyncStorage.getItem(`@${image_id}`)
            deleted ? setRecordingsErrorMessage("Record successfully deleted!") : setRecordingsErrorMessage("Record successfully added!")
            setErrorRecordingsMessageColor("green")
        } catch (e) {
            console.error(e);
        }
    }
    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync()
            // MAXIMUM RECORDINGS
            if (recordings.length > 4) {
                setErrorRecordingsMessageColor("red")
                setRecordingsErrorMessage("You have maximum allowed 5 recorded sounds for this photo.")
                return
            }
            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                })
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESENT_HIGH_QUALITY
                )

                setRecording(recording)
            } else {
                setRecordingsErrorMessage("Please grant premission to app to access microphone")
            }
        }
        catch (err) {
            console.error("Failed to start recording", err)
        }
    }
    const stopRecording = async () => {
        setRecording(undefined)
        await recording.stopAndUnloadAsync()
        let updatedRecordings = [...recordings]
        const { sound, status } = await recording.createNewLoadedSoundAsync()
        updatedRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            //file to save in cloud database
            file: recording.getURI()
        })
        setRecordings(updatedRecordings)
        saveRecordingsToLocalStorage(itemId, false, updatedRecordings)
    }
    const playLocalSound = async (test) => {
        const sound1 = test.file
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        })
        const { sound } = await Audio.Sound.createAsync(
            {
                uri: `${sound1}`
            }
        );
        setSound(sound);
        console.log('Playing Sound');
        await sound.replayAsync();
    }
    const getDurationFormatted = (millis) => {
        const minutes = millis / 1000 / 60
        const minutesDisplay = Math.floor(minutes)
        const seconds = Math.round((minutes - minutesDisplay) * 60)
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds
        return `${minutesDisplay}:${secondsDisplay}`
    }
    const getRecordingLines = () => {
        return recordings.map((recordingLine, index) => {
            return (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 30, marginLeft: 14, marginRight: 14, marginBottom: 8, padding: 8 }}>
                    <Text style={{ color: '#393939', fontSize: 18, fontFamily: 'Poppins-Bold', paddingLeft: 8, paddingRight: 8, textAlign: 'center' }}>
                        Voice Note {index + 1} - <Text style={{ color: '#6f7071', fontSize: 17 }}>{recordingLine.duration}</Text>
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            onPress={() => playLocalSound(recordingLine)} title="Replay"><Image source={PlayIcon} style={{ height: 40, width: 40 }} /></TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => createDeleteRecordAlert(index)} title="Replay"><Image source={Close} style={{ height: 30, width: 30, marginTop: 5, marginLeft: 5, marginRight: 5 }} /></TouchableOpacity>
                    </View>
                </View>
            )
        })
    }
    const createDeleteNoteAlert = (i) => {
        Alert.alert('Delete Note', 'Are you sure you want to delete this note', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    var notesArray = notes
                    notesArray.splice(i, 1)
                    setNotes(notesArray)
                    saveNotesToLocalStorage(itemId, true)
                    loadNotesFromLocalStorage(itemId)
                    setEdit(null)
                }
            },
        ]);
    }
    const createDeleteRecordAlert = (i) => {
        Alert.alert('Delete Record', 'Are you sure you want to delete this record', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    var recordingsArray = recordings
                    recordingsArray.splice(i, 1)
                    setRecordings(recordingsArray)
                    saveRecordingsToLocalStorage(itemId, true, recordingsArray)
                    loadRecordingsFromLocalStorage(itemId)
                    setEdit(null)
                }
            },
        ]);
    }
    useEffect(() => {
        navigation.setOptions({ headerShown: false, tabBarVisible: false });
        //setNotes([])
        loadNotesFromLocalStorage(itemId)
        loadRecordingsFromLocalStorage(itemId)
    }, []);
    const [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../fonts/Poppins-Bold.ttf'),
    });
    if (!fontsLoaded) {
        return null;
    }
    return (
        <ImageBackground source={{ uri: uri }} style={{ flex: 1, width: 'auto', height: 'auto' }}>
            <View style={{ backgroundColor: 'rgba(200,200,200,0.3)', flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                {showNotes &&
                    <View style={{ flex: 0.69 }}>
                        {addNote && <View style={{ padding: 0, alignItems: 'center' }}>
                            <TouchableWithoutFeedback onPress={() => {
                                setTextFieldTitle("")
                                setTextFieldBody("")
                                setEdit(null)
                                //MAXIMUM NOTES
                                if (notes.length > 4) {
                                    setErrorMessage("You have maximum allowed 5 notes for this photo!!!")
                                    setErrorMessageColor("red")
                                } else {
                                    setErrorMessage("")
                                    setAddNote(false)
                                }
                            }}>
                                <LinearGradient
                                    style={{
                                        marginTop: 10,
                                        marginBottom: 10,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#EB00A0',
                                        height: 40,
                                        width: screenWidth / 2 - 25,
                                        borderRadius: 30
                                    }}
                                    colors={['#E0038C', '#6A2B90']}>

                                    <Text style={{ color: 'white', fontFamily: 'Poppins-Bold' }}>
                                        ADD NOTE
                                    </Text>
                                </LinearGradient>
                            </TouchableWithoutFeedback>
                            <View style={{ width: screenWidth }}>
                                <ScrollView ref={scrollViewRef}>
                                    {notes.map((item, index) => {
                                        return (
                                            <View key={index} style={{ height: 56, backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 30, marginLeft: 14, marginRight: 14, marginBottom: 8, paddingLeft: 20, paddingRight: 20, borderRadius: 25, justifyContent: 'center' }}>
                                                <TouchableWithoutFeedback onPress={() => {
                                                    setEdit(index)
                                                    setAddNote(false)
                                                    setTextFieldTitle(item.title)
                                                    setTextFieldBody(item.body)
                                                }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', textAlign: 'center', paddingTop: 8, paddingBottom: 8 }}>
                                                        <Text style={{ color: '#393939', fontSize: 18, fontFamily: 'Poppins-Bold' }}>
                                                            {item.title === "" ? item.body : item.title}
                                                        </Text>
                                                        <TouchableWithoutFeedback onPress={() => createDeleteNoteAlert(index)}>
                                                            <Image source={Close} style={{ height: 30, width: 30 }} />
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                            </View>)
                                    })}
                                </ScrollView>
                            </View>
                        </View>
                        }
                        {!addNote &&
                            <View style={{ backgroundColor: 'red', flex: 0.90, borderRadius: 25, marginTop: 10, marginLeft: 10, marginRight: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#c0c0c1', borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}>
                                    <TouchableWithoutFeedback style={{ backgroundColor: 'yellow', height: 80, width: 80 }} onPress={() => {
                                        setErrorMessage("")
                                        setAddNote(true)
                                    }}><Image source={BackArrow} style={{ paddingLeft: 8, paddingRight: 8, height: 25, width: 8 }} /></TouchableWithoutFeedback>
                                    <Text style={{ color: '#393939', fontSize: 18, fontFamily: 'Poppins-Bold' }}>Note {edit !== null ? edit + 1 : notes.length + 1}</Text>
                                    <TouchableWithoutFeedback onPress={() => {
                                        if (textFieldBody !== "") {
                                            setAddNote(false)
                                            var notesArray = notes
                                            const notesObj = {
                                                title: textFieldTitle,
                                                body: textFieldBody
                                            }
                                            if (edit === null) {
                                                notesArray.push(notesObj)
                                            } else {
                                                notesArray[edit] = notesObj
                                            }
                                            setNotes(notesArray)
                                            saveNotesToLocalStorage(itemId, false)
                                            setEdit(null)
                                        } else if (textFieldBody === "") {
                                            setErrorMessage("Note body is required field and can't be empty")
                                            setErrorMessageColor("red")
                                        }
                                        //scrollViewRef.current.scrollToEnd({ animated: true })
                                    }}><Image source={SaveIcon} style={{ height: 30, width: 30 }} /></TouchableWithoutFeedback>
                                </View>
                                <TextInput
                                    style={{

                                        padding: 10,
                                        backgroundColor: 'white',
                                        fontSize: 18,
                                        fontFamily: 'Poppins-Bold'
                                    }}
                                    onChangeText={(text) => setTextFieldTitle(text)}
                                    value={textFieldTitle}
                                    placeholder="Write Your Note Title Here"
                                    placeholderTextColor="#393939"
                                    keyboardType="default"
                                /><TextInput
                                    style={{
                                        flex: 1,
                                        alignItems: 'flex-start',
                                        borderBottomLeftRadius: 25,
                                        borderBottomRightRadius: 25,
                                        padding: 10,
                                        height: 'auto',
                                        fontSize: 18,
                                        fontFamily: 'Poppins-Regular',
                                    }}
                                    onChangeText={(text) => setTextFieldBody(text)}
                                    value={textFieldBody}
                                    placeholder="Write your note here"
                                    placeholderTextColor="rgba(178,178,178,1)"
                                    backgroundColor="white"
                                    keyboardType="default"
                                    multiline
                                    editable
                                    numberOfLines={4}
                                />
                            </View>
                        }
                        <Text style={{ textAlign: 'center', color: errorMessageColor, fontSize: 16, fontFamily: 'Poppins-Regular' }}>{errorMessage}</Text>
                    </View>
                }
                {showRecords &&
                    <View style={{ flex: 0.69 }}>
                        <View style={{
                            padding: 0, alignItems: 'center'
                        }}>
                            <TouchableWithoutFeedback
                                onPress={recording ? stopRecording : startRecording}
                            >
                                <LinearGradient
                                    style={{
                                        marginTop: 10,
                                        marginBottom: 10,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#EB00A0',
                                        height: 40,
                                        width: screenWidth / 2 - 25,
                                        borderRadius: 30
                                    }}
                                    colors={['#E0038C', '#6A2B90']}>
                                    <Text style={{
                                        fontFamily: 'Poppins-Bold',
                                        color: 'white',
                                    }}>
                                        {recording ? 'STOP RECORDING' : 'START RECORDING'}
                                    </Text>
                                </LinearGradient>
                            </TouchableWithoutFeedback>
                        </View>
                        {getRecordingLines()}
                        <Text style={{ textAlign: 'center', color: errorRecordingsMessageColor, fontSize: 16, fontFamily: 'Poppins-Regular' }}>
                            {errorRecordingsMessage}
                        </Text>
                    </View>
                }
                <View style={styles.bottomContainer}>
                    <TouchableWithoutFeedback onPress={() => {
                        navigation.goBack();
                    }} >
                        <Image source={Close} style={styles.closeButton} />
                    </TouchableWithoutFeedback>
                    <Text style={{ color: '#393939', fontSize: 18, fontFamily: 'Poppins-Bold', paddingTop: 24, paddingBottom: 10, textAlign: 'center' }}>
                        {place}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10 }}>
                        <TouchableOpacity onPress={() => {
                            setSelected([true, false])
                            setShowNotes(!showNotes),
                                setShowRecords(false)
                        }}>
                            <View style={styles.buttonView}>
                                <Image source={selected[0] ? NotesSel : Notes} style={{ height: iconWidth, width: iconWidth }} />
                                <Text style={[styles.buttonText, , { fontFamily: 'Poppins-Bold' }]}>
                                    Notes
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setSelected([false, true])
                            setShowNotes(false),
                                setShowRecords(!showRecords)
                        }}>
                            <View style={styles.buttonView}>
                                <Image source={selected[1] ? RecordSel : Record} style={{ height: iconWidth, width: iconWidth }} />
                                <Text style={[styles.buttonText, , { fontFamily: 'Poppins-Bold' }]}>
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
    closeButton: { position: 'absolute', top: -20, height: 40, width: 40 },
    buttonView: {
        flex: 1, flexDirection: 'column', alignItems: 'center', minWidth: screenWidth / 4
    },
    buttonText: {
        textAlign: 'center', fontSize: 15, fontWeight: 'bold', color: 'rgba(178,178,178,1)', padding: 5
    }
});
export default NotesScreen;