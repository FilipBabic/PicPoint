import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
    const [image, setImage] = useState(null);
    const [latitude, setLatitude] = useState([]);
    const [longitude, setLongitude] = useState([]);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            exif: true,
        }).then(result => {
            setImage(result.uri);
            setLatitude(result.exif?.GPSLatitude);
            setLongitude(result.exif?.GPSLongitude);
        }).catch((err) => {
            console.error(err);
        });

        console.log("test res", result);
        console.log("PROBA", result.exif.ImageWidth);
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{titleText}</Text>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && (
                <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
            )}
        </View>
    );
}

const RESPONSE_GOOGLE = () => {
    return (
        [{
            "address_components": [
                { "long_name": "11", "short_name": "11", "types": ["street_number"] },
                { "long_name": "Marka Čelebonovića", "short_name": "Marka Čelebonovića", "types": ["route"] },
                { "long_name": "Novi Beograd", "short_name": "Novi Beograd", "types": ["political", "sublocality", "sublocality_level_1"] },
                { "long_name": "Beograd", "short_name": "BG", "types": ["locality", "political"] },
                { "long_name": "Grad Beograd", "short_name": "Grad Beograd", "types": ["administrative_area_level_2", "political"] },
                { "long_name": "Serbia", "short_name": "RS", "types": ["country", "political"] }],
            "formatted_address": "Marka Čelebonovića 11, Beograd, Serbia",
            "geometry": { "bounds": { "northeast": { "lat": 44.81921029999999, "lng": 20.3821582 }, "southwest": { "lat": 44.8189977, "lng": 20.3819377 } }, "location": { "lat": 44.8190956, "lng": 20.3820404 }, "location_type": "ROOFTOP", "viewport": { "northeast": { "lat": 44.8204529802915, "lng": 20.3833969302915 }, "southwest": { "lat": 44.8177550197085, "lng": 20.3806989697085 } } },
            "place_id": "ChIJOSqHdmJvWkcRGOu4ijjP3Kc",
            "types": ["premise"]
        },
        {
            "address_components":
                [{ "long_name": "11", "short_name": "11", "types": ["street_number"] },
                { "long_name": "Marka Čelebonovića", "short_name": "Marka Čelebonovića", "types": ["route"] },
                { "long_name": "Novi Beograd", "short_name": "Novi Beograd", "types": ["political", "sublocality", "sublocality_level_1"] },
                { "long_name": "Beograd", "short_name": "BG", "types": ["locality", "political"] },
                { "long_name": "Grad Beograd", "short_name": "Grad Beograd", "types": ["administrative_area_level_2", "political"] }, { "long_name": "Serbia", "short_name": "RS", "types": ["country", "political"] }], "formatted_address": "Marka Čelebonovića 11, Beograd, Serbia", "geometry": { "location": { "lat": 44.8191431, "lng": 20.3820187 }, "location_type": "ROOFTOP", "viewport": { "northeast": { "lat": 44.82049208029149, "lng": 20.3833676802915 }, "southwest": { "lat": 44.8177941197085, "lng": 20.3806697197085 } } }, "place_id": "ChIJUaKwdWJvWkcRvZoMOBl_v58", "types": ["street_address"]
        },
        {
            "address_components":
                [{ "long_name": "9", "short_name": "9", "types": ["street_number"] },
                { "long_name": "Marka Čelebonovića", "short_name": "Marka Čelebonovića", "types": ["route"] },
                { "long_name": "Novi Beograd", "short_name": "Novi Beograd", "types": ["political", "sublocality", "sublocality_level_1"] },
                { "long_name": "Beograd", "short_name": "BG", "types": ["locality", "political"] },
                { "long_name": "Grad Beograd", "short_name": "Grad Beograd", "types": ["administrative_area_level_2", "political"] },
                { "long_name": "Serbia", "short_name": "RS", "types": ["country", "political"] }],
            "formatted_address": "Marka Čelebonovića 9, Beograd, Serbia",
            "geometry": {
                "location": { "lat": 44.8194289, "lng": 20.3822929 },
                "location_type": "RANGE_INTERPOLATED",
                "viewport": { "northeast": { "lat": 44.8207778802915, "lng": 20.3836418802915 }, "southwest": { "lat": 44.8180799197085, "lng": 20.3809439197085 } }
            },
            "place_id": "EidNYXJrYSDEjGVsZWJvbm92acSHYSA5LCBCZW9ncmFkLCBTZXJiaWEiGhIYChQKEgkNGvMqiGVaRxGAGeCAlxtbCxAJ",
            "types": ["street_address"]
        },
        {
            "address_components":
                [{ "long_name": "9", "short_name": "9", "types": ["street_number"] },
                { "long_name": "Marka Čelebonovića", "short_name": "Marka Čelebonovića", "types": ["route"] },
                { "long_name": "Novi Beograd", "short_name": "Novi Beograd", "types": ["political", "sublocality", "sublocality_level_1"] },
                { "long_name": "Beograd", "short_name": "BG", "types": ["locality", "political"] },
                { "long_name": "Grad Beograd", "short_name": "Grad Beograd", "types": ["administrative_area_level_2", "political"] },
                { "long_name": "Serbia", "short_name": "RS", "types": ["country", "political"] }],
            "formatted_address": "Marka Čelebonovića 9, Beograd, Serbia",
            "geometry": {
                "bounds": { "northeast": { "lat": 44.819514, "lng": 20.3849897 }, "southwest": { "lat": 44.81857460000001, "lng": 20.381991 } }, "location": { "lat": 44.819062, "lng": 20.3835013 },
                "location_type": "GEOMETRIC_CENTER", "viewport": { "northeast": { "lat": 44.8203932802915, "lng": 20.3849897 }, "southwest": { "lat": 44.81769531970851, "lng": 20.381991 } }
            },
            "place_id": "ChIJDRrzKohlWkcRgBnggJcbWws", "types": ["route"]
        },
        {
            "address_components":
                [{
                    "long_name": "Bežanijska kosa", "short_name": "Bežanijska kosa",
                    "types": ["neighborhood", "political"]
                },
                { "long_name": "Novi Beograd", "short_name": "Novi Beograd", "types": ["political", "sublocality", "sublocality_level_1"] },
                { "long_name": "Beograd", "short_name": "BG", "types": ["locality", "political"] },
                { "long_name": "Grad Beograd", "short_name": "Grad Beograd", "types": ["administrative_area_level_2", "political"] },
                { "long_name": "Serbia", "short_name": "RS", "types": ["country", "political"] }],
            "formatted_address": "Bežanijska kosa, Beograd, Serbia",
            "geometry": { "bounds": { "northeast": { "lat": 44.8256215, "lng": 20.3948735 }, "southwest": { "lat": 44.8057726, "lng": 20.3615714 } }, "location": { "lat": 44.8180633, "lng": 20.375494 }, "location_type": "APPROXIMATE", "viewport": { "northeast": { "lat": 44.8256215, "lng": 20.3948735 }, "southwest": { "lat": 44.8057726, "lng": 20.3615714 } } },
            "place_id": "ChIJ_0kQ8GNvWkcRGDNznqQwEzY",
            "types": ["neighborhood", "political"]
        },
        {
            "address_components":
                [{ "long_name": "New Belgrade", "short_name": "New Belgrade", "types": ["political", "sublocality", "sublocality_level_1"] },
                { "long_name": "Belgrade", "short_name": "BG", "types": ["locality", "political"] },
                {
                    "long_name": "City of Belgrade", "short_name": "City of Belgrade",
                    "types": ["administrative_area_level_2", "political"]
                },
                { "long_name": "Serbia", "short_name": "RS", "types": ["country", "political"] }],
            "formatted_address": "New Belgrade, Belgrade, Serbia", "geometry": {
                "bounds": { "northeast": { "lat": 44.8358439, "lng": 20.4482282 }, "southwest": { "lat": 44.7701292, "lng": 20.3255223 } },
                "location": { "lat": 44.8099561, "lng": 20.380088 },
                "location_type": "APPROXIMATE",
                "viewport": { "northeast": { "lat": 44.8358439, "lng": 20.4482282 }, "southwest": { "lat": 44.7701292, "lng": 20.3255223 } }
            },
            "place_id": "ChIJc_VYBXBvWkcRMn0yXSABoKI",
            "types": ["political", "sublocality", "sublocality_level_1"]
        },
        {
            "address_components":
                [{ "long_name": "Novi Beograd", "short_name": "Novi Beograd", "types": ["administrative_area_level_3", "political"] },
                { "long_name": "New Belgrade", "short_name": "New Belgrade", "types": ["political", "sublocality", "sublocality_level_1"] },
                { "long_name": "Belgrade", "short_name": "BG", "types": ["locality", "political"] },
                {
                    "long_name": "City of Belgrade", "short_name": "City of Belgrade",
                    "types": ["administrative_area_level_2", "political"]
                },
                { "long_name": "Serbia", "short_name": "RS", "types": ["country", "political"] }],
            "formatted_address": "Novi Beograd, Belgrade, Serbia",
            "geometry": {
                "bounds": { "northeast": { "lat": 44.8358325, "lng": 20.4482593 }, "southwest": { "lat": 44.7701368, "lng": 20.3255898 } },
                "location": { "lat": 44.8099561, "lng": 20.380088 },
                "location_type": "APPROXIMATE", "viewport": { "northeast": { "lat": 44.8358325, "lng": 20.4482593 }, "southwest": { "lat": 44.7701368, "lng": 20.3255898 } }
            },
            "place_id": "ChIJxSTgw3VvWkcRQ9q91HNqhuY",
            "types": ["administrative_area_level_3", "political"]
        },
        {
            "address_components": [{ "long_name": "Belgrade", "short_name": "BG", "types": ["locality", "political"] },
            { "long_name": "City of Belgrade", "short_name": "City of Belgrade", "types": ["administrative_area_level_2", "political"] },
            { "long_name": "Serbia", "short_name": "RS", "types": ["country", "political"] }],
            "formatted_address": "Belgrade, Serbia", "geometry": { "bounds": { "northeast": { "lat": 44.9424453, "lng": 20.6234838 }, "southwest": { "lat": 44.6880454, "lng": 20.2217102 } }, "location": { "lat": 44.8125449, "lng": 20.4612299 }, "location_type": "APPROXIMATE", "viewport": { "northeast": { "lat": 44.9424453, "lng": 20.6234838 }, "southwest": { "lat": 44.6880454, "lng": 20.2217102 } } },
            "place_id": "ChIJvT-116N6WkcR5H4X8lxkuB0", "types": ["locality", "political"]
        },
        {
            "address_components": [{ "long_name": "City of Belgrade", "short_name": "City of Belgrade", "types": ["administrative_area_level_2", "political"] }, { "long_name": "Vojvodina", "short_name": "Vojvodina", "types": ["administrative_area_level_1", "political"] },
            { "long_name": "Serbia", "short_name": "RS", "types": ["country", "political"] }],
            "formatted_address": "City of Belgrade, Serbia", "geometry": { "bounds": { "northeast": { "lat": 45.099193, "lng": 20.860079 }, "southwest": { "lat": 44.262739, "lng": 19.9831509 } }, "location": { "lat": 44.5850395, "lng": 20.3964026 }, "location_type": "APPROXIMATE", "viewport": { "northeast": { "lat": 45.099193, "lng": 20.860079 }, "southwest": { "lat": 44.262739, "lng": 19.9831509 } } },
            "place_id": "ChIJcc5v0yNzWkcRU602j-7c1rI", "types": ["administrative_area_level_2", "political"]
        }, {
            "address_components": [{ "long_name": "Serbia", "short_name": "RS", "types": ["country", "political"] }], "formatted_address": "Serbia", "geometry": { "bounds": { "northeast": { "lat": 46.190032, "lng": 23.0063095 }, "southwest": { "lat": 42.2315029, "lng": 18.8385221 } }, "location": { "lat": 44.016521, "lng": 21.005859 }, "location_type": "APPROXIMATE", "viewport": { "northeast": { "lat": 46.190032, "lng": 23.0063095 }, "southwest": { "lat": 42.2315029, "lng": 18.8385221 } } },
            "place_id": "ChIJlYCJ8t8dV0cRXYYjN-pQXgU", "types": ["country", "political"]
        }]
    )
}