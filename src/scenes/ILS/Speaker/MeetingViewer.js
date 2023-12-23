import React, {useEffect, useRef, useState, useMemo} from 'react';
import {
  View,
  Text,
  Clipboard,
  TouchableOpacity,
  Platform,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ImageBackground,
  StyleSheet
} from 'react-native';
import {useMeeting, usePubSub} from '@videosdk.live/react-native-sdk';
import {
  CallEnd,
  Chat,
  Copy,
  EndForAll,
  Leave,
  MicOff,
  MicOn,
  Participants,
  ScreenShare,
  VideoOff,
  VideoOn,
} from '../../../assets/icons';
import colors from '../../../styles/colors';
import IconContainer from '../../../components/IconContainer';
import LocalParticipantPresenter from '../Components/LocalParticipantPresenter';
import Menu from '../../../components/Menu';
import MenuItem from '../Components/MenuItem';
import BottomSheet from '../../../components/BottomSheet';
import ParticipantListViewer from '../Components/ParticipantListViewer';
import ParticipantView from './ParticipantView';
import RemoteParticipantPresenter from './RemoteParticipantPresenter';
import VideosdkRPK from '../../../../VideosdkRPK';
import Toast from 'react-native-simple-toast';
import {fetchProducts,fetchProductDetails} from '../../../api/api';
const MemoizedParticipant = React.memo(
  ParticipantView,
  ({participantId}, {participantId: oldParticipantId}) =>
    participantId === oldParticipantId,
);

import {MemoizedParticipantGrid} from './ParticipantGrid';
import {useOrientation} from '../../../utils/useOrientation';
import ChatViewer from '../Components/ChatViewer';
import {convertRFValue} from '../../../styles/spacing';
import Blink from '../../../components/Blink';

