import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import Button from './src/components/Button.js';


export default function App() {

  // camera state
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  // audio state
  const [sound, setSound] = useState();

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const playSound = async () => {
    console.log('Loading sound...');
    const { sound } = await Audio.Sound.createAsync( require('./assets/squeak.mp3')
    );
    setSound(sound);
    console.log('Playing sound...');
    await sound.playAsync();
  }

  if (hasCameraPermission === false) {
    return <Text>No Access to Camera</Text>;
  }

  

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flash}
        ref={cameraRef}
      ></Camera>
      <View style={styles.controls}>
        <Button style={styles.flip} icon="cycle"></Button>
        <Button style={styles.shutter} icon="controller-record"  onPress={takePicture}></Button>
        <Button style={styles.noiseMaker} icon="controller-play" onPress={playSound}></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    marginTop: "20%",
    width: "100%",
    height: "65%",
    borderRadius: 20,
  },
  controls: {
    flex: 1,
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-around",
  }

});
