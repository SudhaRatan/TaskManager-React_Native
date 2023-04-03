import { Pressable, StyleSheet } from 'react-native';
import {
  View,
  Text,
  Dimensions,
  Animated,
  ActivityIndicator,
  ToastAndroid,
  // TouchableOpacity
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import CircularProgressBase from 'react-native-circular-progress-indicator';
import { useRef, useState, useEffect } from 'react';
import { getTaskDetails } from '../db-functions/db-sqlite';
import TaskCard from '../components/TaskCard';
import TaskCardScheduled from '../components/TaskCardScheduled';
import AddTask from '../components/addTaskInp';

import {
  SelectTasks,
  deleteTask,
  insertTask,
  SelectScheduledTasks,
} from '../db-functions/db-sqlite';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { cancelNotification } from '../notifications/notifications';

const Category = ({ route, navigation }) => {

  const [tasks, setTasks] = useState(null)
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [scheduledTasks, setScheduledTasks] = useState(null)
  const [loadingSTasks, setLoadingSTasks] = useState(true)
  const [change, setChange] = useState(false)
  const [progress, setProgress] = useState(0)
  const [newTask, setNewTask] = useState('')

  const handleInput = (e) => {
    setNewTask(e)
  }

  const changeState = () => {
    setChange(!change)

  }

  const getTasks = () => {
    SelectTasks(route.params.id)
      .then(res => {
        setTasks(res)
        setLoadingTasks(false)
      })
      .catch(err => {
        setTasks(null)
        setLoadingTasks(false)
      })
  }

  const getScheduledTasks = () => {
    SelectScheduledTasks(route.params.id)
      .then(res => {
        setScheduledTasks(res)
        setLoadingSTasks(false)
      })
      .catch(err => {
        setScheduledTasks(null)
        setLoadingSTasks(false)
      })
  }

  const getTD = async () => {
    const res = await getTaskDetails(route.params.id);
    if (res.progress) setProgress(res.progress)
    else setProgress(0)
  }

  useEffect(() => {
    getTD()
    getTasks();
    getScheduledTasks();
  }, [change])

  const handleDelete = async (id) => {
    setTasks(tasks.filter(task => task.id !== id))
    try {
      await deleteTask(id)
      changeState()
      getTD()
    } catch (error) {
      console.log(error)
      ToastAndroid("Error occured", 1000)
    }
  }

  const handleDeleteST = async (id) => {
    setScheduledTasks(scheduledTasks.filter(task => task.id !== id))
    try {
      await deleteTask(id)
      changeState()
      cancelNotification(id)
      getTD()
    } catch (error) {
      console.log(error)
      ToastAndroid("Error occured", 1000)
    }
  }

  const val = useRef(new Animated.Value(0)).current
  const minHeaderHeight = 150

  const { height, width } = Dimensions.get('window')

  const addButtonHeight = Math.floor(width < height ? height * 0.08 : width * 0.08)

  const AddTaskFunc = async () => {
    if (newTask !== "") {
      insertTask(newTask, route.params.id, false, false)
        .then(res => {
          setNewTask('')
          ToastAndroid.show(res.message, 1000)
          changeState()
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      ToastAndroid.show("Enter a task", 500)
    }
  }

  return (
    <View style={{ backgroundColor: '#F9FAFE', flex: 1 }}>
      <View style={{
        backgroundColor: '#F9FAFE'
      }} />
      <Pressable
        style={St.backCont(route.params.color)}
        onPress={() => navigation.navigate('Home')}
      >
        <Entypo name='chevron-left' size={40} color={'#00000090'} />
      </Pressable>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: val } } }],
          { useNativeDriver: true },
        )}
      >
        <Animated.View style={[
          St.Header,
          {
            height: minHeaderHeight,
            transform: [{
              translateY: val.interpolate({
                inputRange: [0, minHeaderHeight],
                outputRange: [0, minHeaderHeight],
                extrapolate: 'clamp'
              })
            }],
          }
        ]}>
          <Animated.View style={[
            {
              transform: [{
                translateY: val.interpolate({
                  inputRange: [0, minHeaderHeight],
                  outputRange: [0, -minHeaderHeight / 2],
                  extrapolate: 'clamp'
                })
              }],
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
            }
          ]}>
            <View style={St.CatCont}>
              <View style={St.titleCont}>
                <Text style={St.title}>{route.params.name}</Text>
              </View>
              <View style={St.progressCont}>
                <CircularProgressBase
                  radius={24}
                  value={progress * 100}
                  inActiveStrokeOpacity={0.4}
                  progressValueColor={'#00000000'}
                  activeStrokeColor={route.params.color}
                  // delay={100}
                  duration={600}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddTask', {
                name: route.params.name,
                color: route.params.color,
                iconName: route.params.iconName,
                id: route.params.id,
              })}
              activeOpacity={0.5}
              style={[
                St.scheduleTask,
                {
                  width: width - 40,
                  backgroundColor: route.params.color,
                }
              ]}>
              <View>
                <Text
                  style={{
                    color: '#F9FAFE',
                    fontSize: 16,
                  }}
                >
                  Schedule a task
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        <View style={{ backgroundColor: '#F9FAFE', paddingHorizontal: 20 }}>
          {
            loadingSTasks
              ?
              <View style={St.loadingSt}>
                <ActivityIndicator size="large" color={route.params.color} />
              </View>
              :
              scheduledTasks
                ?
                <View>
                  <Text style={{
                    color: '#000',
                    fontSize: 18,
                  }}>Scheduled tasks</Text>
                  {
                    scheduledTasks.map((item, index) => {
                      return (
                        <TaskCardScheduled key={item.id} index={index} handleDelete={handleDeleteST} {...item}
                          change={change}
                          changeState={changeState}
                        />
                      )
                    })
                  }
                </View>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',marginVertical:10,padding:10,borderWidth:1,borderColor:route.params.color,borderRadius:50}}>
                  <Text style={St.categoriesText}>Schedule Tasks to display here</Text>
                </View>
          }
          {
            loadingTasks
              ?
              <View style={St.loadingSt}>
                <ActivityIndicator size="large" color={route.params.color} />
              </View>
              :
              tasks
                ?
                <View>
                  <Text style={{
                    color: '#000',
                    fontSize: 18,
                  }}>Other tasks</Text>
                  {
                    tasks.map((item, index) => {
                      return (
                        <TaskCard key={item.id} index={index} handleDelete={handleDelete} {...item}
                          change={change}
                          changeState={changeState}
                        />
                      )
                    })
                  }
                  <View style={{ height: addButtonHeight }} />
                </View>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',marginVertical:10,padding:10,borderWidth:1,borderColor:route.params.color,borderRadius:50}}>
                  <Text style={St.categoriesText}>Add Tasks to display here</Text>
                </View>
          }
        </View>
      </Animated.ScrollView>
      <Animated.View style={[
        {
          transform: [{
            translateY: val.interpolate({
              inputRange: [0, minHeaderHeight / 2],
              outputRange: [0, addButtonHeight * 2],
              extrapolate: 'clamp'
            })
          }],
        }
      ]}>
        <AddTask name={newTask} AddTaskFunc={AddTaskFunc} handleInput={handleInput} />
      </Animated.View>
    </View>
  )
}

export default Category;

const St = StyleSheet.create({
  Header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFE',
  },
  title: {
    fontSize: 34,
    fontWeight: 600,
    color: '#000'
  },
  backCont: iconColor => ({
    paddingLeft: 15,
    paddingRight: 5,
    backgroundColor: '#F9FAFE',
  }),
  categoriesText:{
    color:'#000',
  },
  CatCont: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  scheduleTask: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    elevation: 12,
    borderRadius: 20
  },
  loadingSt:{
    marginTop:50,
  },
})