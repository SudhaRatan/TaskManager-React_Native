import {
  View,
  Text,
  Dimensions,
  Animated as Anim,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { AnimatePresence } from 'moti';
import CheckBox from './checkBox';
import CheckBox1 from './checkBox1';
import { HandleCheck, removeTaskFromScheduled } from '../db-functions/db-sqlite';
import Animated, { Layout, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { SelectCategoryColor } from '../db-functions/db-sqlite';
import { cancelNotification } from '../notifications/notifications';

const TaskCardScheduled = ({ name, checked, id, index, handleDelete, categoryId, changeState, scheduled_datetime }) => {
  const { width, height } = Dimensions.get('window')
  const addButtonHeight = Math.floor(width < height ? height * 0.075 : width * 0.075)
  const [check, setCheck] = useState(checked)
  const [color, setColor] = useState(null)
  const pressInOut = (val) => {
    Anim.spring(scale1, {
      toValue: val,
      useNativeDriver: true,
    }).start()
  }
  const scale1 = useRef(new Anim.Value(1)).current

  const handleCheck = () => {
    setCheck(!check)
    changeState()
    HandleCheck(id, check)
  }

  const getColor = async () => {
    setColor(await SelectCategoryColor(categoryId))
  }

  const [options, setOptions] = useState(false)

  const handleLongPress = () => {
    setOptions(!options)
  }

  const removescheduled = () => {
    removeTaskFromScheduled(id)
      .then(res => {
        if(res) {
          changeState()
          cancelNotification(id)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getColor()
    setCheck(checked)
  }, [checked]);

  const leftSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0.4, 0.9],
      extrapolate: 'clamp',
    })
    return (
      <Anim.View
        style={[
          {
            transform: [{ scale: scale }],
            backgroundColor: 'green',
            width: addButtonHeight,
            height: addButtonHeight,
          },
          St.swipeContainer
        ]}
      >
        <MaterialIcons name="edit" size={50} color="white" />
      </Anim.View>
    )
  }

  const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.9, 0.4],
      extrapolate: 'clamp',
    })
    return (
      <Anim.View
        style={[
          {
            transform: [{ scale: scale }],
            backgroundColor: 'red',
            width: addButtonHeight,
            height: addButtonHeight,
            position: 'relative',
          },
          St.swipeContainer
        ]}
      >
        <Pressable
          onPress={() => handleDelete(id)}
        >
          <MaterialCommunityIcons name="delete" size={50} color="white" />
        </Pressable>
      </Anim.View>
    )
  }

  return (
    <Animated.View
      entering={SlideInLeft.delay(index * 50).springify().damping(13)}
      exiting={SlideOutLeft}
      layout={Layout.springify().damping(13)}
    >
      <Swipeable renderLeftActions={leftSwipe} renderRightActions={rightSwipe}>
        <Pressable
          onPressIn={() => pressInOut(0.92)}
          onPressOut={() => pressInOut(1)}
          onPress={handleCheck}
          onLongPress={handleLongPress}
        >
          <Anim.View style={[
            {
              width: width - 40,
              transform: [{ scale: scale1 }],
              height: addButtonHeight,
            },
            St.taskContainer
          ]}>
            <AnimatePresence>
              {!check && <CheckBox color={color} handleCheck={handleCheck} />}
              {check && <CheckBox1 color={color} handleCheck={handleCheck} />}
            </AnimatePresence>
            <AnimatePresence>

              {
                options ?
                  <View style={{ flex: 1, gap: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <TouchableOpacity onPress={removescheduled}>
                      <Text style={[St.taskText, { color: color, verticalAlign: 'middle', borderWidth: 1, paddingHorizontal: 5, borderColor: color, borderRadius: 10, }]} >
                        Remove from scheduled
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setOptions(false)}>
                      <View style={{ borderWidth: 1, padding: 5, borderColor: color, borderRadius: 10, }}>
                        <AntDesign name='back' color={color} size={30} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  :
                  <Text style={[
                    {
                      color: check ? '#808080' : '#5F5F63',
                      textDecorationLine: check ? 'line-through' : 'none',
                    },
                    St.taskText
                  ]}>{name}</Text>
              }
            </AnimatePresence>
          </Anim.View>
          <View style={{
            backgroundColor: '#fff',
            elevation: 1,
            // marginVertical:-addButtonHeight/4,
            width: width / 2 - 20,
            height: 24,
            position: 'absolute',
            right: 0,
            transform: [
              // {translateX:width/2},
              { translateY: addButtonHeight }
            ],
            borderBottomLeftRadius: 80,
            borderBottomRightRadius: 20,
          }} >
            <Text style={{
              color: '#000',
              textAlign: 'center'
            }}>
              {new Date(scheduled_datetime).toString().slice(4, new Date(scheduled_datetime).toString().length - 12)}
            </Text>
          </View>
        </Pressable>
      </Swipeable>
    </Animated.View>
  )
}

export default TaskCardScheduled;

const St = StyleSheet.create({
  swipeContainer: {
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  taskContainer: {
    backgroundColor: '#fff',
    flex: 1,
    marginBottom: 30,
    elevation: 1,
    alignItems: 'center',
    borderBottomRightRadius: 0,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
  },
  taskText: {
    flex: 1,
    fontSize: 18,
  }
})