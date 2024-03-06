import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, useWindowDimensions } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import Button from './src/components/Button.js';

// project currently in prototype phase//

export default function App() {
  // camera state
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  // audio state
  const [sound, setSound] = useState();

  const { width } = useWindowDimensions();
  const height = Math.round((width * 16) / 9);

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
        const data = await cameraRef.current.takePictureAsync({
          quality: 1,
          exif: true,
        });
        console.log(data);
        setImage(data.uri);
        MediaLibrary.saveToLibraryAsync(data.uri);
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


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  } 

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusBar}>
        <StatusBar style="light"></StatusBar>
      </View>
      <Camera
        ratio="16:9"
        style={{
          height: height,
          width: "100%",
          position: "absolute",
          bottom: 0,
        }}
        type={type}
        flashMode={flash}
        ref={cameraRef}
        focusDepth={0}
      >
        <View style={styles.controls}>
          <Button icon="cycle" size={40} onPress={toggleCameraType}></Button>
          <Button
            icon="controller-record"
            size={80}
            onPress={takePicture}
          ></Button>
          <Button icon="creative-commons-share" size={40} onPress={pickImage}></Button>
        </View>
      </Camera>
      <View style={styles.soundControls}>
        <Button icon="controller-record" size={60} onPress={playSound}></Button>
        <Button icon="controller-record" size={60} onPress={playSound}></Button>
        <Button icon="controller-record" size={60} onPress={playSound}></Button>
        <Button icon="controller-record" size={60} onPress={playSound}></Button>
        <Button icon="controller-record" size={60} onPress={playSound}></Button>
      </View>
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
  controls: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "flex-end",
    bottom: "10%",
  },
  statusBar: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000"
  },
  soundControls: {
    flex: 1,
    width: "20%",
    alignSelf: "flex-end",
    justifyContent: "space-around",
    bottom: "40%",
    opacity: .5
  }

});
