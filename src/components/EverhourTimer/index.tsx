import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {intervalToDuration} from 'date-fns';

const SIZE = Dimensions.get('window').width - 48;

const EverhourTimer = ({time = 0}) => {
  function formatInteger(int: number) {
    return String(int).padStart(2, '0');
  }

  const duration = intervalToDuration({start: 0, end: time ?? 0 * 1000});

  return (
    <View
      style={{
        backgroundColor: 'black',
        alignSelf: 'center',
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: 72,
          color: 'white',
          letterSpacing: 4.4,
          fontWeight: '100',
        }}>{`${formatInteger(duration.hours)}:${formatInteger(
        duration.minutes,
      )}:${formatInteger(duration.seconds)}`}</Text>
    </View>
  );
};

export default EverhourTimer;
