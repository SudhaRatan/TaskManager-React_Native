import {
  Dimensions,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import Home from '../screens/Home';
import MyDrawer from '../components/MyDrawer';
import AddCategory from '../screens/AddCategory';
import AddTask from '../screens/AddTask';
import Category from '../screens/Category';

const MainStack = createStackNavigator();
const MainDrawerNavig = createDrawerNavigator();

const MainDrawer = () => {

  const { width } = Dimensions.get('window')

  return (
    <MainDrawerNavig.Navigator
      screenOptions={{
        header: () => null,
        drawerType: 'slide',
        overlayColor: '#00000000',
        drawerStyle: {
          backgroundColor: '#111E53',
          width: width * 0.7,
        },
        drawerLabelStyle: {
          color: '#ffffff',
        },
        drawerActiveBackgroundColor: '#00000020'
      }}
      drawerContent={props => <MyDrawer {...props} />}
    >
      <MainDrawerNavig.Screen name="Home" component={Home} />
    </MainDrawerNavig.Navigator>
  )
}

const MainNavigation = () => {

  return (
    <NavigationContainer>
      <MainStack.Navigator screenOptions={{
        header: () => null
      }}>
        <MainStack.Screen name="Main" component={MainDrawer} />
        <MainStack.Screen name="Category" component={Category} />
        <MainStack.Screen name="AddCategory" component={AddCategory} />
        <MainStack.Screen name="AddTask" component={AddTask} />
      </MainStack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigation;

