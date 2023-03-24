import { View, Text } from "react-native";
import Home from "../screens/Home";
import Category from "../screens/Category";
import AddTask from "../screens/AddTask";
import AddCategory from "../screens/AddCategory";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator()

const Navigator = () => {
  return(
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Home} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default Navigator