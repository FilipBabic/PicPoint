import React, { useState, useEffect, useRef } from 'react';
import { Platform, Button, FlatList, Dimensions, TouchableHighlight, ActivityIndicator, SafeAreaView, ScrollView, View, StyleSheet, Text, Image } from 'react-native';
import Album from '../components/Album';
import * as MediaLibrary from 'expo-media-library';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const HomeScreen = ({ navigation }) => {
    const flatlistRef = useRef();
    const [albums, setAlbums] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([{ test: 'bla' }, { test: 'bl3' }, { test: 'bl3' }]);
    let platform = "";
    if (Platform.OS === 'ios') {
        platform = 'ph/::'
    } else if (Platform.OS === 'android') {
        platform = 'DCIM'
    }
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
                console.log("RESULTAT:", results.assets)
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
        console.log("FILTERED", filteredData.modificationTime)
        setImages(filteredData)
        console.log("FILTERED2", images[0].modificationTime)
        convertTime(images[4].modificationTime)
    }
    const convertTime = (test) => {
        var t = new Date(test);
        var formatted = ('0' + t.getDate()).slice(-2)
            + '/' + ('0' + t.getMonth()).slice(-2)
            + '/' + (t.getFullYear())
        console.log("bla", formatted)
        return formatted;
    }
    useEffect(() => {
        navigation.setOptions({ headerShown: true });
        getImagesFromLibrary();
        // const getAlbumsFromLibrary = async () => {
        //     const res = await MediaLibrary.requestPermissionsAsync()
        //     if (res.granted) {
        //         await MediaLibrary.getAlbumsAsync({
        //             includeSmartAlbums: true
        //         }).then(result => {
        //             setAlbums(result);
        //             setIsLoading(false);
        //         }).catch((err) => {
        //             console.error(err);
        //         });
        //     };
        // }
        // getAlbumsFromLibrary();
    }, []);
    // let albumsMarkup = isLoading ? <Text>Loading</Text> :
    //     <>
    //         {
    //             albums.map((album) => <Album album={album} key={album.id} navigation={navigation} />)
    //         }
    //     </>
    const tapped = (item) => {
        console.log(item.uri);
    };
    const renderItem = ({ item, index }) => {
        return (
            <View>
                <Text>{convertTime(item.modificationTime)}</Text>
                <TouchableHighlight onPress={() => {
                    navigation.navigate('Details', {
                        imagesTest: images,
                        itemId: index,
                        uri: item.uri
                    });
                }} underlayColor="grey">
                    <Image key={item.id} source={{ uri: item.uri }} style={{ height: screenWidth / 4, width: screenWidth / 4 }} />
                </TouchableHighlight >
            </View>
        )
    }
    const onPressFunction = () => {
        console.log('BLABLa:',)
        // flatlistRef.current.scrollToEnd(true);
    };
    return isLoading === false ? (
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 0 : 0 }}>
            <Button onPress={() => {
                navigation.navigate('TestScreen', {
                    imagesTest: images,
                });
            }} title="go to test" />
            <FlatList
                ref={flatlistRef}
                horizontal={false}
                numColumns={4}
                pagingEnabled
                onMomentumScrollBegin={() => { onPressFunction() }}
                data={images}
                renderItem={renderItem}
            />
        </SafeAreaView >
    ) : (
        <View style={{
            flex: 1,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <ActivityIndicator size="large" color="grey" />
        </View>);
    // return (
    //     <SafeAreaView style={styles.container}>
    //         <Text style={styles.t1}>SELECT AN ALBUM:{platform}</Text>
    //         <ScrollView style={{ flex: 1, backgroundColor: 'red' }}>
    //             {
    //                 images.map((image) =>
    //                     <View style={{ flexDirection: 'row', backgroundColor: 'yellow' }}>
    //                         <Image source={{ uri: image.uri }} style={{ width: '30%', height: 95 }} />
    //                     </View>
    //                 )
    //             }
    //         </ScrollView>
    //         {/* <ScrollView>
    //             <View style={styles.albumButton}>
    //                 {albumsMarkup}
    //             </View>
    //         </ScrollView> */}
    //         {/* 
    //         <Button
    //             title="
    //             SLike iz Galerije"
    //             onPress={() => navigation.navigate('Details')} />
    //         <Button
    //             title="UPALI NAVIGACIJU"
    //             onPress={() => navigation.setOptions({ headerShown: true })} /> */}
    //     </SafeAreaView>
    // );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    albumButton: {
        marginTop: 20
    },
    t1: {
        color: 'red',
        textAlign: 'center'
    }
});


export default HomeScreen;
