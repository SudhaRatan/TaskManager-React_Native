import {
  View,
  Text,
  Pressable,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  ToastAndroid,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { AntDesign } from 'react-native-vector-icons/AntDesign';
import { MaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const Add = ({ enableTaskButton }) => {

  const navigation = useNavigation();
  const scale = useRef(new Animated.Value(0)).current
  const { width, height } = Dimensions.get('window')
  const addButtonHeight = Math.floor(width < height ? height * 0.08 : width * 0.08)

  useEffect(() => {
    scaleUp();
  }, [scale]);

  const translateY = useRef(new Animated.Value(0)).current
  const [toggle, setToggle] = useState(false)

  const scaleUp = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  const pressInOut = (val) => {
    Animated.spring(scale, {
      toValue: val,
      useNativeDriver: true,
    }).start()
  }

  const handlePress = () => {
    setToggle(!toggle)
    if (toggle) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.spring(translateY, {
        toValue: addButtonHeight,
        useNativeDriver: true,
      }).start()
    }
  }

  const addCategory = () => {
    handlePress()
    navigation.navigate('AddCategory')
  }

  const addTask = () => {
    let res = enableTaskButton()
    if (res) {
      handlePress()
      navigation.navigate('AddTask')
    } else {
      ToastAndroid.show("Add a category first",1000)
    }
  }

  return (
    <View style={St.container}>

      {/* Add task button */}
      <TouchableWithoutFeedback
        onPress={addTask}
      >
        <Animated.View style={[
          St.taskButton,
          {
            width: addButtonHeight * 2 * 0.9,
            height: addButtonHeight * 0.9,
            borderRadius: addButtonHeight / 2,
            transform: [
              {
                translateY: translateY.interpolate({
                  inputRange: [0, addButtonHeight],
                  outputRange: [0, -addButtonHeight]
                })
              },
              {
                scale: translateY.interpolate({
                  inputRange: [0, addButtonHeight],
                  outputRange: [0, 1]
                })
              },
              {
                translateX: translateY.interpolate({
                  inputRange: [0, addButtonHeight / 3, addButtonHeight],
                  outputRange: [0, addButtonHeight * 1.2, -addButtonHeight * 0.4]
                })
              }
            ]
          }
        ]}>
          <Text style={St.taskButtonText}>Add task</Text>
          <MaterialIcons name="add-task" size={24} color="#F9FAFE" />
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Add category button */}
      <TouchableWithoutFeedback
        onPress={addCategory}
      >
        <Animated.View style={[
          St.taskButton,
          {
            width: addButtonHeight * 2.2,
            height: addButtonHeight * 0.9,
            borderRadius: addButtonHeight / 2,
            transform: [
              {
                translateY: translateY.interpolate({
                  inputRange: [0, addButtonHeight],
                  outputRange: [0, -addButtonHeight * 2]
                })
              },
              {
                scale: translateY.interpolate({
                  inputRange: [0, addButtonHeight],
                  outputRange: [0.3, 1]
                })
              },
              {
                translateX: translateY.interpolate({
                  inputRange: [0, addButtonHeight / 3, addButtonHeight],
                  outputRange: [0, -addButtonHeight * 1.2, -addButtonHeight * 0.6]
                })
              }
            ]
          }
        ]}>
          <Text style={St.taskButtonText}>Add category</Text>
          <MaterialIcons name="category" size={24} color="#F9FAFE" />
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Add button */}
      <Pressable
        onPressIn={() => pressInOut(0.8)}
        onPressOut={() => pressInOut(1)}
        onPress={handlePress}>
        <Animated.View
          style={[
            {
              width: addButtonHeight,
              height: addButtonHeight,
              borderRadius: addButtonHeight / 2,
              transform: [{ scale }]
            },
            St.addButtonContainer
          ]}>
          {
            !toggle
              ?
              <AntDesign name="plus" size={32} color="#F9FAFE" />
              :
              <AntDesign name="up" size={28} color="#F9FAFE" />
          }
        </Animated.View>
      </Pressable>
    </View>
  )
}

export default Add;

const St = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  addButtonContainer: {
    backgroundColor: '#393053',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  taskButton: {
    backgroundColor: '#635985',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    elevation: 2,
  },
  taskButtonText: {
    // fontSize: 16,
    color: '#F9FAFE',
  }
})
