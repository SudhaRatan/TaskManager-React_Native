import {
  View,
  Text,
  Pressable,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { Entypo } from 'react-native-vector-icons/Entypo'
import { useState, useEffect } from "react"
// import { getCategories } from "../db-functions/db"
import { SelectCategories as SC } from "../db-functions/db-sqlite"

const SelectCategories = ({ setCat }) => {

  const { width } = Dimensions.get('window')
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
      {
        categories &&
        <FlatList
          style={[
            St.iconsList,
            {
              width: width * 0.8,
              height: width * 0.8 / 4 * 3,
            }
          ]}
          data={categories}
          renderItem={({ item, index }) => {
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
          }}
        />
      }
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
