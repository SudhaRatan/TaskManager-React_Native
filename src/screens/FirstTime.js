import { View, Text, StatusBar, Animated, Dimensions, TouchableOpacity, TextInput, ToastAndroid } from 'react-native'
import { MotiView } from 'moti'
import { useRef, useEffect, useState } from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

const FirstTime = () => {

  const { width, height } = Dimensions.get('screen')
  const AnimVal = useRef(new Animated.Value(0)).current
  const animWidth = useRef(new Animated.Value(0)).current
  const animScale = useRef(new Animated.Value(0)).current
  const animInp = useRef(new Animated.Value(0)).current

  const navigation = useNavigation()

  const startAnims = () => {
    Animated.sequence([
      Animated.spring(animScale, {
        toValue: 1,
        useNativeDriver: false,
        delay: 300
      }).start(),
      Animated.spring(AnimVal, {
        toValue: 1,
        useNativeDriver: true,
        delay: 300
      }).start()
    ])
  }

  const transform = () => {
    Animated.parallel([
      Animated.spring(animWidth, {
        toValue: 1,
        useNativeDriver: false
      }).start(),
      Animated.spring(AnimVal, {
        toValue: 0,
        useNativeDriver: true
      }).start(),
      Animated.spring(animInp, {
        toValue: 1,
        useNativeDriver: true
      }).start(),
    ])
  }

  const [name, setName] = useState('')
  const setusername = async () => {
    if (name !== '') {
      await AsyncStorage.setItem('name', name)
      await AsyncStorage.setItem('notFirstTime', '1')
      navigation.navigate('Main')
    } else {
      ToastAndroid.show('Enter your name', 500)
    }
  }

  useEffect(() => {
    startAnims()
  }, [])


  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F9FAFE',
    }}>
      <StatusBar backgroundColor={"#F9FAFE"} barStyle='dark-content' />
      <Animated.View style={{
        backgroundColor: '#111E53',
        width: width * 0.9,
        height: animWidth.interpolate({
          inputRange: [0, 1],
          outputRange: [width * 0.9, 60]
        }),
        position: 'absolute',
        borderRadius: 1000,
        transform: [
          {
            scale: animScale
          },
        ]
      }} />
      <Animated.View
        style={{
          transform: [
            {
              translateX: animInp.interpolate({
                inputRange: [0, 1],
                outputRange: [width, 0]
              })
            }
          ],
          position: 'absolute',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TextInput
          style={{
            // backgroundColor: '#000555',
            width: width * 0.7,
            fontSize: 20,
            color: '#F9FAFE',
          }}
          value={name}
          placeholder="What's your name ?"
          onChange={(val) => setName(val.nativeEvent.text)}
        />
        <TouchableOpacity onPress={setusername}>
          <AntDesign name='swapright' size={40} />
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        style={{
          position: 'absolute',
        }}
        onPress={transform}
      >
        <Animated.View style={{
          backgroundColor: '#fff',
          width: width * 0.2,
          height: width * 0.2,
          borderRadius: 1000,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [
            {
              scale: AnimVal.interpolate({
                inputRange: [0, 1],
                outputRange: [2, 1]
              })
            },
            {
              translateY: width * 0.9 / 2 - width * 0.2
            }
          ],
          opacity: AnimVal.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
          })
        }}>
          <Entypo color='#111E53' name='triangle-right' size={60} />
        </Animated.View>
      </TouchableOpacity>

      {/* 1st component */}
      <Animated.View style={{
        flexDirection: 'row',
        position: 'absolute'
      }}>
        <Animated.View
          style={{
            transform: [
              {
                scale: AnimVal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              },
              {
                translateY: AnimVal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-800, 0]
                })
              }

            ]
          }}
        >
          <Text style={{ color: '#fff', fontSize: 40, }}>Hello </Text>
        </Animated.View>
        <Animated.View
          style={{
            transform: [
              {
                scale: AnimVal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              },
              {
                translateY: AnimVal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [800, 0]
                })
              }

            ]
          }}
        >
          <Text style={{ color: '#fff', fontSize: 40, }}>User</Text>
        </Animated.View>
      </Animated.View>
    </View>
  )
}

export default FirstTime