import { Pressable } from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CheckBox1 = ({ handleCheck, color }) => {


  return (
    <Pressable onPress={handleCheck}>
      <MotiView style={{
        backgroundColor: '#000fff00',
        marginRight: 10,
        width:25
      }}
        from={{
          scale: 0.3
        }}
        animate={{
          scale: 1
        }}
        exit={{
          scale: 0.4,
        }}
      >
        <MaterialIcons name="check-circle" size={25} color={color} />
      </MotiView>

    </Pressable>
  )
}

export default CheckBox1;