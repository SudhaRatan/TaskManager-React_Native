import { StyleSheet, TouchableOpacity } from 'react-native';
import {
  View,
  Text,
  Animated as Anim,
  Pressable,
} from 'react-native';
import ProgressBar from './ProgressBar';
import { Entypo } from 'react-native-vector-icons/Entypo'
import { useRef, useState, useEffect, useCallback } from 'react';
import { ToastAndroid } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { AntDesign } from 'react-native-vector-icons/AntDesign';
// import { getTaskDetails } from '../db-functions/db';
import { getTaskDetails } from '../db-functions/db-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Animated, { Layout, SlideInDown, SlideInUp, ZoomIn, ZoomOutDown } from 'react-native-reanimated';

const CategoryCard = (props) => {

  const navigation = useNavigation()
  const pressInOut = (val) => {
    Anim.spring(scale, {
      toValue: val,
      useNativeDriver: true,
    }).start()
  }

  const scale = useRef(new Anim.Value(1)).current
  const [toggle, setToggle] = useState(false)
  const [checked, setChecked] = useState(0)
  const [unchecked, setUnchecked] = useState(0)
  const [total, setTotal] = useState(0)

  const hideOptions = () => setToggle(false)

  const getTD = async () => {
    const res = await getTaskDetails(props.id);
    if (res.progress) setTotal(res.progress)
    else setTotal(0)
    setChecked(res.checked)
    setUnchecked(res.unchecked)
  }

  useEffect(() => {
    getTD()
  }, [props.change])

  useFocusEffect(useCallback(() => {
    getTD()
  }, [props.change]))

  // console.log(props)

  return (
    <Animated.View
    entering={SlideInDown.springify().damping(16).delay(props.index * 50)}
    exiting={ZoomOutDown}
    layout={Layout}
    >
      <Pressable
        onPressIn={() => pressInOut(0.92)}
        onPressOut={() => pressInOut(1)}
        onLongPress={() => setToggle(true)}
        onPress={() => {
          navigation.navigate('Category', {
            id:props.id,
            color: props.iconColor,
            name: props.name,
          })
        }}
      >
        <Anim.View style={{ transform: [{ scale }] }}>
          <View style={St.categoryContainer}>
            <AnimatePresence>
              {toggle && <Options {...props} hideOptions={hideOptions} />}
              {!toggle && <Main {...props} checked={checked} unchecked={unchecked} total={total} />}
            </AnimatePresence>
          </View>
        </Anim.View>
      </Pressable>
    </Animated.View>
  )
}

const Main = ({ id, name, iconName, iconColor, checked, unchecked, total }) => {
  return (
    <MotiView
      from={{ translateX: -20, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      exit={{ translateX: 20, opacity: 1 }}
      transition={{
        type: 'timing'
      }}
      style={{ flex: 1 }}
    >
      <View style={St.taskIconName}>
        <Text style={St.numTasks}>
          {
            `${checked + unchecked} Tasks`
          }
        </Text>
        <Entypo name={iconName} size={24} color={iconColor} />
      </View>
      <Text style={St.categoryName}>{name}</Text>
      <View>
        <ProgressBar progress={total} color={iconColor} />
      </View>
    </MotiView>
  )
}

const Options = ({ id, iconColor, hideOptions, deleteCategory }) => {
  return (
    <MotiView
      style={St.optionCont}
      from={{ translateX: 20, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      exit={{ translateX: -20, opacity: 1 }}
      transition={{
        type: 'timing'
      }}
    >
      <TouchableOpacity style={[St.iconCont, { borderColor: iconColor }]} onPress={hideOptions}>
        <AntDesign name="back" size={38} color={iconColor} />
      </TouchableOpacity>
      <TouchableOpacity style={[St.iconCont, { borderColor: iconColor }]} onPress={() => deleteCategory(id)}>
        <AntDesign name="delete" size={38} color={iconColor} />
      </TouchableOpacity>
    </MotiView>
  )
}

export default CategoryCard;

const St = StyleSheet.create({
  categoryContainer: {
    backgroundColor: '#fff',
    height: 120,
    width: 200,
    margin: 10,
    elevation: 4,
    borderRadius: 24,
    padding: 20,
  },
  optionCont: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  iconCont: {
    backgroundColor: '#fff',
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  numTasks: {
    color: '#A7A7B7',
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 500,
    color: '#292C38',
    flex: 1,
  },
  taskIconName: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})