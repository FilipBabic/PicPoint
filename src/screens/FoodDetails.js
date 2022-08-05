import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Linking } from 'react-native';
const FoodDetails = ({ route, navigation }) => {
    const GoogleMapsAPIKey = 'AIzaSyDoHOPQn79uYEHsJZ_1pRimuX1e_ZACNdg';
    const place_id = route.params.place_id;
    const [name, setName] = useState("");
    const [rating, setRating] = useState("");
    const [photos, setPhotos] = useState([]);
    const [businessStatus, setBusinessStatus] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [url, setUrl] = useState("");
    const [website, setWebsite] = useState("");
    const [openNow, setOpenNow] = useState();
    const [weekDayText, setWeekDayText] = useState("");
    const [totalUserRankings, setTotalUserRankings] = useState("");
    const [testPhoto, setTestPhoto] = useState()
    const [testPhoto2, setTestPhoto2] = useState([])
    const getFoodDetails = async (place_id) => {
        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Crating%2Cvicinity%2Cphotos%2Cbusiness_status%2Cinternational_phone_number%2Curl%2Cwebsite%2Copening_hours%2Cuser_ratings_total&place_id=' + place_id + '&key=' + GoogleMapsAPIKey);
            const data = await response.json()
            setName(data.result?.name);
            setRating(data.result?.rating);
            setPhotos(data.result?.photos);
            setBusinessStatus(data.result?.business_status);
            setPhoneNumber(data.result?.international_phone_number);
            setUrl(data.result?.url);
            setWebsite(data.result?.website);
            setOpenNow(data.result?.opening_hours?.open_now);
            setWeekDayText(data.result?.opening_hours?.weekday_text)
            setTotalUserRankings(data.result?.user_ratings_total)
            updatePhotos(data?.result?.photos)
        } catch (error) {
            console.error(error);
        }
    }
    const updatePhotos = async (images) => {
        const updatedImages = await Promise.all(images.map(async (image) => {
            const photoReference = image?.photos?.photo_reference
            const result = await getPhotosForPlace(photoReference);
            return result
        }));
        console.log("updated images", updatedImages)
        setTestPhoto2(updatedImages)
    }
    const getPhotosForPlace = async (reference) => {
        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + reference + '&key=AIzaSyDoHOPQn79uYEHsJZ_1pRimuX1e_ZACNdg')
            const imageBlob = await response.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setTestPhoto(imageObjectURL)
            return imageObjectURL
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getFoodDetails(place_id);

    }, [])
    return (
        <ScrollView>
            <View style={{ backgroundColor: 'aliceblue' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', padding: 10, textAlign: 'center' }}>
                    {name}
                </Text>
                <View style={{ fontSize: 14, padding: 10, textAlign: 'center' }}>
                    <Text>
                        Business Status:{businessStatus}
                    </Text>
                    <Text>
                        Rating:{rating}
                    </Text>
                    <Text>
                        Total user rankings:{totalUserRankings}
                    </Text>
                    <Text>
                        Open now:{openNow === true ? "YES" : "NO"}
                    </Text>
                    <Text style={{ paddingTop: 10 }}>
                        Working hours:{"\n"}
                        {weekDayText.toString().split(',').map((step) => <Text>{step}{"\n"}</Text>)}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ backgroundColor: 'aliceblue', padding: 10 }} onPress={() => { Linking.openURL(`${url}`) }}>
                            <Text style={{ textAlign: 'center' }}>GOOGLE{"\n"}LOCATION</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: 'aliceblue', padding: 10 }} onPress={() => { Linking.openURL(`tel:${phoneNumber}`) }}>
                            <Text style={{ textAlign: 'center' }}>
                                PHONE NUMBER{"\n"}{phoneNumber}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ borderWidth: 1, backgroundColor: 'aliceblue', marginTop: 10, padding: 4 }} onPress={() => { Linking.openURL(`${website}`) }}>
                        <Text style={{ textAlign: 'center' }}>
                            WEBSITE{"\n"}{website}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Image source={{ uri: testPhoto2[0] }} height={90} />
            </View>
            {/* <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
                {testPhoto2.map((photo) => {
                    return (
                        <>
                            <Text>
                                {photo}
                            </Text>

                            <Image source={{ uri: photo }} style={{ backgroundColor: 'red', height: 90, width: 90 }} />

                        </>
                    )
                })}
            </View> */}
        </ScrollView>
    );
}
export default FoodDetails;