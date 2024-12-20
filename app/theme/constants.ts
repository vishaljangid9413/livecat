import { useRoute } from '@react-navigation/native';
import { useMemo } from 'react';
import { Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const WINDOW_WIDTH = Dimensions.get('window').width;
export const isIos = Platform.OS === 'ios'
export const CELL_COUNT = 6

export const SCREEN_HEIGHT = ()=>{
    const route = useRoute()
    const {bottom} = useSafeAreaInsets()
    return useMemo(()=>{
        const SearchScreen = ['LiveShows', 'ProductsList', 'Vendors', 'Orders', 'Customers', 'Account','AddProducts'].includes(route?.name)
        let screenHeight = WINDOW_HEIGHT  - bottom - 30
        if (isIos){
            screenHeight -= (SearchScreen ? 180 : 130)
        }else{
            screenHeight -= (SearchScreen ? 155 : 90)
        }
        return screenHeight
    },[route.name])
}
 

