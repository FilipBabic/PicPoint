import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, ImageBackground, ActivityIndicator, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import AttractionsBackground from '../icons/32-atractions-background.png';
import Star from '../icons/08-star.png';
const screenWidth = Dimensions.get('window').width;
const AttractionScreen = ({ route, navigation }) => {
    const GoogleMapsAPIKey = 'AIzaSyBU4bjZbr_wzt3_UPTfIj-WHjoqf_7orOA';
    const latitude = route.params.latitude;
    const longitude = route.params.longitude;
    const [attractionPlaces, setAttractionPlaces] = useState([]);
    const [attractionImages, setAttractionImages] = useState({});
    const [isLoading, setIsLoading] = useState(false)
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
    const getNearByPlaces = async (latitude, longitude) => {
        fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&keyword=tourist&rankby=distance&key=' + GoogleMapsAPIKey)
            .then((response) => response.json())
            .then((json) => {
                setAttractionPlaces(
                    json.results
                );
            })
            .catch((error) => {
                console.error(error);
            })
    }
    // const uploadImages = async (images) => {
    //     const updatedImages = await Promise.all(images.map(async (image) => {
    //         const photoReference = image?.photos?.photo_reference
    //         const result = await getImageFromApi(photoReference);
    //         image = {
    //             ...image, uri: result
    //         }
    //         return image
    //     }));
    //     setFoodPlaces(updatedImages);
    // }
    // const getImageFromApi = async (photo) => {
    //     try {
    //         const response = await fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + photo + '&key=AIzaSyDoHOPQn79uYEHsJZ_1pRimuX1e_ZACNdg')
    //         const imageBlob = await response.blob();
    //         const imageObjectURL = URL.createObjectURL(imageBlob);
    //         //console.log("Image Object", imageObjectURL);
    //         // setTestImage(response);
    //         // // newObject = {
    //         // //     ...test, uri: imageObjectURL
    //         // // }
    //         return imageObjectURL
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    useEffect(() => {
        setIsLoading(true)
        getNearByPlaces(latitude, longitude);
    }, [])

    useEffect(() => {
        if (attractionPlaces.length === 0) {
            return;
        }
        attractionPlaces.forEach((item) => {
            if (item.photos == null) {
                setAttractionImages((oldState) => ({
                    ...oldState,
                    [item.place_id]: null
                }));
                return;
            }
            fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + item.photos[0].photo_reference + '&key=AIzaSyBU4bjZbr_wzt3_UPTfIj-WHjoqf_7orOA')
                .then((response) => response.blob())
                .then((blob) => {
                    let base64data;
                    const fileReaderInstance = new FileReader();
                    fileReaderInstance.readAsDataURL(blob);
                    fileReaderInstance.onload = () => {
                        base64data = fileReaderInstance.result;
                        setAttractionImages((oldState) => ({
                            ...oldState,
                            [item.place_id]: base64data
                        }));
                    }
                }).catch((error) => {
                    console.error(error);
                }).then(() => {
                    setIsLoading(false);
                })
        })
    }, [attractionPlaces])
    const [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../fonts/Poppins-Bold.ttf'),
    });
    if (!fontsLoaded) {
        return null;
    }

    const renderImage = (img) => {
        if (img === null) {
            return <Image source={AttractionsBackground} style={{ height: 120, width: 120 }} />;
        }
        return <Image source={{ uri: `${img}` }} style={{ height: 120 }} />
    }
    return isLoading === false ? (
        <ScrollView>
            <View style={{ backgroundColor: '#f2fbfc' }}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, paddingTop: 10, textAlign: 'center' }}>
                    Tourist Attractions nearby
                </Text>
                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5 }}>
                    {attractionPlaces.map((element, index, arr) => {
                        let isOpen = element.opening_hours?.open_now
                        return (
                            <View key={index} style={{
                                marginTop: 10,
                                width: '48%',
                                marginRight: '1%',
                                marginLeft: '1%',
                                borderWidth: 1,
                                borderColor: '#e7e7e7',
                                borderRadius: 15,
                                backgroundColor: 'white'
                            }}>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('AttractionDetails', {
                                        place_id: element.place_id,
                                        name: element.name,
                                        openNow: element.opening_hours?.open_now,
                                        rating: element.rating,
                                        totalUserRanking: element.user_ratings_total
                                    });
                                }} underlayColor="grey">
                                    <View>
                                        <Text style={{
                                            fontFamily: 'Poppins-Bold', fontSize: 15, padding: 6, textAlign: 'center'
                                        }}>
                                            {element.name}
                                        </Text>
                                    </View>
                                    <View style={{ borderWidth: 1 }}>
                                        {renderImage(attractionImages[element.place_id])}
                                        <View style={{ position: 'absolute', paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, top: 0, left: isOpen ? '35%' : '30%', backgroundColor: isOpen ? 'green' : 'red', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <Text style={{ color: 'white', fontFamily: 'Poppins-Bold', fontSize: 15 }}>
                                                {element.opening_hours?.open_now === true ? "Open" : "Closed"}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                                        <ImageBackground source={AttractionsBackground} style={{ width: screenWidth / 2 - 40, height: screenWidth / 2 - 40 }}>
                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#c9c9c9', paddingTop: 15 }}>
                                                Price level:
                                            </Text>
                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, fontWeight: 'bold', paddingBottom: 10 }}>
                                                {element.price_level ? `${element.price_level}/5` : 'No info'}
                                            </Text>
                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#c9c9c9' }}>
                                                Address:
                                            </Text>
                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, paddingBottom: 10 }}>
                                                {element.vicinity}
                                            </Text>
                                        </ImageBackground>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', padding: 8, borderTopWidth: 2, borderColor: '#f2f2f2' }}>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, color: '#393939' }}>
                                            {element.rating}
                                        </Text>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            {calculateStars(element.rating)}
                                        </View>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, color: '#393939' }}>
                                            {`(${element.user_ratings_total})`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
            </View >
        </ScrollView >
    ) : (<View style={{
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <ActivityIndicator size="large" color="grey" />
    </View>);
}
export default AttractionScreen;