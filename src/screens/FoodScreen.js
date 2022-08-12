import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
const FoodScreen = ({ route, navigation }) => {
    const GoogleMapsAPIKey = 'AIzaSyDoHOPQn79uYEHsJZ_1pRimuX1e_ZACNdg';
    const latitude = route.params.latitude;
    const longitude = route.params.longitude;
    const [foodPlaces, setFoodPlaces] = useState([]);
    const [testImage, setTestImage] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const getNearByPlaces = async (latitude, longitude) => {
        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&keyword=food&rankby=distance&key=' + GoogleMapsAPIKey);
            const data = await response.json()
            console.log("data res", data, latitude, longitude)
            uploadImages(data.results);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    }
    const uploadImages = async (images) => {
        const updatedImages = await Promise.all(images.map(async (image) => {
            const photoReference = image?.photos?.photo_reference
            const result = await getImageFromApi(photoReference);
            image = {
                ...image, uri: result
            }
            return image
        }));
        console.log("updated images", updatedImages)
        setFoodPlaces(updatedImages);
    }
    const getImageFromApi = async (photo) => {
        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + photo + '&key=AIzaSyDoHOPQn79uYEHsJZ_1pRimuX1e_ZACNdg')
            const imageBlob = await response.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            console.log("Image Object", imageObjectURL);
            // setTestImage(response);
            // // newObject = {
            // //     ...test, uri: imageObjectURL
            // // }
            return imageObjectURL
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        setIsLoading(true)
        console.log("LATITUDE LONGITUDE:", latitude, longitude)
        getNearByPlaces(latitude, longitude);
    }, [])
    return isLoading === false ? (
        <ScrollView>
            <View style={{ backgroundColor: 'aliceblue' }}>
                <Text style={{ fontSize: 16, paddingTop: 10, textAlign: 'center' }}>
                    Buy food within a radius of 500 m
                </Text>
                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5 }}>
                    {foodPlaces.map((element, index, arr) => {

                        return (
                            <View key={index} style={{
                                padding: 5,
                                marginTop: 10,
                                width: '46%',
                                marginRight: '2%',
                                marginLeft: '2%',
                                borderWidth: 1,
                                borderColor: "thistle",
                                borderRadius: 5,
                                textAlign: "center",
                                color: 'red'
                            }}>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('FoodDetails', {
                                        place_id: element.place_id
                                    });
                                }} underlayColor="grey">
                                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <Image source={{ uri: `${element.icon}` }} style={{ height: 20, width: 20 }} />
                                        <Text style={{
                                            fontWeight: 'bold', padding: 6,
                                        }}>
                                            {element.name}
                                        </Text>
                                    </View>
                                    <Image source={{ uri: `${element.uri}` }} style={{ height: 90, backgroundColor: 'red' }} />
                                    <Text>
                                        Open now:
                                        {element.opening_hours?.open_now === true ? "YES" : "NO"}
                                    </Text>
                                    <Text>
                                        Place rating:
                                        {element.rating}
                                    </Text>
                                    <Text>
                                        Price level:
                                        {element.price_level}
                                    </Text>
                                    <Text>
                                        Total user ratings:
                                        {element.user_ratings_total}
                                    </Text>

                                    {/* <Text>
                                        URI: {element.uri}
                                    </Text> */}
                                    <Text>
                                        Address:
                                        {element.vicinity}
                                    </Text>
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
export default FoodScreen;