import {
  View,
  Text,
  Dimensions,
  Pressable,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather'

const Header = ({ handleClick }) => {

  const { width } = Dimensions.get('window')

  return (
    <View style={St.headerContainer}>
      <Pressable onPress={handleClick} style={St.headerIcon}>
        <Ionicons name='reorder-two-outline' size={40} color="#B2B5BE" />
      </Pressable>
      <Pressable onPress={handleClick} style={St.headerIcon}>
        <Feather name='search' size={30} color="#B2B5BE" />
      </Pressable>
    </View>
  )
}

export default Header;

const St = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: '#F9FAFE',
    borderRadius: 30,
  },
  headerIcon: {
    marginHorizontal: 20,
  },
})