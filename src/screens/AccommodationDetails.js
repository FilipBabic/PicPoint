import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, Text, TouchableOpacity, TouchableHighlight, Linking, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Star from '../icons/08-star.png';
const screenWidth = Dimensions.get('window').width;
const AccommodationDetails = ({ route }) => {
    const GoogleMapsAPIKey = 'AIzaSyDoHOPQn79uYEHsJZ_1pRimuX1e_ZACNdg';
    const place_id = route.params.place_id;
    const [showInfo, setShowInfo] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [url, setUrl] = useState("");
    const [website, setWebsite] = useState("");
    const [weekDayText, setWeekDayText] = useState("");
    const { name, rating, openNow, totalUserRanking } = route.params;
    const getAccommodationDetails = async (place_id) => {
        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/place/details/json?fields=business_status%2Cinternational_phone_number%2Curl%2Cwebsite%2Copening_hours&place_id=' + place_id + '&key=' + GoogleMapsAPIKey);
            const data = await response.json()
            setPhoneNumber(data.result?.international_phone_number);
            setUrl(data.result?.url);
            setWebsite(data.result?.website);
            setWeekDayText(data.result?.opening_hours?.weekday_text)
            //updatePhotos(data?.result?.photos)
        } catch (error) {
            console.error(error);
        }
    }
    const calculateStars = (num) => {
        if (num > 1 && num <= 1.5) {
            let bla = <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <Image source={Star} style={{ height: 20, width: 20 }} /></View>
            return bla
        } else if (num > 1.5 && num <= 2.5) {
            let bla = <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <Image source={Star} style={{ height: 20, width: 20 }} />
                <Image source={Star} style={{ height: 20, width: 20 }} /></View>
            return bla
        } else if (num > 2.5 && num <= 3.5) {
            let bla = <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <Image source={Star} style={{ height: 20, width: 20 }} />
                <Image source={Star} style={{ height: 20, width: 20 }} />
                <Image source={Star} style={{ height: 20, width: 20 }} /></View>
            return bla
        } else if (num > 3.5 && num <= 4.5) {
            let bla = <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <Image source={Star} style={{ height: 20, width: 20 }} />
                <Image source={Star} style={{ height: 20, width: 20 }} />
                <Image source={Star} style={{ height: 20, width: 20 }} />
                <Image source={Star} style={{ height: 20, width: 20 }} /></View>
            return bla
        } else if (num > 4.5 && num <= 5) {
            let bla = <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <Image source={Star} style={{ height: 20, width: 20 }} />
                <Image source={Star} style={{ height: 20, width: 20 }} />
                <Image source={Star} style={{ height: 20, width: 20 }} />
                <Image source={Star} style={{ height: 20, width: 20 }} />
                <Image source={Star} style={{ height: 20, width: 20 }} /></View>
            return bla
        }
    }
    // const updatePhotos = async (images) => {
    //     const updatedImages = await Promise.all(images.map(async (image) => {
    //         const photoReference = image?.photos?.photo_reference
    //         const result = await getPhotosForPlace(photoReference);
    //         return result
    //     }));
    //     console.log("updated images", updatedImages)
    //     setTestPhoto2(updatedImages)
    // }
    // const getPhotosForPlace = async (reference) => {
    //     try {
    //         const response = await fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + reference + '&key=AIzaSyDoHOPQn79uYEHsJZ_1pRimuX1e_ZACNdg')
    //         const imageBlob = await response.blob();
    //         const imageObjectURL = URL.createObjectURL(imageBlob);
    //         setTestPhoto(imageObjectURL)
    //         return imageObjectURL
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    useEffect(() => {
        getAccommodationDetails(place_id);
    }, [])
    return (
        <View style={{ backgroundColor: '#f2fbfc', height: '100%' }}>
            <ScrollView>
                <Text style={{ fontSize: 18, fontWeight: '900', padding: 20, textAlign: 'center' }}>
                    {name}
                </Text>
                <View style={{ left: '40%', width: '20%', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, backgroundColor: openNow ? 'green' : 'red', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                    <Text style={{ fontWeight: '900', fontSize: 15, textAlign: 'center', color: 'white' }}>
                        {openNow === true ? "Open" : "Closed"}
                    </Text>
                </View>
                <View style={{ fontSize: 14, padding: 20, textAlign: 'center' }}>
                    <Text style={{ fontSize: 15, color: '#393939', textAlign: 'center' }}>Place Rating</Text>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', padding: 8, borderTopWidth: 2, borderColor: '#f2f2f2' }}>
                        <Text style={{ fontSize: 16, color: '#393939' }}>
                            {rating}
                        </Text>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {calculateStars(rating)}
                        </View>
                        <Text style={{ fontSize: 16, color: '#393939' }}>
                            {`(${totalUserRanking})`}
                        </Text>
                    </View>
                    {showInfo && <View style={{ backgroundColor: 'white', padding: 20, width: screenWidth, height: 120 }}>
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, color: 'red', textAlign: 'center', paddingBottom: 20 }}>
                                There is no information available!!!
                            </Text>
                            <TouchableHighlight onPress={() => setShowInfo(false)}>
                                <Text style={{ height: 40, width: 100, textAlign: 'center', paddingTop: 8, fontSize: 20, backgroundColor: '#162b54', color: 'white' }}>OK</Text>
                            </TouchableHighlight>
                        </View>
                    </View>}
                    <Text style={{ paddingTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                        Working hours:
                    </Text>
                    <View>
                        {weekDayText?.toString().split(',').map((step, index) => <View key={index} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, paddingTop: 8, paddingBottom: 8 }}><Text>{step.split(': ')[0]}</Text><Text>{step.split(': ')[1]}</Text></View>)}
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => { Linking.openURL(`${url}`) }}>
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
                                <Text style={{ color: 'white', fontWeight: '700' }}>Find on Maps</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { Linking.openURL(`tel:${phoneNumber}`) }}>
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
                                <Text style={{ color: 'white', fontWeight: '700' }}>
                                    Call
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => {
                        Linking.canOpenURL(`${website}`).then(supported => {
                            if (supported) {
                                Linking.openURL(`${website}`)
                            } else {
                                setShowInfo(true);
                            }
                        })
                    }}>
                        <LinearGradient
                            style={{
                                marginTop: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#EB00A0',
                                height: 40,
                                width: '100%',
                                borderRadius: 30
                            }}
                            colors={['#E0038C', '#6A2B90']}>
                            <Text style={{ color: 'white', fontWeight: '700' }}>
                                Visit Website
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
export default AccommodationDetails;