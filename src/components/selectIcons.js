import {
  View,
  Text,
  Pressable,
  FlatList,
  Dimensions,
  TouchableOpacity
} from "react-native"
import { Entypo } from 'react-native-vector-icons/Entypo'
import { StyleSheet } from "react-native"

const SelectIcons = ({ setIcon }) => {

  const { width } = Dimensions.get('window')

  return (
    <View>
      <FlatList style={[
        St.iconsList,
        {
          width: width * 0.8 + 40,
          height: width * 0.8 / 4 * 3,
        }
      ]}
        numColumns={4}
        data={iconNames}
        renderItem={(item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={St.iconContainer}
              onPress={() => setIcon(item.item)}
            >
              <Entypo name={item.item} size={width * 0.8 / 4 - 50} color="#000000" />
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default SelectIcons;

const St = StyleSheet.create({
  iconsList: {
    backgroundColor: '#F9FAFE',
    borderRadius: 20,
  },
  iconContainer: {
    margin: 5,
    elevation: 2,
    backgroundColor: '#F9FAFE',
    padding: 20,
    borderRadius: 10,
  },
})

const iconNames = [
  "500px-with-circle",
  "add-to-list",
  "aircraft",
  "app-store",
  "archive",
  "attachment",
  "back-in-time",
  "baidu",
  "battery",
  "beamed-note",
  "bell",
  "block",
  "book",
  "bookmarks",
  "bowl",
  "box",
  "briefcase",
  "bug",
  "cake",
  "calendar",
  "calculator",
  "camera",
  "chat",
  "cloud",
  "code",
  "compass",
  "database",
  "drink",
  "game-controller",
  "heart",
  "home",
  "laptop",
  "leaf",
  "rocket",
  "star",
  "trash",
  "video",
  "warning",
  "youtube",
]