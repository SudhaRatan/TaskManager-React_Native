import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  Pressable,
  Animated,
  StatusBar,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import { Entypo } from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import SelectIcons from '../components/selectIcons';

import { insertCategory } from '../db-functions/db-sqlite';

const AddCategory = () => {
  // console.log(iconNames)
  const [name, setName] = useState('')
  const [iconColor, setIconColor] = useState("#3067C0")
  const [iconName, setIconName] = useState("home")
  const { width, height } = Dimensions.get('window')
  const navigation = useNavigation()
  const [toggle, setToggle] = useState(false)
  const [toggle1, setToggle1] = useState(false)
  const scale = useRef(new Animated.Value(0)).current
  const iconContScale = useRef(new Animated.Value(0)).current

  const iconAnimation = () => {
    setToggle1(!toggle1)
    if (toggle1) {
      Animated.spring(iconContScale, {
        toValue: 0,
        useNativeDriver: true
      }).start()
    } else {
      Animated.spring(iconContScale, {
        toValue: 1,
        useNativeDriver: true
      }).start()
    }
  }

  const showColorPallete = () => {
    setToggle(!toggle)
    if (toggle) {
      Animated.spring(scale, {
        toValue: 0,
        useNativeDriver: true
      }).start()
    } else {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true
      }).start()
    }
  }

  const setIcon = (name) => {
    setIconName(name)
    Animated.spring(iconContScale, {
      toValue: 0,
      useNativeDriver: true
    }).start()
    setToggle1(!toggle1)
  }

  const AddCategoryFunc = () => {
    insertCategory({ name, iconName, iconColor })
      .then(({stat,message}) => {
        if (stat) {
          navigation.navigate('Home')
        }
        ToastAndroid.show(message, 2000)
      })
      .catch(({stat,message}) =>  ToastAndroid.show(message, 2000))
  }

  return (
    <View style={St.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={St.closeButton}
      >
        <Ionicons name="ios-close-circle-outline" size={60} color="#00000090" />
      </Pressable>
      <View style={[St.mainContainer,
      {
        marginTop: width / 1.5,
      }
      ]}>
        <View style={St.form}>
          <TextInput
            style={[St.enterCategory, { width: width * 0.75, }]}
            placeholder='Enter new category'
            placeholderTextColor="#7B7998"
            value={name}
            onChangeText={(value) => {
              setName(value)
            }}
          />
          <View style={St.selectCont}>
            <View
              style={[
                {
                  width: width * 0.75 * 0.6,
                  borderRadius: width * 0.75 * 0.6 * 0.5,
                },
                St.chooseIconsButton
              ]}
            >
              <TouchableOpacity
                style={[
                  {
                    width: width * 0.75 * 0.6,
                    borderRadius: width * 0.75 * 0.6 * 0.5,
                  },
                  St.chooseIconsButton
                ]}
                onPress={() => {
                  iconAnimation()
                }}
              >
                <View
                  style={[
                    {
                      width: width * 0.75 * 0.6,
                      borderRadius: width * 0.75 * 0.6 * 0.5,
                    },
                    St.chooseIconsContainer
                  ]}
                >
                  <Text style={St.selIconText}>Select an icon</Text>
                  <Entypo name={iconName} size={24} color={iconColor} />
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={St.colorCont}
              onPress={showColorPallete}
            >
              <Ionicons name="md-radio-button-on" size={38} color={iconColor} />
            </TouchableOpacity>
          </View>
          <Animated.View style={[
            {
              transform: [
                {
                  translateX: scale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-width, 0]
                  })
                }
              ]
            },
            St.iconSelect
          ]}>
            {
              colorPallete.map((item, index) => {
                return (
                  <TouchableOpacity key={index}
                    onPress={() => {
                      setIconColor(item)
                      showColorPallete()
                    }}
                  >
                    <Ionicons name="md-radio-button-on" size={38} color={item} />
                  </TouchableOpacity>
                )
              })
            }
          </Animated.View>
          <Animated.View style={[
            {
              width: width * 0.8,
              transform: [
                {
                  translateX: iconContScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width, 0]
                  })
                }
              ],
            },
          ]}>
            <SelectIcons setIcon={setIcon} />
          </Animated.View>
        </View>
      </View>
      <View style={[
        St.AddCategory,
        {
          right: width - (width * 0.9),
          bottom: width - (width * 0.9),
        }
      ]}>
        <Animated.View style={{
          transform: [
            {
              translateY: iconContScale.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width]
              })
            }
          ],
        }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={St.addCatButton}
            onPress={AddCategoryFunc}
          >
            <Text style={St.addCatButtonText}>Add Category</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  )
}

export default AddCategory;

export const St = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFE'
  },
  closeButton: {
    position: 'absolute',
    zIndex: 3,
    top: 0,
    right: 0,
    marginTop: StatusBar.currentHeight,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFE'
  },
  chooseIconsModal: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeader: {
    color: '#7B7998',
    fontSize: 28,
  },
  form: {
    gap: 24,
  },
  enterCategory: {
    height: 60,
    fontSize: 24,
  },
  chooseIconsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 5,
    borderWidth: 1,
    borderColor: '#7B7998',
  },
  selIconText: {
    fontSize: 18,
  },
  selectCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCont: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: '#F9FAFE',
    elevation: 4,
  },
  iconSelect: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 5,
    flexDirection: 'row',
    borderRadius: 100,
    backgroundColor: '#F9FAFE',
    elevation: 2,
  },
  AddCategory: {
    position: 'absolute',
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addCatButton: {
    backgroundColor: "#106BFA",
    elevation: 10,
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  addCatButtonText: {
    color: '#F9FAFE',
    fontSize: 18,
  }
})

const colorPallete = [
  "#F9ED69",
  "#F08A5D",
  "#9D07B0",
  "#08D9D6",
  "#FF2E63",
  "#3067C0"
]
