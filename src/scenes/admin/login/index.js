import React, { useState } from 'react';
import {SafeAreaView, View, Text,TextInput} from 'react-native';
import Button from '../../../components/Button';
//import { TextInput } from '../../components/Form'
import {SCREEN_NAMES} from '../../../navigators/screenNames';
import colors from '../../../styles/colors';
import styles from './styles';
import {adminLogin} from '../../../api/api';
import Toast from 'react-native-simple-toast';

export default function Login({navigation}) {
  const [accesToken, setToken] = useState('');
  const onLogin = async () => {
    console.log(accesToken);
    var result =  await adminLogin(accesToken);
    if(result.success === true){
      navigation.navigate(SCREEN_NAMES.Admin_Home, {});
    } else {
      console.log("Invalid Access Key");
      Toast.show('Invalid Access Key');
    }
    //console.log("Success");
    console.log(result.success);
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
        <View style={styles.content}>
                  
                  <View style={styles.row}>
                    <TextInput style={styles.inputText} onChangeText={(text) => setToken(text)} placeholder='Enter Your Access Token' />
                  </View>
                  
                </View>
                <Button text={'GET ACCESS AS ADMIN'} onPress={onLogin}/>
               {/* <Button text={'Start As a Speaker'} onPress={() => {
            navigation.navigate(SCREEN_NAMES.Admin_Home, {});
          }}/> */}
                
          <Button
          text={'VIEW AS A CUSTOMER'}
          onPress={() => {
            navigation.navigate(SCREEN_NAMES.Viewer_Home, {});
          }}
        />
                
        </View>
    </SafeAreaView>
  );
}
