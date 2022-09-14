import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, Image, View, Text, Linking, ImageBackground, TouchableWithoutFeedback, TouchableHighlight, ScrollView, StyleSheet } from 'react-native';
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
const screenWidth = Dimensions.get('window').width;
const InfoScreen = ({ route, navigation }) => {
    const GoogleMapsAPIKey = 'AIzaSyDoHOPQn79uYEHsJZ_1pRimuX1e_ZACNdg';
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
    const [website, setWebsite] = useState("");
    const [url, setUrl] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selected, setSelected] = useState([true, false, false, false, false, false, false, false, false, false]);
    const getLocationInfo = async (place_id) => {
        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/place/details/json?fields=international_phone_number%2Curl%2Cwebsite&place_id=' + place_id + '&key=' + GoogleMapsAPIKey);
            const data = await response.json()
            // setName(data.result?.name);
            // setRating(data.result?.rating);
            // setPhotos(data.result?.photos);
            // setBusinessStatus(data.result?.business_status);
            setPhoneNumber(data.result?.international_phone_number);
            setUrl(data.result?.url);
            setWebsite(data.result?.website);
            // setOpenNow(data.result?.opening_hours?.open_now);
            // setWeekDayText(data.result?.opening_hours?.weekday_text)
            // setTotalUserRankings(data.result?.user_ratings_total)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        navigation.setOptions({ headerShown: false, tabBarVisible: false });
        getLocationInfo(place_id)
        console.log("place ID ", place_id, longitude, latitude);
    }, []);
    return (
        <ImageBackground source={{ uri: uri }} style={{ flex: 1, width: 'auto', height: 'auto' }}>
            <View style={styles.container}>
                {showInfo && <View style={{ position: 'absolute', top: 150, backgroundColor: 'white', padding: 20, width: screenWidth, height: 120 }}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 16, textAlign: 'center', paddingBottom: 20 }}>
                            There is no information available!!!
                        </Text>
                        <TouchableHighlight onPress={() => setShowInfo(false)}>
                            <Text style={{ height: 40, width: 100, textAlign: 'center', paddingTop: 8, fontSize: 20, backgroundColor: '#162b54', color: 'white' }}>OK</Text>
                        </TouchableHighlight>
                    </View>
                </View>}
                <View style={styles.bottomContainer}>
                    <TouchableHighlight onPress={() => {
                        navigation.navigate('Home');
                    }} style={styles.closeButton} >
                        <Image source={Close} style={{ height: 40, width: 40 }} />
                    </TouchableHighlight>
                    <Text style={styles.title}>
                        {place}
                    </Text>
                    <View style={{ flex: 1 }}>
                        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.menu} horizontal={true}>
                            <TouchableWithoutFeedback onPress={() => setSelected([true, false, false, false, false, false, false, false, false, false])}>
                                <View style={styles.buttonView}>
                                    <Image source={selected[0] ? AboutSel : About} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={{ fontWeight: selected[0] ? '900' : '500', color: '#666666' }}>
                                        About
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {
                                setSelected([false, true, false, false, false, false, false, false, false, false])
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
                                    <Text style={{ fontWeight: selected[1] ? '900' : '500', color: '#666666' }}>
                                        Website
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {
                                setSelected([false, false, true, false, false, false, false, false, false, false])
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
                                    <Text style={{ fontWeight: selected[2] ? '900' : '500', color: '#666666' }}>
                                        Location
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {
                                setSelected([false, false, false, true, false, false, false, false, false, false])
                                phoneNumber == "undefined" ? setShowInfo(true) : Linking.openURL(`tel:${phoneNumber}`)
                            }}>
                                <View style={styles.buttonView}>
                                    <Image source={selected[3] ? PhoneSel : Phone} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={{ fontWeight: selected[3] ? '900' : '500', color: '#666666' }}>
                                        Phone
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setSelected([false, false, false, false, true, false, false, false, false, false])}>
                                <View style={styles.buttonView}>
                                    <Image source={selected[4] ? WeatherSel : Weather} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={{ fontWeight: selected[4] ? '900' : '500', color: '#666666' }}>
                                        Weather
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setSelected([false, false, false, false, false, true, false, false, false, false])}>
                                <View style={styles.buttonView}>
                                    <Image source={selected[5] ? PhotosSel : Photos} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={{ fontWeight: selected[5] ? '900' : '500', color: '#666666' }}>
                                        Photos
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setSelected([false, false, false, false, false, false, true, false, false, false])}>
                                <View style={{
                                    alignItems: 'center',
                                }}>
                                    <Image source={selected[6] ? AttractionsSel : Attractions} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={{ fontWeight: selected[6] ? '900' : '500', color: '#666666' }}>
                                        Attractions
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setSelected([false, false, false, false, false, false, false, true, false, false])}>
                                <View style={{
                                    alignItems: 'center',
                                }}>
                                    <Image source={selected[7] ? AccomodationsSel : Accomodations} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={{ fontWeight: selected[7] ? '800' : '500', color: '#666666' }}>
                                        Accommodations
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {
                                setSelected([false, false, false, false, false, false, false, false, true, false])
                                navigation.navigate('Food', {
                                    latitude,
                                    longitude
                                });
                            }}>
                                <View style={styles.buttonView}>
                                    <Image source={selected[8] ? FoodSel : Food} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={{ fontWeight: selected[8] ? '900' : '500', color: '#666666' }}>
                                        Food
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </View>
                </View>
            </View>
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
    closeButton: {
        position: 'absolute',
        width: 40,
        height: 40,
        top: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
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
    },
    buttonText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 15, fontWeight: '500',
        color: 'rgba(178,178,178,1)',
        padding: 5
    }
});
export default InfoScreen;