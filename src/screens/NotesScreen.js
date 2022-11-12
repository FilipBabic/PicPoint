import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, ImageBackground, TextInput, StyleSheet, ScrollView, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
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
    const [showNotes, setShowNotes] = useState(false)
    const [showRecords, setShowRecords] = useState(false)
    const [recording, setRecording] = useState()
    const [recordings, setRecordings] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [errorMessageColor, setErrorMessageColor] = useState("red")
    const [notesError, setNotesError] = useState("")
    const [notesErrorColor, setNotesErrorColor] = useState("red")
    const [textFieldValue, setTextFieldValue] = useState("")
    const scrollViewRef = useRef();
    const [notes, setNotes] = useState(["note 1, this is my favorite image, from caffe prime on new belgrade, i would like to come back here one day, good staff and great coffe!!!", "note2,note 1, this is my favorite image, from caffe prime on new belgrade, i would like to come back here one day, good staff and great coffe!!!"])
    const iconWidth = screenWidth / 4 - 20

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync()
            console.log("COUNT RECORDINGS", recordings.length + 1)
            if (recordings.length + 1 > 5) {
                setErrorMessage("You have maximum allowed 5 recorded sounds for this photo.")
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
                setErrorMessage("Please grant premission to app to access microphone")
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
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: "white" }}>
                    <Text style={{ flex: 1, margin: 16, color: "red" }}>
                        Recording {index + 1} - {recordingLine.duration}
                    </Text>
                    <Button style={{ margin: 16 }}
                        onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>

                </View>
            )
        })
    }
    useEffect(() => {
        navigation.setOptions({ headerShown: false, tabBarVisible: false });
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

                        <ScrollView ref={scrollViewRef}>
                            {notes.map((item) => {
                                return (
                                    <View key={item} style={{ margin: 10, padding: 10, backgroundColor: 'white', borderRadius: 25 }}>
                                        <Text style={{ color: '#393939', fontSize: 17, fontFamily: 'Poppins-Regular' }}>
                                            {item}
                                        </Text>
                                    </View>)
                            })}
                        </ScrollView>
                        <View style={{ padding: 10, marginBottom: 20, alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', color: notesErrorColor, fontSize: 16, fontFamily: 'Poppins-Regular' }}>{notesError}</Text>
                            <TextInput
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#c8c8c8",
                                    borderRadius: 14,
                                    padding: 10,
                                    backgroundColor: 'white',
                                    fontSize: 18,
                                    fontFamily: 'Poppins-Regular',
                                    color: '#393939'
                                }}
                                onChangeText={(text) => setTextFieldValue(text)}
                                value={textFieldValue}
                                placeholder="enter your note here"
                                placeholderTextColor="rgba(178,178,178,1)"
                                keyboardType="default"
                            />
                            <TouchableWithoutFeedback onPress={() => {
                                if (notes.length > 4) {
                                    setNotesError("You have maximum allowed 5 notes for this photo.")
                                    setNotesErrorColor("red")
                                } else if (textFieldValue !== "") {
                                    setNotes([...notes, textFieldValue])
                                    setTextFieldValue("")
                                    setNotesError("Note successfully added!")
                                    setNotesErrorColor("green")
                                    setTimeout(() => {
                                        scrollViewRef.current.scrollToEnd({ animated: true })
                                    }, 100)
                                } else if (textFieldValue === "") {
                                    setNotesError("Text Field is empty")
                                    setNotesErrorColor("red")
                                }

                                scrollViewRef.current.scrollToEnd({ animated: true })
                            }}>
                                <LinearGradient
                                    style={{
                                        marginTop: 20,
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
                        </View>

                    </View>
                }
                {showRecords &&
                    <View style={{ flex: 0.69 }}>
                        <Text style={{ textAlign: 'center', justifyContent: 'center', color: 'red' }}>
                            {errorMessage}
                        </Text>
                        <Button
                            title={recording ? 'STOP RECORDING' : 'START RECORDING'}
                            onPress={recording ? stopRecording : startRecording}
                            style={{ color: 'red', fontFamily: 'Poppins-Regular' }}
                        />
                        {getRecordingLines()}
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