import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Dimensions, Keyboard, Image, View, Text, TextInput, Linking, ImageBackground, TouchableWithoutFeedback, TouchableHighlight, ScrollView, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import About from '../icons/10-about.png';
import AboutSel from '../icons/11-about-selected.png';
import Website from '../icons/12-website.png';
import WebsiteSel from '../icons/13-website-selected.png';
import Location from '../icons/13-location.png';
import LocationSel from '../icons/14-location-selected.png';
import Phone from '../icons/15-phone.png';
import PhoneSel from '../icons/16-phone-selected.png';
import Weather from '../icons/17-weather.png';
import WeatherSel from '../icons/18-weather-selected.png';
import Photos from '../icons/19-photos.png';
import PhotosSel from '../icons/20-photos-selected.png';
import Attractions from '../icons/21-attractions.png';
import AttractionsSel from '../icons/22-attractions-selected.png';
import Accomodations from '../icons/23-accommodations.png';
import AccomodationsSel from '../icons/24-accommodations-sel.png';
import Food from '../icons/25-food.png';
import FoodSel from '../icons/26-food-selected.png';
import Close from '../icons/05-close.png';
import EditIcon from '../icons/02-edit-dark.png'
const screenWidth = Dimensions.get('window').width;

const InfoScreen = ({ route, navigation }) => {
    const GoogleMapsAPIKey = 'AIzaSyBU4bjZbr_wzt3_UPTfIj-WHjoqf_7orOA';
    const itemId = route.params.itemId;
    const uri = route.params.uri;
    const place = route.params.place;
    const place_id = route.params.place_id;
    const longitude = route.params.longitude;
    const latitude = route.params.latitude;
    const iconWidth = screenWidth / 4 - 20
    const scrollViewRef = useRef();
    // const [locationState, setLocationState] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showPhotos, setShowPhotos] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [aboutText, setAboutText] = useState("")
    const [wLocation, setWlocation] = useState("");
    const [wTime, setWtime] = useState("");
    const [wIcon, setWicon] = useState(null);
    const [website, setWebsite] = useState("");
    const [url, setUrl] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [photos, setPhotos] = useState([]);
    const [temp, setTemp] = useState("");
    const [condition, setCondition] = useState("");
    const [showWeather, setShowWeather] = useState(false)
    const [selected, setSelected] = useState([false, false, false, false, false, false, false, false, false, false]);
    const getLocationInfo = async (place_id) => {
        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/place/details/json?fields=international_phone_number%2Curl%2Cwebsite%2Cphotos&place_id=' + place_id + '&key=' + GoogleMapsAPIKey);
            const data = await response.json()
            // setName(data.result?.name);
            // setRating(data.result?.rating);
            // setPhotos(data.result?.photos);
            // setBusinessStatus(data.result?.business_status);
            setPhoneNumber(data.result?.international_phone_number);
            setUrl(data.result?.url);
            setWebsite(data.result?.website);
            setPhotos(data.result?.photos);
            console.log("WEBSITE", data.result?.url)
            // setOpenNow(data.result?.opening_hours?.open_now);
            // setWeekDayText(data.result?.opening_hours?.weekday_text)
            // setTotalUserRankings(data.result?.user_ratings_total)
        } catch (error) {
            console.error(error);
        }
    }
    const getWeatherInfo = async (longitude, latitude) => {
        fetch(`http://api.weatherapi.com/v1/current.json?q=${latitude},${longitude}&key=d1026a1d4a9144eeb91165513221512`)
            .then((response) => response.json())
            .then((json) => {
                setTemp(
                    json.current.temp_c
                );
                setCondition(json.current?.condition?.text)
                setWlocation(`${json.location?.name}, ${json.location?.region}`)
                setWtime(json.location?.localtime)
                let wicon = "https://" + json.current?.condition?.icon.slice(2)
                setWicon(wicon)
                console.log("CURENT TEMP", json.current.temp_c)
            }).catch((error) => {
                console.error(error);
            })
    }
    useEffect(() => {
        //SplashScreen.preventAutoHideAsync();
        navigation.setOptions({ headerShown: false, tabBarVisible: false });
        getLocationInfo(place_id)
        getWeatherInfo(longitude, latitude)
        console.log("place ID ", place_id, longitude, latitude, website, wIcon);
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
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <View style={styles.container} >
                    {showAbout && (
                        <View style={{ flex: 0.59, marginLeft: '10%', marginRight: '10%' }}>
                            {/* <TouchableWithoutFeedback onPress={() => {

                        }}>
                            <Image source={EditIcon} style={{
                                backgroundColor: 'white',
                                height: 20,
                                width: 20,
                                marginLeft: 12
                            }} title="Info Button" />
                        </TouchableWithoutFeedback> */}
                            <TextInput
                                style={{
                                    borderWidth: 1,
                                    borderRadius: 25,
                                    backgroundColor: 'white',
                                    padding: 8,
                                    fontSize: 18,
                                    fontFamily: 'Poppins-Regular',
                                    color: '#3d3d3d'
                                }}
                                onChangeText={(text) => setAboutText(text)}
                                value={aboutText}
                                textAlign={'center'}
                                multiline={true}
                                placeholder="Enter Photo Hint"
                                placeholderTextColor="rgba(178,178,178,1)"
                                keyboardType="default"
                            />
                        </View>
                    )}
                    {showWeather && (
                        <View style={{ flex: 0.59 }}>
                            <View style={{ backgroundColor: 'white', alignItems: 'center', width: '60%', marginLeft: '20%', paddingTop: 20, paddingBottom: 20, borderRadius: 25 }}>
                                <Text style={{ fontSize: 18, textAlign: 'center' }}>
                                    {wLocation}
                                </Text>
                                <Text style={{ fontSize: 50, textAlign: 'center' }}>
                                    {temp}°
                                </Text>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                        {condition}
                                    </Text>
                                    <Image source={{ uri: `${wIcon}` }} style={{ height: 80, width: 80 }} />
                                </View>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                    {wTime}
                                </Text>
                            </View>
                        </View>
                    )}
                    {showPhotos && (
                        <View style={{ flex: 0.69, alignItems: 'center', }}>
                            <ScrollView horizontal >
                                {photos.map((item) => {
                                    { console.log("Photo refere", item) }
                                    return (
                                        <View>
                                            {/* <Text style={{ color: 'yellow' }}>
                                        {item.photo_reference}
                                        zzz
                                    </Text> */}
                                            <Image source={About} style={{ width: screenWidth, height: screenWidth }} />
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View>
                    )}
                    {showInfo && <View style={{ position: 'absolute', top: 150, backgroundColor: 'white', padding: 20, width: screenWidth, height: 120 }}>
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, textAlign: 'center', paddingBottom: 20 }}>
                                There is no information available!!!
                            </Text>
                            <TouchableHighlight onPress={() => setShowInfo(false)}>
                                <Text style={{ height: 40, width: 100, textAlign: 'center', paddingTop: 8, fontSize: 20, backgroundColor: '#162b54', color: 'white' }}>OK</Text>
                            </TouchableHighlight>
                        </View>
                    </View>}
                    <View style={styles.bottomContainer}>
                        <TouchableWithoutFeedback onPress={() => {
                            navigation.goBack();
                        }} >
                            <Image source={Close} style={styles.closeButton} />
                        </TouchableWithoutFeedback>
                        <Text style={[styles.title, { fontFamily: 'Poppins-Bold' }]}>
                            {place}
                        </Text>
                        <View style={{ flex: 1 }}>
                            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.menu} horizontal={true}>
                                <TouchableWithoutFeedback onPress={() => {
                                    setSelected([true, false, false, false, false, false, false, false, false, false])
                                    setShowWeather(false)
                                    setShowAbout(true)
                                }}>
                                    <View style={styles.buttonView}>
                                        <Image source={selected[0] ? AboutSel : About} style={{ height: iconWidth, width: iconWidth }} />
                                        <Text style={{ fontFamily: selected[0] ? 'Poppins-Bold' : 'Poppins-Regular', color: '#666666' }}>
                                            About
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    setSelected([false, true, false, false, false, false, false, false, false, false])
                                    setShowWeather(false)
                                    setShowAbout(false)
                                    Linking.canOpenURL(`${website}`).then(supported => {
                                        if (supported) {
                                            Linking.openURL(`${website}`)
                                        } else {
                                            setShowInfo(true);
                                        }
                                    })
                                }}>
                                    <View style={styles.buttonView}>
                                        <Image source={selected[1] ? WebsiteSel : Website} style={{ height: iconWidth, width: iconWidth }} />
                                        <Text style={{ fontFamily: selected[1] ? 'Poppins-Bold' : 'Poppins-Regular', color: '#666666' }}>
                                            Website
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    setSelected([false, false, true, false, false, false, false, false, false, false])
                                    setShowWeather(false)
                                    setShowAbout(false)
                                    Linking.canOpenURL(`${url}`).then(supported => {
                                        if (supported) {
                                            Linking.openURL(`${url}`)
                                        } else {
                                            setShowInfo(true);
                                        }
                                    })
                                }}>
                                    <View style={styles.buttonView}>
                                        <Image source={selected[2] ? LocationSel : Location} style={{ height: iconWidth, width: iconWidth }} />
                                        <Text style={{ fontFamily: selected[2] ? 'Poppins-Bold' : 'Poppins-Regular', color: '#666666' }}>
                                            Location
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    setSelected([false, false, false, true, false, false, false, false, false, false])
                                    setShowWeather(false)
                                    setShowAbout(false)
                                    phoneNumber == "undefined" ? setShowInfo(true) : Linking.openURL(`tel:${phoneNumber}`)
                                }}>
                                    <View style={styles.buttonView}>
                                        <Image source={selected[3] ? PhoneSel : Phone} style={{ height: iconWidth, width: iconWidth }} />
                                        <Text style={{ fontFamily: selected[3] ? 'Poppins-Bold' : 'Poppins-Regular', color: '#666666' }}>
                                            Phone
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    setSelected([false, false, false, false, true, false, false, false, false, false])
                                    setShowWeather(true)
                                    setShowAbout(false)
                                    //setShowPhotos(false)
                                }}>
                                    <View style={styles.buttonView}>
                                        <Image source={selected[4] ? WeatherSel : Weather} style={{ height: iconWidth, width: iconWidth }} />
                                        <Text style={{ fontFamily: selected[4] ? 'Poppins-Bold' : 'Poppins-Regular', color: '#666666' }}>
                                            Weather
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    setSelected([false, false, false, false, false, true, false, false, false, false])
                                    setShowWeather(false)
                                    setShowAbout(false)
                                    //setShowPhotos(true)
                                }}>
                                    <View style={styles.buttonView}>
                                        <Image source={selected[5] ? PhotosSel : Photos} style={{ height: iconWidth, width: iconWidth }} />
                                        <Text style={{ fontFamily: selected[5] ? 'Poppins-Bold' : 'Poppins-Regular', color: '#666666' }}>
                                            Photos
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    setSelected([false, false, false, false, false, false, true, false, false, false])
                                    setShowAbout(false)
                                    navigation.navigate('Attraction', {
                                        latitude,
                                        longitude
                                    });
                                }}>
                                    <View style={{
                                        alignItems: 'center',
                                    }}>
                                        <Image source={selected[6] ? AttractionsSel : Attractions} style={{ height: iconWidth, width: iconWidth }} />
                                        <Text style={{ fontFamily: selected[6] ? 'Poppins-Bold' : 'Poppins-Regular', color: '#666666' }}>
                                            Attractions
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    setSelected([false, false, false, false, false, false, false, true, false, false])
                                    setShowAbout(false)
                                    navigation.navigate('Accommodation', {
                                        latitude,
                                        longitude
                                    });
                                }}>
                                    <View style={{
                                        alignItems: 'center',
                                    }}>
                                        <Image source={selected[7] ? AccomodationsSel : Accomodations} style={{ height: iconWidth, width: iconWidth }} />
                                        <Text style={{ fontFamily: selected[7] ? 'Poppins-Bold' : 'Poppins-Regular', color: '#666666' }}>
                                            B&B
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => {
                                    setSelected([false, false, false, false, false, false, false, false, true, false])
                                    setShowAbout(false)
                                    navigation.navigate('Food', {
                                        latitude,
                                        longitude
                                    });
                                }}>
                                    <View style={styles.buttonView}>
                                        <Image source={selected[8] ? FoodSel : Food} style={{ height: iconWidth, width: iconWidth }} />
                                        <Text style={{ fontFamily: selected[8] ? 'Poppins-Bold' : 'Poppins-Regular', color: '#666666' }}>
                                            Food
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(200,200,200,0.3)'
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
        alignItems: 'center',

    },
    closeButton: { position: 'absolute', top: -20, height: 40, width: 40 },
    title: {
        color: '#393939',
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 24,
        paddingBottom: 10,
        textAlign: 'center'
    },
    menu: {
        flexGrow: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
export default InfoScreen;