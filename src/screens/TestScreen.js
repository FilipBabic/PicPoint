import React, { useState, useEffect, useRef } from 'react';
import { Platform, Dimensions, ActivityIndicator, SafeAreaView, ScrollView, View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';
import * as MediaLibrary from 'expo-media-library';
const screenWidth = Dimensions.get('window').width;
const TestScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([{ test: 'bla' }, { test: 'bl3' }, { test: 'bl3' }]);
    const getImagesFromLibrary = async () => {
        setIsLoading(true);
        const res = await MediaLibrary.requestPermissionsAsync()
        if (res.granted) {
            await MediaLibrary.getAssetsAsync({
                first: 540,
                sortBy: 'modificationTime'
            }).then(results => {
                reduceImages(results.assets);
                setIsLoading(false);
                console.log("RESULTATTEST:", images)
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
        setImages(filteredData)
        console.log("FILTERED2", images)

    }
    useEffect(() => {
        navigation.setOptions({ headerShown: true });
        getImagesFromLibrary();
    }, []);

    return isLoading === false ? (
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 0 : 0 }}>
            <ScrollView>
                <View style={styles.container}>
                    {images.map((element, index, arr) => {
                        return (
                            <>
                                {(index === 0 || !moment(element.modificationTime).isSame(arr[index - 1].modificationTime, "day"))
                                    && <Text style={styles.dateTitle}>{moment(element.modificationTime).format('DD/MM/YYYY')}</Text>}
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('Details', {
                                        imagesTest: images,
                                        itemId: index,
                                        uri: images.uri
                                    });
                                }} underlayColor="grey">
                                    <Image key={element.id} source={{ uri: element.uri }} style={styles.images} />
                                </TouchableOpacity>
                            </>)
                    })}
                </View>
            </ScrollView>
        </SafeAreaView >
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


export default TestScreen;
