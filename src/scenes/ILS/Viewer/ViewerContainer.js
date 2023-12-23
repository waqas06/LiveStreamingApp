import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ImageBackground
} from 'react-native';
import Video from 'react-native-video';
import ChatViewer from '../Components/ChatViewer';
import {Cancel, HourGlass, Stop} from '../../../assets/icons';
import {useOrientation} from '../../../utils/useOrientation';
import colors from '../../../styles/colors';
import {convertRFValue} from '../../../styles/spacing';
import {usePubSub, useMeeting} from '@videosdk.live/react-native-sdk';
import ControlsOverlay from './ControlsOverlay';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_NAMES} from '../../../navigators/screenNames';
import {fetchProducts,fetchProductDetails} from '../../../api/api';

export default function ViewerContainer({
  localParticipantId,
  setlocalParticipantMode,
}) {

  const navigation = useNavigation();
  const {changeMode, leave, hlsState, hlsUrls} = useMeeting();
  const deviceOrientation = useOrientation();
  const [progress, setProgrss] = useState(0);
  const [playableDuration, setplayableDuration] = useState(0);
  const [list, setList] = useState([]);
  const [isChatVisible, setisChatVisible] = useState(false);
  const [pause, setPause] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [productTitle, setproductTitle] = useState('');
  const [productDescription, setproductDescription] = useState('');
  const [productPrice, setproductPrice] = useState('');
  const [productStock, setproductStock] = useState('');
  const [productImage, setproductImage] = useState('');

  const videoPlayer = useRef(null);
   useEffect(() => {
    console.log("USE EFFECT CALLED ---- ");
    async function fetchData() {
      try{
       // setPageNumber(0);
        let result = await fetchProducts();
        console.log("==================");
        console.log(result);
        console.log("==================");
        setList(result.products);
       
      } catch (error) {
        console.log("***** Error in Fetch call = "+error.message);
      }
    }
    fetchData();
  }, []);


  const seekTo = sec => {
    videoPlayer &&
      videoPlayer.current &&
      typeof videoPlayer.current.seek === 'function' &&
      videoPlayer.current.seek(sec);
  };

  usePubSub(`CHANGE_MODE_${localParticipantId}`, {
    onMessageReceived: data => {
      const {message, senderName} = data;
      if (message.mode === 'CONFERENCE') {
        showAlert(senderName);
      }
    },
  });

  const showAlert = senderName => {
    Alert.alert(
      'Permission',
      `${senderName} has requested you to join as a speaker`,
      [
        {
          text: 'Reject',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () => {
            changeMode('CONFERENCE');
            setlocalParticipantMode('CONFERENCE');
          },
        },
      ],
    );
  };
  const ItemView = ({ item }) => {
    let image = {uri:'https://cdn.shopify.com/s/files/1/0711/5322/1898/files/1.jpg?v=1700576012'};
    if(item.image != null){
       image = {uri: item.image.src};
    }
    
    return (
      
      // Single Comes here which will be repeatative for the FlatListItems
      <TouchableOpacity onPress={() => getItem(item)} style={{
        backgroundColor: '#ffff',
        padding: 5,
        marginVertical: 8,
        marginHorizontal: 17,
        
      }}>
        <ImageBackground source={image} style={styles.imageWishlist} imageStyle={{ borderRadius: 1 }}>
     
    </ImageBackground>
        <Text style={ {fontSize: 15,fontWeight: 'bold',}}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };
  const getItem = (item) => {
    //Function for click on an item
    console.log(item.id);
    async function fetchProductData() {
      let result = await fetchProductDetails(item.id);
      console.log("==================");
      console.log(result);
     
      console.log(result.product);
      console.log("==================");
      setproductTitle(result.product.title);
      setproductDescription(result.product.body_html);
      setproductPrice(result.product.variants[0].price);
      setproductStock(result.product.variants[0].inventory_quantity);
      setModalVisible(true);
    }
    fetchProductData();
      
    
    
   //alert('Id : ' + item.id + ' Value : ' + item.title);
  };
  

  const LandscapeView = () => {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#2B3034',
          flexDirection: 'row',
        }}>
           <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal closed.');
            setModalVisible(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Title : {productTitle}</Text>
              <Text style={styles.modalText}>Description : {productDescription} </Text>
              <Text style={styles.modalText}>Price : {productPrice}</Text>
              <Text style={styles.modalText}>Stock : {productStock}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Add to Cart</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <View style={{flex: 1}}>
          <Video
            ref={videoPlayer}
            source={{
              uri: hlsUrls.downstreamUrl,
            }} // Can be a URL or a local file.
            style={{
              flex: 0.8,
              backgroundColor: 'black',
            }}
            onError={e => console.log('error', e)}
            paused={pause}
            onProgress={({currentTime, playableDuration}) => {
              setProgrss(currentTime);
              setplayableDuration(playableDuration);
            }}
            onLoad={data => {
              const {duration} = data;
              setplayableDuration(duration);
            }}
          />
          <ControlsOverlay
            playableDuration={playableDuration}
            setPause={setPause}
            pause={pause}
            progress={progress}
            seekTo={sec => {
              seekTo(sec);
            }}
            isChatVisible={isChatVisible}
            setisChatVisible={setisChatVisible}
          />
           <FlatList
        data={list}
        renderItem={ItemView}
        style={{
          flex: 0.2,
          backgroundColor: 'black',
        }}
        keyExtractor={item => item.id}
        extraData={selectedId}
        horizontal={true}
      />
        </View>
        {isChatVisible ? (
          <View style={{flex: 0.8}}>
            <ChatViewer raiseHandVisible={false} />
          </View>
        ) : null}
      </SafeAreaView>
    );
  };

  const PortraitView = () => {
     
    
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#2B3034',
        }}>
          <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal closed.');
            setModalVisible(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Title : {productTitle}</Text>
              <Text style={styles.modalText}>Description : {productDescription} </Text>
              <Text style={styles.modalText}>Price : {productPrice}</Text>
              <Text style={styles.modalText}>Stock : {productStock}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Add to Cart</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <View
          style={{
            flex: 0.5,
          }}>
          <Video
            ref={videoPlayer}
            fullscreen = {true}
            source={{
              uri: hlsUrls.downstreamUrl,
            }} // Can be a URL or a local file.
            style={{
              flex: 1,
              backgroundColor: 'black',
            }}
            // controls
            onError={e => console.log('error agaya', hlsUrls.downstreamUrl)}
            
            paused={pause}
            onProgress={({currentTime, playableDuration}) => {
              setProgrss(currentTime);
              setplayableDuration(playableDuration);
            }}
            onLoad={data => {
              const {duration} = data;
              setplayableDuration(duration);
            }}
          />
          <ControlsOverlay
            playableDuration={playableDuration}
            setPause={setPause}
            pause={pause}
            progress={progress}
            seekTo={sec => {
              seekTo(sec);
            }}
          />
          
          
       
        
        </View>
        <View style={{
            flex: 0.2,
            backgroundColor:'black',
          }}>
      <FlatList
        data={list}
        renderItem={ItemView}
        keyExtractor={item => item.id}
        extraData={selectedId}
        horizontal={true}
      />
    </View>
    <View style={{
            flex: 0.3,
            backgroundColor:'black',
          }}>
        <ChatViewer raiseHandVisible={true} />
          </View>
        
        
      </SafeAreaView>
    );
  };

  const WaitingScreen = () => {
    return (
      <SafeAreaView
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: colors.primary[900],
        }}>
        <HourGlass />
        <Text
          style={{
            fontSize: convertRFValue(18),
            color: colors.primary[100],
            fontWeight: 'bold',
            marginTop: 12,
          }}>
          Waiting for speaker
        </Text>
        <Text
          style={{
            fontSize: convertRFValue(18),
            color: colors.primary[100],
            fontWeight: 'bold',
          }}>
          to start the live streaming
        </Text>
        <TouchableOpacity
          onPress={() => {
            leave();
            navigation.navigate(SCREEN_NAMES.Login, {});
          }}
          style={{
            height: 30,
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 4,
            position: 'absolute',
            top: 12,
            left: 12,
          }}>
          <Cancel />
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  const StopLiveStreamScreen = () => {
    return (
      <SafeAreaView
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: colors.primary[900],
        }}>
        <Stop />
        <Text
          style={{
            fontSize: convertRFValue(18),
            color: colors.primary[100],
            fontWeight: 'bold',
            marginTop: 12,
          }}>
          Host has stopped
        </Text>
        <Text
          style={{
            fontSize: convertRFValue(18),
            color: colors.primary[100],
            fontWeight: 'bold',
          }}>
          the live streaming
        </Text>
        <TouchableOpacity
          onPress={() => {
            leave();
            navigation.navigate(SCREEN_NAMES.Login, {});
          }}
          style={{
            height: 30,
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 4,
            position: 'absolute',
            top: 12,
            left: 12,
          }}>
          <Cancel />
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? undefined : 'padding'}
      keyboardVerticalOffset={-1}
      style={{
        flex: 1,
        backgroundColor: '#2B3034',
        flexDirection: deviceOrientation === 'PORTRAIT' ? 'column' : 'row',
      }}>
      {hlsState == 'HLS_PLAYABLE' ? (
        deviceOrientation === 'PORTRAIT' ? (
          PortraitView()
        ) : (
          LandscapeView()
        )
      ) : (
        <WaitingScreen />
      )}
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  imageWishlist: {
    height:80,
    width:110,
    borderRadius: 1,
  }
});