import React, { useState } from 'react';
import {ScrollView,SafeAreaView, View, Text,TextInput,TouchableOpacity} from 'react-native';
import Button from '../../../components/Button';
//import { TextInput } from '../../components/Form'
import {SCREEN_NAMES} from '../../../navigators/screenNames';
import colors from '../../../styles/colors';
import styles from './styles';
import {adminLogin} from '../../../api/api';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {addProduct} from '../../../api/api';


export default function Product({navigation}) {
    const [accesToken, setToken] = useState('');
    const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [variant, setVariant] = useState([]);
  
  


  
  const handleSave = async () => {
    let tempArray = [];
    tempArray.push({option1:title,price:price,inventory_quantity:stock});
   // console.log(images[0]);
   // console.log(JSON.stringify(tempArray));
    let request_data = {
        "product" : {
        title: title,
        body_html: description,
        image: images,
        variants: tempArray,
        
        }
      };
      console.log(JSON.stringify(request_data));
     // var result = await adminAPI.addProduct(request_data);
      try{
        var result =  await addProduct(JSON.stringify(request_data));
        alert("Product Created..");
        
        
      } catch (error){
        console.log(error.message);
      } 
  };
  const handleSelectImages = () => {
    const options = {
      mediaType: 'photo',
      cropping: false,
      multiple: true,
    };

    ImagePicker.openPicker(options).then(response => {
      let tempArray = [];
      let prevSize = images.length;
      console.log("response image ------- " + response);
      response.forEach((item) => {
        let converted = Image.resolveAssetSource({uri: item.path});
        let image = {
          uri: converted.uri,
        }
        console.log("image path ========== " + image);
        tempArray.push({id:prevSize, image});
        prevSize++;
      })
      console.log(tempArray);
      let mergeImages = [...images, ...tempArray];
      setImages(mergeImages);
    })

    
  };

  return (
    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
      <View style={styles.contain}>
          <Text headline style={styles.title}>
            Product Name
          </Text>
          <TextInput
            style={[styles.textInput]}
            onChangeText={(text) => setTitle(text)}
            autoCorrect={false}
            placeholder={'Name'}
            value={title}
          />

          <Text headline style={styles.title}>
            Description
          </Text>
          <TextInput
            style={[styles.textInput, { marginTop: 10, height: 120 }]}
            onChangeText={(text) => setDescription(text)}
            textAlignVertical="top"
            multiline={true}
            autoCorrect={false}
            placeholder={'Enter some brief about product'}
            value={description}
          />
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 10,
              marginBottom: 4,
            }}
          >
            <View style={{
              flex: 1,
              marginHorizontal: 5,
              }}
            >
              <Text full title3>Price</Text>
              <TextInput full
                style={[styles.textInput, { marginTop: 10 }]}
                onChangeText={(text) => setPrice(text)}
                placeholder={"Price"}
                autoCorrect={false}
                value={price}
              />
            </View>
            <View style={{
              flex: 1,
              marginHorizontal: 5,
              }}
            >
              <Text full title3>Stock</Text>
              <TextInput full
                style={[styles.textInput, { marginTop: 10 }]}
                onChangeText={(text) => setStock(text)}
                placeholder={"Stock"}
                autoCorrect={false}
                value={stock}
              />
            </View>
            
          
        </View>
        <Text headline style={styles.title}>
            Image
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {images.map((imageData, key) => (
              <ImageItem key={key} item={imageData} />
            ))}
            <View style={styles.viewImage}>
              <TouchableOpacity
                style={[
                  styles.image,
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderStyle: 'dotted',
                    borderColor: colors.primary,
                  },
                ]}
                onPress={handleSelectImages}
              >
                <Icon name="plus-circle" size={18} color="#900" />
              </TouchableOpacity>
            </View>
          </View>
          <Button
          text={'Save'}
          onPress={handleSave}
        />
        </View>
    
    </ScrollView>
  );
}