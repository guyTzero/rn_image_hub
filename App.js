import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Image,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const setAPI = async () => {
  return axios.create({
    baseURL: 'https://ancient-plateau-11652.herokuapp.com/',
    timeout: 100000,
  });
};
const uploadG = async data => {
  let api = await setAPI();
  console.log('uploadGuploadGuploadG');
  return api.post('upload', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  });
};
const updateName = async data => {
  let api = await setAPI();
  console.log('updateName');
  return api.get('add:' + data, {
    headers: {
      Accept: 'application/json',
    },
  });
};
const getName = async () => {
  let api = await setAPI();
  console.log('getName');
  return api.get('data', {
    headers: {
      Accept: 'application/json',
    },
  });
};

const App = props => {
  const [img, setImg] = useState(null);
  const [mode, setMode] = useState('add');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (mode == 'list') {
      getName()
        .then(response => {
          console.log('getName success', response);
          let rev = response.data.data.reverse()
          setData(rev);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [mode]);

  const selectFile = () => {
    var options = {
      title: 'Select Image',

      customButtons: [
        {
          name: 'customOptionKey',

          title: 'Choose file from Custom Option',
        },
      ],

      storageOptions: {
        skipBackup: true,

        path: 'images',
      },
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('husadsd', response.assets[0]);
        let data = response.assets[0];
        setImg(data);
        console.log(data.uri);
        const imgFormData = new FormData();
        let imgName = Math.floor(Math.random() * 10000) + '.png';
        imgFormData.append('myImage', {
          uri: data.uri,
          type: 'image/png',
          name: imgName,
        });
        uploadG(imgFormData)
          .then(response => {
            console.log('image uploaded', response);
            updateName(imgName)
              .then(response => {
                console.log('imgName uploaded', response);
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  const List = () => {
    return (
      <ScrollView style={{height:'80%'}}>
        <View
          style={{alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
          {data.map((e, k) => {
            console.log(
              'https://ancient-plateau-11652.herokuapp.com/file/' + e.label,
            );
            return (
              <Image
                source={{
                  uri:
                    'https://ancient-plateau-11652.herokuapp.com/file/' +
                    e.label,
                }}
                style={{width: 200, height: 200}}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setMode(mode == 'add' ? 'list' : 'add')}
        style={styles.button}>
        <Text style={styles.buttonText}>Gallery {data.length ? '(' + data.length + ')' : null} </Text>
      </TouchableOpacity>
      {img ?  <Text style={{color:'lime',fontSize:26,textAlign:'center'}}>upload success!</Text> : null}
      {mode == 'add' ? (
        <View style={styles.container}>
          {img ? (
            <Image
              source={{
                uri: img.uri,
              }}
              style={{width: 300, height: 300}}
            />
          ) : null}
         
          <View style={{marginTop: 10}} />
          <TouchableOpacity onPress={() => selectFile()} style={styles.button}>
            <Text style={styles.buttonText}>Select File</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <List />
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 30,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: '#fff',

    marginTop: 200,
  },

  button: {
    width: '100%',

    height: 60,

    backgroundColor: '#3740ff',

    alignItems: 'center',

    justifyContent: 'center',

    borderRadius: 4,

    marginBottom: 12,
  },

  buttonText: {
    textAlign: 'center',

    fontSize: 15,

    color: '#fff',
  },
});
