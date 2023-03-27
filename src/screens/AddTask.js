import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  Pressable,
  Animated,
  StyleSheet,
  ToastAndroid,
  ScrollView,
  Modal
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import SelectCategories from '../components/selectCategories';
import { AnimatePresence } from 'moti';
import CheckBox from '../components/checkBox';
import CheckBox1 from '../components/checkBox1';
import { insertTask } from '../db-functions/db-sqlite';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const AddTask = ({ route }) => {
  const [name, setName] = useState('')
  const [catId, setId] = useState(null)
  const [iconColor, setIconColor] = useState("#000000")
  const [iconName, setIconName] = useState("chevron-down")
  const [categoryName, setCategoryName] = useState('Select a category')
  const { width, height } = Dimensions.get('window')
  const navigation = useNavigation()
  const [toggle, setToggle] = useState(false)
  const [toggle1, setToggle1] = useState(false)
  const scale = useRef(new Animated.Value(0)).current
  const iconContScale = useRef(new Animated.Value(0)).current
  const [showModal, setShowModal] = useState(false)
  const [check, setCheck] = useState(false)
  const [check1, setCheck1] = useState(false)
  const [showModal1, setShowModal1] = useState(false)

  const [dateTime, setDateTime] = useState(new Date());

  const closeModal = () => {
    setShowModal(false)
  }

  const iconAnimation = () => {
    setShowModal(!showModal)
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

  const setParams = () => {
    if (route.params) {
      setCategoryName(route.params.name)
      setIconColor(route.params.color)
      setIconName(route.params.iconName)
      setId(route.params.id)
    }
  }

  useEffect(() => {
    setParams()
  }, [])

  const setCat = (item) => {
    setIconName(item.iconName)
    setCategoryName(item.name)
    setIconColor(item.iconColor)
    setId(item.id)
    setShowModal(false)
    Animated.spring(iconContScale, {
      toValue: 0,
      useNativeDriver: true
    }).start()
    setToggle1(!toggle1)
  }

  const AddTaskFunc = () => {
    if (name !== "") {
      if (catId !== null) {
        insertTask(name, catId)
          .then(({ stat, message }) => {
            navigation.navigate('Home')
            ToastAndroid.show(message, 2000)
          })
          .catch(err => {

          })
      } else ToastAndroid.show("Select a category", 1000)
    } else ToastAndroid.show('Enter task', 1000)

  }

  const onChangeDate = (event, selectedDate) => {
    const da = new Date(selectedDate)
    console.log(da.toISOString())
    setDateTime(da)
    DateTimePickerAndroid.open({
      value: dateTime,
      onChange: onChangeTime,
      mode: "time",
      is24Hour: true,
    });
  };

  const onChangeTime = (event,selectedTime) => {
    console.log(event,selectedTime)
    const da = new Date(selectedTime)
    // console.log(da.toTimeString())
    const dada = dateTime.toISOString()
    console.log(dateTime)
    const dat = `${dada.getFullYear()}-${dada.getUTCMonth()}-${dada.getDate()}T${da.toTimeString().slice(0,8)}`
    console.log(dat)
  }

  const handleCheck = (type) => {
    if (type === 'schedule') {
      if (!check) {
        DateTimePickerAndroid.open({
          value: dateTime,
          onChange:onChangeDate,
          mode: "date",
          is24Hour: true,
        });
      }
      setCheck1(false)
      setCheck(!check)
    } else {
      setCheck(false)
      setCheck1(!check1)
    }
  }

  return (
    <>
      <Modal
        visible={showModal}
        transparent={false}
        animationType="fade"
        style={{
          flex: 1
        }}>
        <SelectCategories setCat={setCat} closeModal={closeModal} />
      </Modal>
      <View
        style={St.container}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={St.closeButton}
        >
          <Ionicons name="ios-close-circle-outline" size={60} color="#00000090" />
        </Pressable>
        <View style={[St.mainContainer,
        {
          marginTop: height / 4,
        }
        ]}>
          <View style={St.form}>
            {/* Add new task */}
            <TextInput
              style={[St.enterCategory, { width: width * 0.75, }]}
              placeholder='Enter new task'
              placeholderTextColor="#7B7998"
              value={name}
              onChangeText={(value) => {
                setName(value)
              }}
            />
            {/* Select a category */}
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
                        borderRadius: width * 0.75 * 0.6,
                        gap: 5,
                      },
                      St.chooseIconsContainer
                    ]}
                  >
                    <Text style={St.selIconText}>{categoryName}</Text>
                    <Entypo name={iconName} size={24} color={iconColor} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Option to set a scheduled task */}
            <View
              style={[
                {
                  width: width * 0.75 * 0.6,
                  gap: 20,
                },
                St.chooseIconsButton
              ]}
            >
              <TouchableOpacity
                onPress={() => handleCheck('schedule')}
                style={[
                  {
                    borderRadius: width * 0.75 * 0.6,
                    gap: 0,
                  },
                  St.chooseIconsContainer
                ]}
              >
                <AnimatePresence>
                  {!check && <CheckBox color={iconColor} handleCheck={() => handleCheck('schedule')} />}
                  {check && <CheckBox1 color={iconColor} handleCheck={() => handleCheck('schedule')} />}
                </AnimatePresence>
                <Text style={{ color: '#000', fontSize: 20 }}>Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCheck('repeat')}
                style={[
                  {
                    borderRadius: width * 0.75 * 0.6,
                    gap: 0,
                  },
                  St.chooseIconsContainer
                ]}
              >
                <AnimatePresence>
                  {!check1 && <CheckBox color={iconColor} handleCheck={() => handleCheck('repeat')} />}
                  {check1 && <CheckBox1 color={iconColor} handleCheck={() => handleCheck('repeat')} />}
                </AnimatePresence>
                <Text style={{ color: '#000', fontSize: 20 }}>Repeat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Animated.View style={{
        transform: [
          {
            translateY: iconContScale.interpolate({
              inputRange: [0, 1],
              outputRange: [0, width]
            })
          }
        ],
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: 25,
      }}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={St.addCatButton}
          onPress={AddTaskFunc}
        >
          <Text style={St.addCatButtonText}>Add Task</Text>
          <Octicons name="tasklist" size={16} color="#F9FAFE" />
        </TouchableOpacity>
      </Animated.View>
    </>
  )
}

export default AddTask;

export const St = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFE',
  },
  closeButton: {
    position: 'absolute',
    zIndex: 3,
    top: 0,
    right: 0,
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
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
    fontSize: 24,
    color: '#222222'
  },
  chooseIconsButton: {
    flexDirection: 'row',
  },
  chooseIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#7B7998',
  },
  selIconText: {
    fontSize: 18,
    color: "#222222",
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
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
