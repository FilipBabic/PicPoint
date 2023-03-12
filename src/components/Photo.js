import React from 'react';
import { StyleSheet, Share, ScrollView, View, Dimensions, ImageBackground, Image, TouchableWithoutFeedback, TouchableOpacity, Text, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditIcon from '../icons/02-edit-dark.png';
import EditGrayIcon from '../icons/03-edit-silver.png';
import InfoButton from '../icons/01-home.png';
import ShareIcon from '../icons/10-share.png';
import ArrowBack from '../icons/04-arrow-back.png';
import * as Font from 'expo-font';
import * as MediaLibrary from 'expo-media-library';

let customFonts = {
    'Poppins-Regular': require('../fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../fonts/Poppins-Bold.ttf'),
};
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const GoogleMapsAPIKey = 'AIzaSyBU4bjZbr_wzt3_UPTfIj-WHjoqf_7orOA';
class Photo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.scrollRef = React.createRef()
        this.state = {
            fontsLoaded: false,
            isLoading: false,
            bottomBar: true,
            uri: this.props.item.uri,
            isViewed: this.props.item.isViewed,
            near_by_places: this.props.item.nearbyplaces,
            placeId: this.props.item.nearbyplaces[0]?.place_id,
            title: this.props.item.title,
            selected22: [],
            textFieldValue: this.props.item.nearbyplaces[0]?.name
        };
    }
    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
    }

    render() {
        const saveToDataBase = async () => {
            const formData = new FormData();
            const nameParts = this.props.item.filename.split('.')
            console.log("FILENAME", this.props.item.filename)
            const mime = nameParts[nameParts.length - 1]
            const assetInfo = await MediaLibrary.getAssetInfoAsync(this.props.item);
            console.log('assetInfo', assetInfo.localUri);
            formData.append('image', {
                uri: assetInfo.localUri,
                name: assetInfo.filename,
                type: `image/${mime}`
            });
            fetch('http://pixtest2022.me/upload-photo.php', {
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        const onShare = async () => {
            try {
                const result = await Share.share({
                    message:
                        'React Native | A framework for building native apps using React',
                });
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        // shared with activity type of result.activityType
                        console.log('1')
                        const res = await MediaLibrary.requestPermissionsAsync()
                        if (res.granted) {
                            await saveToDataBase()
                        } else {
                            console.log('blabla')
                        }
                    } else {
                        // shared
                        console.log('2')
                    }
                } else if (result.action === Share.dismissedAction) {
                    alert('Your photo share is cancelled')
                }
            } catch (error) {
                alert(error.message);
            }
        };
        const storeData = async (image_id, value) => {
            try {
                const jsonValue = JSON.stringify(value)
                await AsyncStorage.setItem(`@${image_id}`, jsonValue)
            } catch (e) {
                console.error(e);
            }
        }
        const handleChange = () => {
            this.setState({ isViewed: "yes" });
            this.setState({ title: this.state.textFieldValue })
            // this.setState({ placeId: this.state.textFieldValue })
            this.props.item.isViewed = "yes"
            this.props.item.title = this.state.textFieldValue
            this.props.item.place_id = this.state.placeId
        };
        const calculateAspectRatio = () => {
            let ratio = this.props.item.width / this.props.item.height;
            return ratio
        }
        const executeScroll = () => this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: true })
        const selectPlace = (id) => {
            for (let i = 0; i < this.props.item.nearbyplaces.length; i++) {
                if (id === i) {
                    this.props.item.nearbyplaces[id].selected22 = true
                } else {
                    this.props.item.nearbyplaces[i].selected22 = false
                }
            }
            this.props.item.isViewed = "yes"
            this.props.item.title = this.props.item.nearbyplaces[id]?.name
            this.props.item.place_id = this.props.item.nearbyplaces[id]?.place_id
        }
        const editPlaces = async (latitude, longitude) => {
            try {
                const response = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latitude + ',' + longitude + '&rankby=distance&key=' + GoogleMapsAPIKey);
                const data = await response.json()
                this.setState({ near_by_places: data?.results })
                console.log(data)
            } catch (error) {
                console.error(error);
            }
        }
        if (!this.state.fontsLoaded) {
            return null;
        }
        return (
            <View style={{ marginTop: 0, justifyContent: 'center', backgroundColor: 'white', width: screenWidth, height: screenHeight }}>
                <ImageBackground source={{ uri: this.props.item.uri }} style={{ width: screenWidth, aspectRatio: calculateAspectRatio() }} />
                {
                    this.state.isViewed === "yes" && (
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            width: '100%',
                            backgroundColor: 'white'
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <TouchableOpacity style={{ height: '100%' }} onPress={() => this.props.navigation.navigate('Home')}>
                                    <Image source={ArrowBack} style={{
                                        height: 20,
                                        width: 14,
                                        marginTop: 12,
                                        marginBottom: 12,
                                        marginLeft: 10
                                    }} title="Info Button" />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => onShare()}>
                                    <Text style={{
                                        fontSize: 19,
                                        fontFamily: 'Poppins-Bold',
                                        color: '#393939',
                                        marginTop: 11,
                                        paddingRight: 6
                                    }}>
                                        Share
                                    </Text>
                                    <View>
                                        <Image source={ShareIcon} style={{
                                            backgroundColor: 'white',
                                            height: 22,
                                            width: 26,
                                            marginTop: 11,
                                            marginRight: 5
                                        }} title="Share Button" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
                {
                    this.state.isViewed === "no" &&
                    (<View style={{
                        height: '50%',
                        position: 'absolute',
                        top: '25%',
                        width: '90%',
                        backgroundColor: 'white',
                        marginLeft: '5%',
                        borderWidth: 1,
                        borderColor: "#c8c8c8",
                        borderRadius: 30
                    }}>
                        <Text style={{
                            marginTop: 10,
                            paddingTop: 15,
                            paddingBottom: 15,
                            textAlign: 'center',
                            fontSize: 20, fontFamily: 'Poppins-Bold',
                            color: '#3d3d3d'
                        }}>
                            Pick a place for your photo</Text>
                        <ScrollView ref={this.scrollRef}>
                            <LinearGradient
                                style={{
                                    borderTopLeftRadius: 30,
                                    borderTopRightRadius: 30
                                }}
                                colors={['white', '#f1f1f1']}>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 10,
                                    width: '96%',
                                    height: 55,
                                    marginRight: '2%',
                                    marginLeft: '2%',
                                    borderWidth: 2,
                                    borderColor: "#c8c8c8",
                                    borderRadius: 14,
                                }}>
                                    <Image source={EditGrayIcon} style={{
                                        height: 20,
                                        width: 20,
                                        marginLeft: 12
                                    }} title="Info Button" />
                                    <TextInput
                                        style={{
                                            paddingLeft: 8,
                                            fontSize: 18,
                                            fontFamily: 'Poppins-Regular',
                                            color: '#3d3d3d'
                                        }}
                                        onChangeText={(text) => this.setState({ textFieldValue: text })}
                                        value={this.state.textFieldValue}
                                        placeholder="Loading..."
                                        keyboardType="default"
                                    />
                                </View>
                                {this.state.near_by_places.map((element, index, arr) => {
                                    return (
                                        <View key={index} style={{
                                            padding: 5,
                                            marginTop: 10,
                                            width: '96%',
                                            marginRight: '2%',
                                            marginLeft: '2%',
                                            borderWidth: 1,
                                            borderColor: "#c8c8c8",
                                            borderRadius: 14,
                                            textAlign: "center",
                                            backgroundColor: element.selected22 ? '#393939' : 'white'
                                        }}>
                                            <TouchableOpacity onPress={() => {
                                                this.setState({ textFieldValue: element.name })
                                                this.setState({ title: element.name })
                                                this.setState({ placeId: element.place_id })
                                                executeScroll();
                                                selectPlace(index)
                                            }} underlayColor="grey">
                                                <View>
                                                    <Text style={{
                                                        padding: 10,
                                                        fontSize: 17,
                                                        fontFamily: 'Poppins-Regular',
                                                        color: element.selected22 ? 'white' : '#c9c9c9'
                                                    }}>
                                                        {`\u2192 ${element.name}`}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                            </LinearGradient>
                        </ScrollView>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            textAlign: "center",
                            height: 80,
                        }}>
                            <TouchableWithoutFeedback onPress={() => {
                                const obj = {
                                    title: this.state.textFieldValue,
                                    place_id: this.state.placeId,
                                    isViewed: "yes",
                                    image_id: this.props.item.id
                                }
                                storeData(this.props.item.id, obj)
                                handleChange();
                            }}>
                                <LinearGradient
                                    style={{
                                        marginTop: 20,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#EB00A0',
                                        height: 40,
                                        width: 100,
                                        borderRadius: 30
                                    }}
                                    colors={['#E0038C', '#6A2B90']}>
                                    <Text style={{
                                        fontSize: 17,
                                        fontFamily: 'Poppins-Bold',
                                        color: 'white',
                                    }}>
                                        Save
                                    </Text>
                                </LinearGradient>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    )
                }
                {
                    this.state.isViewed === "yes" && (
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            backgroundColor: 'transparent'
                        }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                                <TouchableOpacity onPress={() => {
                                    this.props.navigation.navigate('Information', {
                                        itemId: this.props.item.id,
                                        uri: this.props.item.uri,
                                        place: this.state.title,
                                        place_id: this.props.item.place_id,
                                        latitude: this.props.item.latitude,
                                        longitude: this.props.item.longitude
                                    });
                                }}>
                                    <Image source={InfoButton} style={{ height: 60, width: 60 }} title="Info Button" />
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: 'white'
                            }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ isViewed: "no" })
                                    console.log(this.props.item.isViewed)
                                    editPlaces(this.props.item.latitude, this.props.item.longitude)
                                    // setIsViewed(false)
                                    // imagesTest[index].isViewed = "no"
                                    // console.log("KLIKED")

                                    // getNearByPlaces(imagesTest[index]?.latitude, imagesTest[index]?.longitude)
                                    // imagesTest[index].nearbyplaces = nearByPlaces
                                }}>
                                    <Image source={EditIcon} style={{ height: 20, width: 20, marginTop: 12 }} title="Edit Icon" />
                                </TouchableOpacity>
                                <Text style={{
                                    textAlign: 'center',
                                    padding: 12,
                                    fontSize: 17,
                                    fontFamily: 'Poppins-Regular',
                                    color: '#393939'
                                }}>
                                    {this.state.title}
                                </Text>
                            </View>
                        </View>
                    )
                }
            </View >
        )
    }
}
export default Photo;
