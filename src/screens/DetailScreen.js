import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, Button, ScrollView, View, Dimensions, ImageBackground, Image, TouchableWithoutFeedback, TouchableOpacity, Text, TextInput, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditIcon from '../icons/edit-icon.png';
import render from 'react-native-web/dist/cjs/exports/render';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const DetailScreen = ({ route, navigation }) => {
    const GoogleMapsAPIKey = 'AIzaSyDoHOPQn79uYEHsJZ_1pRimuX1e_ZACNdg';
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [bottomBar, setBottomBar] = useState(false);
    const [isViewed, setIsViewed] = useState(true);
    const [nearByPlaces, setNearByPlaces] = useState([]);
    const [placeId, setPlaceId] = useState("");
    const [title, setTitle] = useState('');
    const [test, setTest] = useState([true, false, false, false, false, false, false, false, false, false, false, false]);
    const [textFieldValue, setTextFieldValue] = useState(null)
    const { imagesTest, itemId } = route.params;
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        setIsLoading(true)
        setTitle(imagesTest[itemId].nearbyplaces[0]?.name)
        setPlaceId(imagesTest[itemId].nearbyplaces[0]?.place_id)
        setTextFieldValue(imagesTest[itemId].nearbyplaces[0]?.name)
        setIsLoading(false)
    }, []);
    const Separator = () => (
        <View style={{
            marginVertical: 8,
            borderBottomColor: '#737373',
            borderBottomWidth: StyleSheet.hairlineWidth
        }} />
    );
    const getNearByPlaces = async (latitude, longitude) => {
        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&rankby=distance&key=' + GoogleMapsAPIKey);
            const data = await response.json()
            setNearByPlaces(data.results);
            setTextFieldValue(data.results[0]?.name)
            setTitle(data.results[0]?.name)
            setPlaceId(data.results[0]?.place_id)
        } catch (error) {
            console.error(error);
        }
    }
    const getItemLayout = (data, index) => (
        { length: screenWidth, offset: screenWidth * index, index }
    );
    const swipedItem = (e) => {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        setTitle(imagesTest[pageNum].nearbyplaces[0]?.name)
        setPlaceId(imagesTest[pageNum].nearbyplaces[0]?.place_id)
        setTextFieldValue(imagesTest[pageNum].nearbyplaces[0]?.name)
        if (imagesTest[pageNum].isViewed === "no") {
            setBottomBar(false)
        }
    }
    const storeData = async (image_id, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(`@${image_id}`, jsonValue)
        } catch (e) {
            console.error(e);
        }
    }
    const renderItem = ({ item, index, separator }) => {
        const calculateAspectRatio = () => {
            let ratio = item.width / item.height;
            return ratio
        }
        return (
            <View style={{ justifyContent: 'center', backgroundColor: 'black', width: screenWidth, height: screenHeight }}>
                {bottomBar && (
                    <View style={{
                        height: 50, position: 'absolute',
                        top: 0, width: '100%', backgroundColor: 'white'
                    }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                            <Text style={{ textAlign: 'right', fontSize: 18, fontWeight: 'bold', color: '#44a8c7', paddingRight: 12, paddingTop: 11 }}>
                                Share
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableWithoutFeedback onPress={() => setBottomBar(!bottomBar)} underlayColor="black">
                    <ImageBackground source={{ uri: item.uri }} style={{ width: screenWidth, aspectRatio: calculateAspectRatio() }} />
                </TouchableWithoutFeedback>
                {item.isViewed === "no" &&
                    (<View style={{
                        height: '50%', position: 'absolute',
                        top: '25%', width: '90%', backgroundColor: 'white', marginLeft: '5%'
                    }}><ScrollView >
                            <Text style={{ marginTop: 10, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Pick a place for your photo</Text>
                            <TextInput
                                style={{
                                    height: 44,
                                    padding: 10,
                                    marginTop: 10,
                                    width: '96%',
                                    marginRight: '2%',
                                    marginLeft: '2%',
                                    borderWidth: 1,
                                    borderColor: "black",
                                    borderRadius: 5,
                                }}
                                onChangeText={setTextFieldValue}
                                value={textFieldValue}
                                placeholder="Pick place for your photo"
                                keyboardType="default"
                            />
                            {item?.nearbyplaces.map((element, index, arr) => {
                                return (
                                    <View key={index} style={{
                                        padding: 5,
                                        marginTop: 10,
                                        width: '96%',
                                        marginRight: '2%',
                                        marginLeft: '2%',
                                        borderWidth: 1,
                                        borderColor: "thistle",
                                        borderRadius: 5,
                                        textAlign: "center"
                                    }}>
                                        <TouchableOpacity onPress={() => {
                                            setTextFieldValue(element.name)
                                            setTitle(element.name)
                                            setPlaceId(element.place_id)
                                        }} underlayColor="grey">
                                            <View>
                                                <Text style={{
                                                    padding: 10, fontSize: 15, fontWeight: 'bold'
                                                }}>
                                                    {`\u2023 ${element.name}`}
                                                </Text>
                                                {/* <Text style={{

                                                }}>
                                                    {element.place_id}
                                                </Text> */}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                        </ScrollView>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 10,
                        }}>
                            <Button onPress={() => {
                                const obj = {
                                    title,
                                    place_id: placeId,
                                    isViewed: "yes",
                                    image_id: item?.id
                                }
                                imagesTest[index].isViewed = "yes"
                                imagesTest[index].title = title
                                storeData(item?.id, obj)
                                setBottomBar(true)
                            }} title="Save" />
                        </View>
                        <Separator />
                    </View>
                    )
                }
                {bottomBar && (
                    <View style={{
                        position: 'absolute',
                        bottom: 0, width: '100%', backgroundColor: 'white'
                    }}>
                        <Button title="INFO" onPress={() => {
                            navigation.navigate('Information', {
                                itemId: item.id,
                                uri: item.uri,
                                place: title,
                                place_id: placeId,
                                latitude: item.latitude,
                                longitude: item.longitude
                            });
                        }} />
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', padding: 12, fontSize: 17 }}>
                                {/* {item?.place} */}
                                {item?.title}
                            </Text>
                            <TouchableOpacity onPress={() => {
                                setIsViewed(true)
                                imagesTest[index].isViewed = "no"
                                //getNearByPlaces(imagesTest[index]?.latitude, imagesTest[index]?.longitude)
                            }}>
                                <Image source={EditIcon} style={{ height: 40, width: 40 }} title="bla" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        )
    }
    return isLoading === false ? (
        <View >
            <StatusBar
                hidden={true} />
            <FlatList
                horizontal
                pagingEnabled
                onMomentumScrollEnd={swipedItem}
                keyExtractor={item => item.id}
                initialScrollIndex={itemId}
                data={imagesTest}
                getItemLayout={getItemLayout}
                renderItem={renderItem}
            />
        </View >
    ) : (
        <View style={{
            flex: 1,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <ActivityIndicator size="large" color="grey" />
        </View>);
}

export default DetailScreen;
