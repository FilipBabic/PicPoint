import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import InfoScreen from '../screens/InfoScreen';
import NotesScreen from '../screens/NotesScreen';

const Tab = createBottomTabNavigator();

const Tabs = ({ route }) => {
    const { itemId, place, uri, place_id, longitude, latitude } = route.params;
    console.log("ROUTE PARAMS", itemId, place);
    return (
        <Tab.Navigator>
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