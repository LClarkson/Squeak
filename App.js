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

  // get camera permissions
  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === false) {
    return <Text>No Access to Camera</Text>;
  }

  // take picture function
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

  // play sound function
  const playSound = async () => {
    console.log("Loading sound...");
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/squeak.mp3")
    );
    setSound(sound);
    console.log("Playing sound...");
    await sound.playAsync();
  };

  // clean up sound resources
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
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
      >
        <View style={styles.controls}>
          <Button icon="cycle" size={40}></Button>
          <Button icon="controller-record" size={80} onPress={takePicture}></Button>
          <Button icon="controller-play" size={40} onPress={playSound}></Button>
        </View>
      </Camera>
    </View>
  );
}

// stylesheets
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "auto"
  },
  controls: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "flex-end",
    bottom: "10%",
  }

});
