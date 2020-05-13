/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Modal,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Image,
  Dimensions,
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Input,
  Item,
  List,
  ListItem,
  Card,
  CardItem,
  Thumbnail,
  Label,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import Display from 'react-native-display';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';

const App: () => React$Node = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [inputContent, setInputContent] = React.useState('');
  const [content, setContent] = React.useState([]);
  const [locationUser, setLocationUser] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [flag, setFlag] = React.useState(false);
  const [colorMessage, setColorMessage] = React.useState('');
  const [img, setImg] = React.useState('');
  const [msjModal, setMsjModal] = React.useState('');
  const [flagModal, setFlagModal] = React.useState(false);

  React.useEffect(() => {
    const loadAsync = async () => {
      let userData;
      try {
        userData = JSON.parse(await AsyncStorage.getItem('list'));
        if (userData != null) {
          setContent(userData);
        }
        //await AsyncStorage.removeItem('list');
      } catch (e) {
        console.log(e);
      }
    };

    loadAsync();
  }, []);

  const storageOffline = async (list) => {
    await AsyncStorage.setItem('list', JSON.stringify(list));
  };

  function getLocation() {
    Keyboard.dismiss();
    try {
      Geolocation.getCurrentPosition((info) => setLocationUser(info));
      //Geolocation.getCurrentPosition((info) => alert(JSON.stringify(info)));
      messageHandlerModal('location loaded', true);
      setTimeout(() => {
        messageHandlerModal('', false);
      }, 3000);
    } catch (err) {
      alert('An error occurs trying to get your location');
    }
  }

  function openImagePicker() {
    const options = {
      title: 'Select image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //const source = {uri: response.uri};
        let source = response;
        setImg(source);
        messageHandlerModal("Image loaded",true);
        setTimeout(() => {
          messageHandlerModal('', false);
        }, 3000);
        //alert(source);
      }
    });
  }

  function addContent(text, titleI, imageI, locationI) {
    Keyboard.dismiss();
    if (String(text).trim().length > 0 && String(titleI).trim().length > 0) {
      setContent([
        ...content,
        {
          index: content.length + 1,
          titleInput: titleI,
          inputText: text,
          inputImg: imageI,
          inputLocation: locationI,
          inputDate: moment(new Date()).format(),
        },
      ]);
      storageOffline([
        ...content,
        {
          index: content.length + 1,
          titleInput: titleI,
          inputText: text,
          inputImg: imageI,
          inputLocation: locationI,
          inputDate: moment(new Date()).format(),
        },
      ]);
      /*content.sort((a, b) =>new Date(b.inputDate).getTime() - new Date(a.inputDate).getTime());*/
      //const sortedArray  = array.sort((a,b) => new Moment(a.date).format('YYYYMMDD') - new Moment(b.date).format('YYYYMMDD'))
      setModalVisible(!modalVisible);
      messageHandler('Your post has been added successfully', true, '#5cb85c');
      setTimeout(() => {
        messageHandler('', false, '#5cb85c');
      }, 3000);
      cleanValues();
    } else {
      alert('Fill title and description field');
    } 
  }

  function messageHandler(m, f, c) {
    setMessage(m);
    setFlag(f);
    setColorMessage(c);
  }

  function messageHandlerModal(m, f) {
    setMsjModal(m);
    setFlagModal(f);
  }

  function cleanValues() {
    setTitle('');
    setInputContent('');
    setImg('');
    setLocationUser('');
  }

  function rederList() {
    content.map(function (item) {
      return (
        <View style={{paddingLeft: 5, paddingRight: 5}} key={item.index}>
          <Card key={item.index}>
            <CardItem header style={{paddingTop: 3, paddingBottom: 3}}>
              <Text style={{fontWeight: 'bold'}}>{item.titleInput}</Text>
            </CardItem>
            {String(item.imageI).trim().length > 0 ? <Text>HOLA</Text> : null}
            <CardItem footer style={{paddingTop: 3, paddingBottom: 3}}>
              <Text>{item.inputText}</Text>
            </CardItem>
          </Card>
        </View>
      );
    });
  }


  const sortByDate = () => {
    const dateSort = [...content].sort(
      (a, b) =>
        new Date(b.inputDate).getTime() - new Date(a.inputDate).getTime(),
    );
    setContent(dateSort);
    storageOffline(dateSort);
  };

  const sortByTitle = () => {
    const dateSort = [...content].sort((a, b) =>
      a.titleInput.localeCompare(b.titleInput),
    );
    setContent(dateSort);
    storageOffline(dateSort);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      {/*<SafeAreaView>*/}
      <Container>
        <Header style={{backgroundColor: '#FFF'}}>
          <Body style={{alignContent: 'center', alignItems: 'center'}}>
            <Title style={{color: '#000'}}>My post app</Title>
          </Body>
        </Header>
        <Content>
          <Item style={{flexDirection: 'row'}}>
            <Icon
              active
              name="person"
              style={{color: '#000', paddingLeft: 15}}
              onPress={() => setModalVisible(true)}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{flex: 1, padding: 10}}>
              <Text
                onPress={() => setModalVisible(true)}
                style={{fontSize: 18, color: '#3A3A3A'}}>
                What are you thinking?
              </Text>
            </TouchableOpacity>
          </Item>
          <Display enable={flag}>
            <Text
              style={{
                textAlign: 'center',
                backgroundColor: colorMessage,
                color: '#FFF',
                fontWeight: 'bold',
              }}>
              {message}
            </Text>
          </Display>

          {content.length > 0 ? (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View
                style={{
                  width: '50%',
                  //height: 50,
                  backgroundColor: 'powderblue',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text onPress={sortByDate}>Sort by date</Text>
              </View>
              <View
                style={{
                  width: '50%',
                  //height: 50,
                  backgroundColor: 'powderblue',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text onPress={sortByTitle}>Sort by title</Text>
              </View>
            </View>
          ) : null}

          {content.map(function (item) {
            return (
              <View style={{paddingLeft: 5, paddingRight: 5}} key={item.index}>
                <Card key={item.index}>
                  <CardItem header style={{paddingTop: 3, paddingBottom: 3}}>
                    <Text style={{fontWeight: 'bold'}}>{item.titleInput}</Text>
                  </CardItem>
                  <CardItem style={{paddingTop: 3, paddingBottom: 3}}>
                    {String(item.inputImg).trim().length > 0 ? (
                      <Image
                        source={{
                          uri: 'data:image/jpeg;base64,' + item.inputImg.data,
                        }}
                        style={{
                          height: 200,
                          width: 200,
                          flex: 1,
                          resizeMode: 'contain',
                        }}
                      />
                    ) : null}
                    {String(item.inputLocation).trim().length > 0 ? (
                      <Image
                        source={{
                          uri:
                            'https://impulsoedomex.com.mx/wp-content/uploads/2018/04/Google-Maps-Cómo-solucionar-un-error-en-una-dirección.jpg',
                        }}
                        style={{
                          height: 200,
                          width: 200,
                          flex: 1,
                          resizeMode: 'contain',
                        }}
                      />
                    ) : null}
                  </CardItem>
                  <CardItem footer style={{paddingTop: 3, paddingBottom: 3}}>
                    <Text>{item.inputText}</Text>
                  </CardItem>
                </Card>
              </View>
            );
          })}
        </Content>
      </Container>

      <Modal
        animationType="slide"
        visible={modalVisible}
        presentationStyle="fullScreen"
        onRequestClose={() => {
          alert('Modal has been closed.');
        }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Display enable={flagModal}>
            <Text
              style={{
                textAlign: 'center',
                backgroundColor: '#5cb85c',
                color: '#FFF',
                fontWeight: 'bold',
              }}>
              {msjModal}
            </Text>
          </Display>
          <View style={{padding: 2}}>
            <View style={{alignItems: 'flex-end', paddingRight: 15}}>
              <Icon
                name="close"
                style={{color: 'red'}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              />
            </View>
            <View style={styles.containerTitle}>
              <Input
                style={styles.Input}
                autoCorrect={false}
                autoCapitalize={'none'}
                placeholder={'Title'}
                onChangeText={(text) => setTitle(text)}
              />
            </View>
            <View style={styles.containerInput}>
              <Input
                multiline={true}
                numberOfLines={20}
                placeholder={'Description'}
                style={styles.Input}
                autoCorrect={false}
                autoCapitalize={'none'}
                onChangeText={(text) => setInputContent(text)}
              />
            </View>

            <View>
              <Text>&nbsp;</Text>
              <Text>&nbsp;</Text>
            </View>

            <ListItem icon onPress={() => openImagePicker()}>
              <Left>
                <Button style={{backgroundColor: '#007AFF'}}>
                  <Icon active name="camera" />
                </Button>
              </Left>
              <Body>
                <Text>Add Image</Text>
              </Body>
            </ListItem>
            <ListItem icon onPress={() => getLocation()}>
              <Left>
                <Button style={{backgroundColor: '#007AFF'}}>
                  <Icon active name="navigate" />
                </Button>
              </Left>
              <Body>
                <Text>Add location</Text>
              </Body>
            </ListItem>

            <View>
              <Text>&nbsp;</Text>
              <Text>&nbsp;</Text>
            </View>

            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{width: '50%', padding: 5}}>
                <Button
                  success
                  style={{justifyContent: 'center'}}
                  onPress={() =>
                    addContent(inputContent, title, img, locationUser)
                  }>
                  <Text>Publish</Text>
                </Button>
              </View>

              <View
                style={{width: '50%', padding: 5}}
                onPress={() => setModalVisible(!modalVisible)}>
                <Button
                  danger
                  style={{justifyContent: 'center'}}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Text>Cancel</Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
      {/*</SafeAreaView>*/}
    </>
  );
};

const styles = StyleSheet.create({
  containerInput: {
    minHeight: 65,
    height: 150,
    alignContent: 'center',
    marginTop: 25,
    borderBottomWidth: 0,
    paddingLeft: 15,
    paddingRight: 15,
  },
  containerTitle: {
    marginTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  Input: {
    borderColor: '#a7a6ab',
    textAlignVertical: 'top',
    borderWidth: 0.3,
    borderRadius: 5,
    // marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
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
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
});

export default App;
