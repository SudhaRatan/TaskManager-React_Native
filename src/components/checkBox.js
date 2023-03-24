import { Pressable } from 'react-native';
import { MotiView } from 'moti';
import { StyleSheet } from 'react-native';

const CheckBox = ({ handleCheck, color }) => {

  return (
    <Pressable onPress={handleCheck}>
      <MotiView style={[
        St.checkboxCont,
        { borderColor: color }
      ]}
        from={{
          scale: 0.3
        }}
        animate={{
          scale: 1
        }}
        exit={{
          scale: 0.4,
        }}
      />
    </Pressable>
  )
}

export default CheckBox;

const St = StyleSheet.create({
  checkboxCont: {
    height: 25,
    width: 25,
    borderRadius: 25,
    backgroundColor: '#000fff00',
    marginRight: 10,
    borderWidth: 2,
  }
})