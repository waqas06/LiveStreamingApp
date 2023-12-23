import React,{useState} from 'react';
import {RTCView, mediaDevices} from '@videosdk.live/react-native-sdk';
import {SafeAreaView, View, Text,TextInput} from 'react-native';
import Button from '../../../components/Button';
import {useFocusEffect} from '@react-navigation/native';
//import { TextInput } from '../../components/Form'
import {SCREEN_NAMES} from '../../../navigators/screenNames';
import {createMeeting, getToken} from '../../../api/api';
import colors from '../../../styles/colors';
import styles from './styles';

export default function Admin_Home({navigation}) {
  const [tracks, setTrack] = useState('');
  const [micOn, setMicon] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [name, setName] = useState('admin');
  const [meetingId, setMeetingId] = useState('');
  const [token, setToken] = useState('');
  
  React.useEffect(async () => {
    
    const token = await getToken();
    setToken(token);
    const _meetingId = await createMeeting({token});
    setMeetingId(_meetingId);
  }, [navigation]);
  useFocusEffect(
    React.useCallback(() => {
      mediaDevices
        .getUserMedia({audio: false, video: true})
        .then(stream => {
          setTrack(stream);
        })
        .catch(e => {
          console.log(e);
        });
    }, []),
  );
  const disposeVideoTrack = () => {
    setTrack(stream => {
      stream.getTracks().forEach(track => {
        track.enabled = false;
        return track;
      });
    });
  };

  const naviagateToSpeaker = () => {
    disposeVideoTrack();
    navigation.navigate(SCREEN_NAMES.Meeting, {
      name: name.trim(),
      token: token,
      meetingId: meetingId,
      micEnabled: micOn,
      webcamEnabled: videoOn,
      mode: 'CONFERENCE',
    });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.primary['200'],
      }}>
      <View
        style={{
          flex: 1,
          marginHorizontal: 22,
          justifyContent: 'center',
        }}>

                <Button text={'INITIATE LIVE SESSION'}  onPress={() => naviagateToSpeaker()}/>
                <Button text={'MANAGE LIVE SESSION'} onPress={() => {
            navigation.navigate(SCREEN_NAMES.Product, {});
          }}/>
                
                
        </View>
    </SafeAreaView>
  );
}
