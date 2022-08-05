import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, Image, View, Text, Linking, ImageBackground, TouchableOpacity, TouchableHighlight, ScrollView, StyleSheet } from 'react-native';
import Info from '../icons/01Info.png';
import Website from '../icons/02Website.png';
import Location from '../icons/03Location.png';
import Waze from '../icons/04Waze.png';
import GoogleMaps from '../icons/05GoogleMaps.png';
import Moovit from '../icons/06Moovit.png';
import Phone from '../icons/07Phone.png';
import Weather from '../icons/08Weather.png';
import Photos from '../icons/09Photos.png';
import Attractions from '../icons/10Attractions.png';
import Accomodations from '../icons/11Accommodations.png';
import Food from '../icons/12Food.png';
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
    }, []);
    return (
        <ImageBackground source={{ uri: uri }} style={{ flex: 1, width: 'auto', height: 'auto' }}>
            <View style={{ backgroundColor: 'rgba(200,200,200,0.3)', flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                {/* <Text>
                    PLACE
                    {place}
                    URI{uri}
                </Text> */}
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
                    }} style={{
                        position: 'absolute', width: 50, height: 50, backgroundColor: 'white', top: -25, borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                    }} >
                        <Text style={{ paddingTop: 5, alignItems: 'center', textAlign: 'center' }}>X</Text>
                    </TouchableHighlight>
                    <Text style={{ fontSize: 18, padding: 10, textAlign: 'center' }}>
                        {place}
                    </Text>
                    <View style={{ flex: 1 }}>
                        <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }} horizontal={true}>
                            <TouchableOpacity onPress={() => console.log("CLICKED 1")}>
                                <View style={styles.buttonView}>
                                    <Image source={Info} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={styles.buttonText}>
                                        About
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Linking.canOpenURL(`${website}`).then(supported => {
                                    if (supported) {
                                        Linking.openURL(`${website}`)
                                    } else {
                                        setShowInfo(true);
                                    }
                                })
                            }}>
                                <View style={styles.buttonView}>
                                    <Image source={Website} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={styles.buttonText}>
                                        Website
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                // setLocationState(!locationState)
                                // scrollViewRef.current.scrollTo({ x: iconWidth * 2, y: 0, animated: true })
                                Linking.canOpenURL(`${url}`).then(supported => {
                                    if (supported) {
                                        Linking.openURL(`${url}`)
                                    } else {
                                        setShowInfo(true);
                                    }
                                })
                            }}>
                                <View style={styles.buttonView}>
                                    <Image source={Location} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={styles.buttonText}>
                                        Location
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {/* <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                setLocationState(!locationState)
                                scrollViewRef.current.scrollTo({ x: iconWidth * 2, y: 0, animated: true })
                            }}>
                                <View style={styles.buttonView}>
                                    <Image source={Location} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={styles.buttonText}>
                                        Location
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {locationState && (
                                <View style={{ flex: 1, alignItems: 'flex-start', flexDirection: 'row' }}>
                                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                        <Image source={Waze} style={{ height: iconWidth * 2 / 3, width: iconWidth * 2 / 3 }} />
                                        <Text style={styles.buttonText}>
                                            Waze
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                        <Image source={GoogleMaps} style={{ height: iconWidth * 2 / 3, width: iconWidth * 2 / 3 }} />
                                        <Text style={styles.buttonText}>
                                            Google {"\n"}Maps
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                        <Image source={Moovit} style={{ height: iconWidth * 2 / 3, width: iconWidth * 2 / 3 }} />
                                        <Text style={styles.buttonText}>
                                            Moovit
                                        </Text>
                                    </View>
                                </View>)}
                        </View> */}
                            <TouchableOpacity onPress={() => {
                                phoneNumber == "undefined" ? setShowInfo(true) : Linking.openURL(`tel:${phoneNumber}`)
                            }}>
                                <View style={styles.buttonView}>
                                    <Image source={Phone} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={styles.buttonText}>
                                        Phone
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <View style={styles.buttonView}>
                                    <Image source={Weather} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={styles.buttonText}>
                                        Weather
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <View style={styles.buttonView}>
                                    <Image source={Photos} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={styles.buttonText}>
                                        Photos
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <View style={styles.buttonView}>
                                    <Image source={Attractions} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={styles.buttonText}>
                                        Attractions
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <View style={styles.buttonView}>
                                    <Image source={Accomodations} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={styles.buttonText}>
                                        Accommodations
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('Food', {
                                    latitude,
                                    longitude
                                });
                            }}>
                                <View style={styles.buttonView}>
                                    <Image source={Food} style={{ height: iconWidth, width: iconWidth }} />
                                    <Text style={styles.buttonText}>
                                        Food
                                    </Text>
                                </View>
                            </TouchableOpacity>

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
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: screenWidth / 4
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 15, fontWeight: 'bold',
        color: 'rgba(178,178,178,1)',
        padding: 5
    }
});
export default InfoScreen;