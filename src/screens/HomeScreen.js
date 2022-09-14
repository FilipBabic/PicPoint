import React, { useState, useEffect, useRef } from 'react';
import { Platform, Dimensions, ActivityIndicator, SafeAreaView, ScrollView, View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { useHeaderHeight } from '@react-navigation/elements';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenWidth = Dimensions.get('window').width;
const HomeScreen = ({ navigation }) => {
    const GoogleMapsAPIKey = 'AIzaSyDoHOPQn79uYEHsJZ_1pRimuX1e_ZACNdg';
    const [isLoading, setIsLoading] = useState(true);
    const headerHeight = useHeaderHeight();
    const [images, setImages] = useState([{ test: 'bla' }, { test: 'bl3' }, { test: 'bl3' }]);
    useEffect(() => {
        getImagesFromLibrary();
    }, []);
    const getImagesFromLibrary = async () => {
        setIsLoading(true);
        const res = await MediaLibrary.requestPermissionsAsync()
        if (res.granted) {
            await MediaLibrary.getAssetsAsync({
                first: 540,
                sortBy: 'modificationTime'
            }).then(results => {
                reduceImages(results.assets);
            }).catch((err) => {
                console.error(err);
            });
        };
    };
    const reduceImages = async (images) => {
        let filteredData;
        if (Platform.OS === 'android') {
            filteredData = images.filter(x => String(x.uri).includes("file:///storage/emulated/0/DCIM"));
        } else if (Platform.OS === 'ios') {
            filteredData = images.filter(x => String(x.uri).includes("ph://"));
        }
        updateImages(filteredData);
    }
    const updateImages = async (images) => {
        const updatedImages = await Promise.all(images.map(async (image) => {
            const result = await getImageInfoFromLibrary(image);
            return result
        }));
        setImages(updatedImages);
        setIsLoading(false);
    }
    const getImageInfoFromLibrary = async (image) => {
        const res = await MediaLibrary.requestPermissionsAsync()
        let newImage = image
        if (res.granted) {
            try {
                const result = await MediaLibrary.getAssetInfoAsync(image.id, {
                    shouldDownloadFromNetwork: true
                })
                if (typeof result.location?.longitude === 'undefined') {
                    newImage = {
                        ...image, title: 'NO GPS LOCATION', isViewed: "yes", nearbyplaces: []
                    }
                } else {
                    const jsonValue = await getLocalStorageData(image.id)
                    const latitude = result?.location?.latitude;
                    const longitude = result?.location?.longitude;
                    const isViewed = jsonValue?.isViewed
                    if (isViewed === "yes") {
                        const title = jsonValue?.title
                        const place_id = jsonValue?.place_id
                        newImage = {
                            ...image, nearbyplaces: [], title, place_id, latitude, longitude, isViewed
                        }
                    } else if (isViewed === "no") {
                        const nearbyplaces = await getNearByPlaces(latitude, longitude)
                        newImage = {
                            ...image, nearbyplaces, latitude, longitude, isViewed
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
            return newImage;
        };
    };
    const getLocalStorageData = async (image_id) => {
        try {
            const jsonValue = await AsyncStorage.getItem(`@${image_id}`)
            if (jsonValue === null) {
                const obj = {
                    title: 'no title',
                    place_id: 'no place id',
                    isViewed: 'no'
                }
                return obj
            } else {
                const data = JSON.parse(jsonValue)
                const obj = {
                    title: data?.title,
                    place_id: data?.place_id,
                    isViewed: 'yes'
                }
                return obj
            }
        } catch (e) {
            console.error(e)
        }
    }
    const getNearByPlaces = async (latitude, longitude) => {
        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&rankby=distance&key=' + GoogleMapsAPIKey);
            const data = await response.json()
            var name = data.results.map((name22) => {
                const nesto = { name: name22.name, place_id: name22.place_id, selected22: false }
                return nesto
            })
            name[0].selected22 = true;
            return name
        } catch (error) {
            console.error(error);
        }
    }
    // const clearLocalStorage = async () => {
    //     try {
    //         await AsyncStorage.clear()
    //     } catch (e) {
    //         // clear error
    //     }
    //     console.log('Done.')
    // }
    return isLoading === false ? (
        <View style={{ paddingTop: Platform.OS === 'android' ? 0 : 0 }}>
            <ScrollView>
                {/* <TouchableOpacity onPress={clearLocalStorage}>
                    <Text>
                        CLEAR LOCAL STORAGE
                    </Text>
                </TouchableOpacity> */}
                <View style={styles.container}>
                    {images.map((element, index, arr) => {
                        return (
                            <>
                                {(index === 0 || !moment(element.modificationTime).isSame(arr[index - 1].modificationTime, "day"))
                                    && <Text key={index} style={styles.dateTitle}>{moment(element.modificationTime).format('DD/MM/YYYY')}</Text>}
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('Details', {
                                        imagesTest: images,
                                        itemId: index,
                                        uri: images.uri,
                                        headerHeight
                                    });
                                }} underlayColor="grey">
                                    <Image key={index} source={{ uri: element.uri }} style={styles.images} />
                                </TouchableOpacity>
                            </>)
                    })}
                </View>
            </ScrollView>
        </View >
    ) : (
        <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color="grey" />
        </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1, flexDirection: 'row', flexWrap: 'wrap'
    },
    dateTitle: {
        flexBasis: screenWidth,
        height: 40,
        paddingTop: 8,
        fontSize: 20,
        fontWeight: 'bold'
    },
    images: {
        height: screenWidth / 3, width: screenWidth / 3
    },
    activityIndicator: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default HomeScreen;
