import {
  ScrollView,
  View,
  Text,
  Pressable,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import Entypo from 'react-native-vector-icons/Entypo'
import { useState, useEffect } from "react"
// import { getCategories } from "../db-functions/db"
import { SelectCategories as SC } from "../db-functions/db-sqlite"

const SelectCategories = ({ setCat,closeModal }) => {

  const { width, height } = Dimensions.get('window')
  const [categories, setCategories] = useState(null)
  const [catName, setCatname] = useState(null)

  useEffect(() => {
    get();
  }, [])

  const get = async () => {
    const res = await SC()
    if (res.stat) setCategories(res.res)
    else setCategories(null)
  }

  return (
    <View>

      <View style={{
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000000',
        gap: 10,
      }}>
        <Pressable onPress={() => {
          closeModal()
        }} style={{
          position: 'absolute',
          top: 0,
          right: 0,
          margin: 20,
        }}>
          <Entypo name="circle-with-cross" size={50} color='#000' />
        </Pressable>
        <View>
          <Text style={{
            fontSize: 24,
            color: '#000'
          }}>Select a category</Text>
        </View>
        <View style={{
          height: width * 0.8,
        }}>
          <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            St.iconsList,
            {
              width: width * 0.8,
            }
          ]}>
            {
              categories &&

              categories.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={St.iconContainer}
                    onPress={() => { setCat(item) }}
                  >
                    <Text style={{
                      fontSize: 18,
                      color: item.iconColor,
                    }}>{item.name}</Text>
                    <Entypo name={item.iconName} size={40} color={item.iconColor} />
                  </TouchableOpacity>
                )
              })
            }
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

export default SelectCategories;

const St = StyleSheet.create({
  iconsList: {
    backgroundColor: '#F9FAFE',
    borderRadius: 20,
  },
  iconContainer: {
    marginVertical: 5,
    marginHorizontal: 2,
    elevation: 2,
    backgroundColor: '#F9FAFE',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
