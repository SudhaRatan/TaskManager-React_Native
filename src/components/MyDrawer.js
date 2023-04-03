import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  BackHandler
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { Pressable } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dropCategories, dropTasks } from '../db-functions/db-sqlite';
import RNExitApp from 'react-native-exit-app';


const MyDrawer = (props) => {

  const [name, setName] = useState('')
  const getName = async () => {
    setName(await AsyncStorage.getItem('name'))
  }

  const reset = () => {
    dropCategories()
      .then(res => {
        dropTasks()
          .then(async(res) => {
            await AsyncStorage.multiRemove(['name','notFirstTime'])
            RNExitApp.exitApp()
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))

  }

  const handleReset = () => {
    Alert.alert('Reset!', 'Are you sure you want to reset the app ?', [
      {
        text: 'Cancel',
        onPress: () => { },
        style: 'cancel',
      },
      { text: 'OK', onPress: () => { reset() } },
    ])
  }

  useEffect(() => {
    getName()
  }, []);

  return (
    <View style={St.drawerContainer}>
      {
        useDrawerStatus() === "open"
          ? <StatusBar backgroundColor={"#111E53"} barStyle='light-content' />
          : <StatusBar backgroundColor={"#F9FAFE"} barStyle='dark-content' />
      }
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <DrawerContentScrollView {...props} >
          <View>
            <View style={St.profileIconContainer}>
              <MaterialCommunityIcons name="account-circle-outline" size={120} color="#d0fCf1" />
            </View>
            <Text style={St.nameContainer}>{name}</Text>
          </View>
          <DrawerItemList  {...props} />
        </DrawerContentScrollView>
        <Pressable
          onPress={() => { props.navigation.dispatch(DrawerActions.closeDrawer()) }}
          style={St.backIconContainer}>
          <Entypo name="chevron-with-circle-left" size={40} color="#d0fCf1" />
        </Pressable>
      </View>
      <TouchableOpacity style={{
        marginLeft: 5,
        marginBottom: 15,
        flexDirection: 'row',
        gap: 5,
        width: 150,
        padding: 4,
      }}
        onPress={handleReset}
      >
        <AntDesign name='warning' size={24} color='#F9FAFE' />
        <Text style={{
          color: '#F9FAFE',
          fontSize: 18,
        }}>Reset</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MyDrawer;

const St = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    paddingTop: 20,
  },
  profileIconContainer: {
    flexDirection: 'row',
  },
  nameContainer: {
    fontSize: 28,
    margin: 10,
    color: '#F8FCFF'
  },
  backIconContainer: {
  }
})