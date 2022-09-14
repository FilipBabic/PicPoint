import React, { useState, useEffect } from 'react';
import { StatusBar, View, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import Photo from '../components/Photo';
const screenWidth = Dimensions.get('window').width;
const DetailScreen = ({ route, navigation }) => {
    const { imagesTest, itemId, headerHeight } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        setIsLoading(false)
    }, []);
    const getItemLayout = (data, index) => (
        { length: screenWidth, offset: screenWidth * index, index }
    );
    // const swipedItem = (e) => {
    //     let contentOffset = e.nativeEvent.contentOffset;
    //     let viewSize = e.nativeEvent.layoutMeasurement;
    //     let pageNum = Math.floor(contentOffset.x / viewSize.width);
    // }
    return isLoading === false ? (
        <View >
            <StatusBar
                hidden={true} />
            <FlatList
                horizontal
                pagingEnabled
                //onMomentumScrollEnd={swipedItem}
                keyExtractor={item => item.id}
                initialScrollIndex={itemId}
                data={imagesTest}
                getItemLayout={getItemLayout}
                renderItem={({ item, index }) =>
                    <Photo item={item} index={index} navigation={navigation} headerHeight={headerHeight} />
                }
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