export default function MeetingViewer({setlocalParticipantMode}) {
  const {
    localParticipant,
    participants,
    pinnedParticipants,
    localWebcamOn,
    localMicOn,
    leave,
    end,
    toggleWebcam,
    toggleMic,
    presenterId,
    localScreenShareOn,
    toggleScreenShare,
    meetingId,
    activeSpeakerId,
    changeMode,
    hlsState,
    startHls,
    stopHls,
    enableScreenShare,
    disableScreenShare,
  } = useMeeting({
    onError: data => {
      const {code, message} = data;
      Toast.show(`Error: ${code}: ${message}`);
    },
  });

  const leaveMenu = useRef();
  const bottomSheetRef = useRef();
  const hlsRef = useRef();
  const orientation = useOrientation();

  const [bottomSheetView, setBottomSheetView] = useState('');
  const [list, setList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [productTitle, setproductTitle] = useState('');
  const [productDescription, setproductDescription] = useState('');
  const [productPrice, setproductPrice] = useState('');
  const [productStock, setproductStock] = useState('');
  const [productImage, setproductImage] = useState('');
  const [selectedId, setSelectedId] = useState(null);

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

  

  const participantIds = useMemo(() => {
    const pinnedParticipantId = [...pinnedParticipants.keys()].filter(
      participantId => {
        return participantId != localParticipant.id;
      },
    );
    // const regularParticipantIds = [...participants.keys()].filter(
    //   participantId => {
    //     return (
    //       ![...pinnedParticipants.keys()].includes(participantId) &&
    //       localParticipant.id != participantId
    //     );
    //   },
    // );
    const ids = [
      localParticipant?.id,
      ...pinnedParticipantId,
      // ...regularParticipantIds,
    ].slice(0, presenterId ? 2 : 6);

    if (activeSpeakerId) {
      if (!ids.includes(activeSpeakerId)) {
        ids[ids.length - 1] = activeSpeakerId;
      }
    }
    return ids;
  }, [
    participants,
    activeSpeakerId,
    pinnedParticipants,
    presenterId,
    localScreenShareOn,
  ]);

  useEffect(() => {
    if (hlsRef.current) {
      if (hlsState === 'HLS_STARTING' || hlsState === 'HLS_STOPPING') {
        hlsRef.current.start();
      } else {
        hlsRef.current.stop();
      }
    }
  }, [hlsState]);

  usePubSub('RAISE_HAND', {
    onMessageReceived: data => {
      const {senderName} = data;
      Toast.show(`${senderName} raised hand 🖐🏼`);
    },
  });

  useEffect(() => {
    if (Platform.OS == 'ios') {
      VideosdkRPK.addListener('onScreenShare', event => {
        if (event === 'START_BROADCAST') {
          enableScreenShare();
        } else if (event === 'STOP_BROADCAST') {
          disableScreenShare();
        }
      });

      return () => {
        VideosdkRPK.removeAllListeners('onScreenShare');
      };
    }
  }, []);

  const _handleHLS = () => {
    
    if (!hlsState || hlsState === 'HLS_STOPPED') {
      
      startHls({
        layout: {
          type: 'SPOTLIGHT',
          priority: 'PIN',
        },
        theme: 'DARK',
        orientation: 'landscape',
      });
    } else if (hlsState === 'HLS_PLAYABLE') {
      stopHls();
    }
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
        padding: 2,
        marginVertical: 8,
        marginHorizontal: 17,
        height: 120,
        
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

  usePubSub(`CHANGE_MODE_${localParticipant.id}`, {
    onMessageReceived: data => {
      const {message} = data;
      if (message.mode === 'VIEWER') {
        changeMode('VIEWER');
        setlocalParticipantMode('VIEWER');
      }
    },
  });

  useEffect(() => {
    if (hlsRef.current) {
      if (hlsState === 'HLS_STARTING' || hlsState === 'HLS_STOPPING') {
        hlsRef.current.start();
      } else {
        hlsRef.current.stop();
      }
    }
  }, [hlsState]);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
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
            flex: 1,
            justifyContent: 'space-between',
          }}>
            
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 16,
                color: colors.primary[100],
              }}>
              {meetingId ? meetingId : 'xxx - xxx - xxx'}
            </Text>

            <TouchableOpacity
              style={{
                justifyContent: 'center',
                marginLeft: 10,
              }}
              onPress={() => {
                Clipboard.setString(meetingId);
                Toast.show('Meeting Id copied Successfully');
              }}>
              <Copy fill={colors.primary[100]} width={18} height={18} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          
          {hlsState === 'HLS_STARTED' ||
          hlsState === 'HLS_STOPPING' ||
          hlsState === 'HLS_PLAYABLE' ||
          hlsState === 'HLS_STARTING' ? (
             <Blink ref={hlsRef} duration={500}>
              <TouchableOpacity
                onPress={() => {
                  _handleHLS();
                }}
                activeOpacity={1}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 8,
                  padding: 10,
                  borderRadius: 8,
                  borderWidth: 1.5,
                  backgroundColor: '#FF5D5D',
                }}>
                <Text
                  style={{
                    fontSize: convertRFValue(12),
                    color: colors.primary[100],
                  }}>
                  {hlsState === 'HLS_STARTED'
                    ? `Live Starting`
                    : hlsState === 'HLS_STOPPING'
                    ? `Live Stopping`
                    : hlsState === 'HLS_STARTING'
                    ? `Live Starting`
                    : hlsState === 'HLS_PLAYABLE'
                    ? 'Stop Live'
                    : null}
                </Text>
              </TouchableOpacity>
            </Blink>
          ) : (
            <TouchableOpacity
              onPress={() => {
                _handleHLS();
              }}
              activeOpacity={1}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 8,
                padding: 8,
                borderRadius: 8,
                borderWidth: 1.5,
                borderColor: '#2B3034',
              }}>
              <Text
                style={{
                  fontSize: convertRFValue(12),
                  color: colors.primary[100],
                }}>
                Go Live
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              setBottomSheetView('PARTICIPANT_LIST');
              bottomSheetRef.current.show();
            }}
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 8,
              width: 60,
              borderRadius: 8,
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}>
            <Participants height={20} width={20} fill={colors.primary[100]} />
            <Text
              style={{
                fontSize: convertRFValue(12),
                color: colors.primary[100],
                marginLeft: 4,
              }}>
              {participants ? [...participants.keys()].length : 1}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Center */}
      <View
        style={{
          flex: 1,
          flexDirection: orientation == 'PORTRAIT' ? 'column' : 'row',
          marginVertical: 12,
        }}>
        {presenterId && !localScreenShareOn ? (
          <RemoteParticipantPresenter presenterId={presenterId} />
        ) : presenterId && localScreenShareOn ? (
          <LocalParticipantPresenter />
        ) : null}
        <MemoizedParticipantGrid
          participantIds={participantIds}
          isPresenting={presenterId != null}
        />
        
        
          
       
      </View>
      <View  style={{
          flex: 0.3,
        }
        }>
        <FlatList
       
        data={list}
        renderItem={ItemView}
        keyExtractor={item => item.id}
        extraData={selectedId}
        horizontal={true}
      />
        </View>
        <View  style={{
          flex: 0.3,
        }
        }>
          <ChatViewer raiseHandVisible={false} />
        </View>
      <Menu
        ref={leaveMenu}
        menuBackgroundColor={colors.primary[700]}
        placement="left">
        <MenuItem
          title={'Leave'}
          description={'Only you will leave the call'}
          icon={<Leave width={22} height={22} />}
          onPress={() => {
            leave();
          }}
        />
        <View
          style={{
            height: 1,
            backgroundColor: colors.primary['600'],
          }}
        />
        <MenuItem
          title={'End'}
          description={'End call for all participants'}
          icon={<EndForAll />}
          onPress={() => {
            end();
          }}
        />
      </Menu>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <IconContainer
          backgroundColor={'red'}
          Icon={() => {
            return <CallEnd height={26} width={26} fill="#FFF" />;
          }}
          onPress={() => {
            leaveMenu.current.show();
          }}
        />
        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: '#2B3034',
          }}
          backgroundColor={!localMicOn ? colors.primary[100] : 'transparent'}
          onPress={() => {
            toggleMic();
          }}
          Icon={() => {
            return localMicOn ? (
              <MicOn height={24} width={24} fill="#FFF" />
            ) : (
              <MicOff height={28} width={28} fill="#1D2939" />
            );
          }}
        />
        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: '#2B3034',
          }}
          backgroundColor={!localWebcamOn ? colors.primary[100] : 'transparent'}
          onPress={() => {
            toggleWebcam();
          }}
          Icon={() => {
            return localWebcamOn ? (
              <VideoOn height={24} width={24} fill="#FFF" />
            ) : (
              <VideoOff height={36} width={36} fill="#1D2939" />
            );
          }}
        />
        <IconContainer
          onPress={() => {
            setBottomSheetView('CHAT');
            bottomSheetRef.current.show();
          }}
          style={{
            borderWidth: 1.5,
            borderColor: '#2B3034',
          }}
          Icon={() => {
            return <Chat height={22} width={22} fill="#FFF" />;
          }}
        />
        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: '#2B3034',
          }}
          onPress={() => {
            if (presenterId == null || localScreenShareOn) {
              Platform.OS === 'android'
                ? toggleScreenShare()
                : VideosdkRPK.startBroadcast();
            }
          }}
          Icon={() => {
            return <ScreenShare height={22} width={22} fill="#FFF" />;
          }}
        />
        
      </View>
      
      <BottomSheet
        sheetBackgroundColor={'#transparent'}
        draggable={false}
        radius={12}
        hasDraggableIcon
        closeFunction={() => {
          setBottomSheetView('');
        }}
        ref={bottomSheetRef}
        height={Dimensions.get('window').height * 0.3}>
        {bottomSheetView === 'CHAT' ? (
          <ChatViewer raiseHandVisible={false} />
        ) : bottomSheetView === 'PARTICIPANT_LIST' ? (
          <ParticipantListViewer participantIds={[...participants.keys()]} />
        ) : null}
        
      </BottomSheet>
      
    </>
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