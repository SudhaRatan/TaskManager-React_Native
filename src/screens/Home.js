import {
  View,
  Text,
  Animated as Anim,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useCallback, useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import TaskCard from '../components/TaskCard';
import Add from '../components/Add';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { ToastAndroid } from 'react-native';
import { createChannel } from '../notifications/notifications';

import {
  CreateCategoriesTable,
  CreateTasksTable,
  SelectCategories,
  SelectLatestTasks,
  dropCategories,
  dropTasks,
  deleteCategory,
  deleteTask,
}
  from '../db-functions/db-sqlite'

const Home = ({ navigation }) => {

  const delCat = () => {
    dropCategories()
      .then(res => console.log(res))
      .catch(err => console.log(err))
    dropTasks()
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  const getCategories = () => {
    // setLoading(false)
    SelectCategories().then(({ stat, res, len }) => {
      if (len > 0) {
        setCategories(res)
      }
      setLoading(false)
    }).catch(err => {
      setCategories(null)
      setLoading(false)
    })
  }

  const getTasks = () => {
    SelectLatestTasks()
      .then(({ stat, res }) => {
        // console.log(res)
        setTasks(res)
        setLoadingTasks(false)
      })
      .catch(err => {
        setLoadingTasks(false)  
        setTasks(null)
      })
  }

  const isDrawerOpen = useDrawerStatus() === 'open';

  useEffect(() => {
    drawerAnim();
    // delCat();
    CreateCategoriesTable();
    CreateTasksTable();
    getCategories();
    getTasks();
    createChannel();
  }, [isDrawerOpen]);

  useFocusEffect(useCallback(() => {
    getCategories();
    getTasks();
  }, []))

  const [tasks, setTasks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [categories, setCategories] = useState(null)
  const [change, setChange] = useState(false)

  const changeState = () => {
    setChange(!change)
  }

  const enableTaskButton = () => {
    if (categories === null) return false
    else return true
  }

  const drawerAnim = () => {
    if (!isDrawerOpen) {
      Anim.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start()
    } else {
      Anim.spring(scale, {
        toValue: 0.85,
        useNativeDriver: true,
      }).start()
    }
  }

  const handleToggle = () => {
    navigation.toggleDrawer()
    Anim.spring(scale, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start()
  }

  const scale = useRef(new Anim.Value(1)).current

  const { height, width } = Dimensions.get('window')
  const addButtonHeight = Math.floor(width < height ? height * 0.075 : width * 0.075)

  const handleDelete = async (id) => {
    setTasks(tasks.filter(task => task.id !== id))
    deleteTask(id)
      .then(() => {
        changeState()
      })
      .catch(() => {
        ToastAndroid("Error occured", 1000)
      })
  }

  const deleteCategoryById = async (id) => {
    await deleteCategory(id)
    getCategories();
    getTasks();
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#111E53', height: height, }} >
      <Anim.ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        style={[St.content, {
          transform: [{ scale }],
          borderRadius: scale.interpolate({
            inputRange: [0.9, 1],
            outputRange: [15, 0],
          }),
        }]}>
        <Header handleClick={handleToggle} />
        <View style={[
          St.container,
        ]}>
          {/* Greeting */}
          <View>
            <Text style={St.greeting}>What's up, Rohit!</Text>
          </View>
          {/* Categories */}
          <View
            style={St.categoriesContainer}>
            <Text style={St.categoriesText}>CATEGORIES</Text>
            <View style={[
              St.catListCont,
              { width: width - 40 }
            ]}>
              {
                loading
                  ?
                  <View style={St.loadingSt}>
                    <ActivityIndicator size="large" />
                  </View>
                  :
                  categories
                    ?
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {
                        categories.map((item, index) => {
                          return (
                            <CategoryCard key={item.id} {...item} index={index} deleteCategory={deleteCategoryById} change={change} changeState={changeState} />
                          )
                        })
                      }
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={St.categoriesText}>Add Categories to display here</Text>
                    </View>
              }

            </View>
          </View>
          {/* Todays tasks */}
          <View
            style={[St.taskContainer, { width: width - 40 }]}>
            <Text style={St.taskText}>RECENTLY ADDED TASKS</Text>
            <View>
              {
                loadingTasks
                  ?
                  <View style={St.loadingSt}>
                    <ActivityIndicator size="large" />
                  </View>
                  :
                  tasks
                    ?
                    <View>
                      {
                      tasks.map((item, index) => {
                          return (
                            <TaskCard key={item.id} index={index} handleDelete={handleDelete} {...item} change={change} changeState={changeState} />
                          )
                        })
                      }
                      <View style={{ height: addButtonHeight }} />
                    </View>
                    :

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                      <Text style={St.categoriesText}>Add Tasks to display here</Text>
                    </View>
              }
            </View>
          </View>
        </View>
      </Anim.ScrollView>
      <Add enableTaskButton={enableTaskButton} />
    </View>
  )
}

export default Home;

const St = StyleSheet.create({
  content: {
    backgroundColor: '#F9FAFE',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 34,
    marginBottom: 40,
    color: '#242946',
    fontWeight: 800,
  },
  categoriesContainer: {
    marginBottom: 10,
  },
  categoriesText: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 10,
    color: '#C5C5D2'
  },
  catListCont: {
    height: 150,
  },
  taskContainer: {
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 10,
    color: '#C5C5D2',
  },
  loadingSt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})