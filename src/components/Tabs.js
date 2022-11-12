import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { useFonts } from 'expo-font';
import InfoScreen from '../screens/InfoScreen';
import NotesScreen from '../screens/NotesScreen';
import Info from '../icons/06-info.png';
import InfoSel from '../icons/06-info-selected.png';
import Notes from '../icons/07-notes.png';
import NotesSel from '../icons/07-notes-selected.png';
const Tab = createBottomTabNavigator();

const Tabs = ({ route }) => {
    const { itemId, place, uri, place_id, longitude, latitude } = route.params;
    console.log("ROUTE PARAMS", itemId, place);
    const [fontsLoaded] = useFonts({
        'Poppins-Regular': require('../fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../fonts/Poppins-Bold.ttf'),
    });
    if (!fontsLoaded) {
        return null;
    }
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarLabelPosition: 'beside-icon',
                tabBarLabelStyle: {
                    fontFamily: 'Poppins-Regular',
                    fontSize: 17
                },
                tabBarActiveTintColor: '#393939',
                tabBarActiveBackgroundColor: '#f1f1f1',
                tabBarIcon: ({ tintColor, focused }) => (
                    focused ? (<Image source={route.name === "Info" ? InfoSel : NotesSel} style={{ height: 20, width: 20 }} />) :
                        (<Image source={route.name === "Notes" ? Notes : Info} style={{ height: 20, width: 20 }} />)

                )
            })}>
            <Tab.Screen name="Info"
                component={InfoScreen}
                initialParams={{ itemId, uri, place, place_id, latitude, longitude }}
            />
            <Tab.Screen name="Notes" component={NotesScreen}
                initialParams={{ itemId, uri, place, place_id, latitude, longitude }}
            />
        </Tab.Navigator>
    )
}

export default Tabs;