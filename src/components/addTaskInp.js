import { View, TextInput, StyleSheet, Dimensions, Animated } from "react-native";
import Entypo from 'react-native-vector-icons/Entypo'
import { useRef } from "react";
import { Pressable } from "react-native";

const AddTask = (props) => {

  const { width, height } = Dimensions.get('window')
  const addButtonHeight = Math.floor(width < height ? height * 0.075 : width * 0.075)

  const scale = useRef(new Animated.Value(1)).current

  const pressInOut = (val) => {
    Animated.spring(scale, {
      toValue: val,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View style={St.mainCont}>
      <View style={[
        St.cont,
        {
          width: width - 40 - 60,
          height: addButtonHeight
        }
      ]}>
          <TextInput
            placeholder="Enter new task"
            placeholderTextColor={'#808080'}
            style={St.inp}
            value={props.name}
            onChangeText={props.handleInput}
          />
      </View>
      <Pressable
        onPressIn={() => pressInOut(0.8)}
        onPressOut={() => pressInOut(1)}
        onPress={props.AddTaskFunc}
      >
        <Animated.View style={[
          {
            transform: [{ scale: scale }]
          },
          St.addButton
        ]}>
          <Entypo name='plus' size={addButtonHeight - 20} color="#F9FAFE" />
        </Animated.View>
      </Pressable>
    </View>
  )
}

export default AddTask;

const St = StyleSheet.create({
  mainCont: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    gap: 10,
  },
  addButton: {
    backgroundColor: '#393053',
    padding: 10,
    borderRadius: 60,
    elevation: 8,
  },
  cont: {
    backgroundColor: '#fff',
    elevation: 8,
    borderRadius: 10,
    // flex: 1,
    justifyContent: 'center',
    // alignItems:'center',
    // paddingLeft:10,
    paddingHorizontal: 10,
  },
  inp: {
    fontSize: 18,
  }
})