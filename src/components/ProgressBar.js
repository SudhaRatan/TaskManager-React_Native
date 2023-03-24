import { StyleSheet } from 'react-native';
import {
  View,
  Text,
} from 'react-native';
import { MotiView } from 'moti';

const ProgressBar = ({ color, progress }) => {

  return (
    <View style={St.progressContainer}>
      <View style={[
        St.progressBar,
        { backgroundColor: color + '40' }
      ]}>
        <MotiView
          style={[
            {
              backgroundColor: color,
            },
            St.progress
          ]}
          
          animate={{
            width: progress * 160
          }}
          transition={{
            type: 'timing',
          }}
        />
        <MotiView style={[
          {
            left: 160 * progress - 3,
            transform: [{ translateY: -2 }],
            backgroundColor: color,
          },
          St.progressEnd
        ]}
          animate={{ left: 160 * progress - 3 }}
          transition={{
            type:'timing'
          }}
        />
      </View>
    </View>
  )
}

export default ProgressBar;

const St = StyleSheet.create({
  progressContainer: {
    height: 4,
    marginVertical: 10,
  },
  progressBar: {
    borderRadius: 10,
    width: 160,
    flex: 1,
  },
  progress: {
    flex: 1,
    borderRadius: 10,
  },
  progressEnd: {
    position: 'absolute',
    width: 3,
    height: 6,
    borderRadius: 1,
  },
})