
import {PermissionsAndroid} from 'react-native';

exports.requestMicrophonePermission = async () => {
 try {
   const granted = await PermissionsAndroid.request(
     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
     {
       title: 'Microphone Permission',
       message: 'We need access to your microphone to record audio',
       buttonNeutral: 'Ask Me Later',
       buttonNegative: 'Cancel',
       buttonPositive: 'OK',
     },
   );
   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
     console.log('You can record audio');
   } else {
     console.log('Microphone permission denied');
   }
 } catch (err) {
   console.warn(err);
 }
};