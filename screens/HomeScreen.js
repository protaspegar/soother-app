import React from 'react';
import {
  Animated,
  Button,
  Image,
  Platform,
  ScrollView,
  Slider,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Asset, Audio, FileSystem, KeepAwake, Font, Permissions } from 'expo';
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor()
  {
    super();

    this.sound = null;
    this.AnimationRunning = false;
    this.Animation = new Animated.Value(0);
  }

  StartBackgroundColorAnimation = () =>
  {
    console.log("StartBackgroundColorAnimation");
    if (this.AnimationRunning === true){
      this.Animation.setValue(0);

      Animated.timing(
        this.Animation,
        {
          toValue: 1,
          duration: 5000
        }
        ).start(() => { this.StartBackgroundColorAnimation() });
    }
  }

  StopBackgroundColorAnimation = () =>
  {
    console.log("StopBackgroundColorAnimation");
    this.Animation.setValue(0);
    Animated.timing(
      this.Animation
    ).stop();
  }

  onPressStart = () => 
  {
    console.log("onPressStart");
    this.AnimationRunning = true;
    this.StartBackgroundColorAnimation();
  }
  onPressStop = () => 
  {
    console.log("onPressStop");
    this.AnimationRunning = false;
    this.StopBackgroundColorAnimation();
  }
  onPressPlaySound = async () =>
  {
    console.log("onPressPlaySound");
    await Audio.setIsEnabledAsync(true);
    const sound = new Audio.Sound();
    await sound.loadAsync(require('../assets/audios/spring-weather.mp3'));
    await sound.playAsync();
    this.sound = sound;
  }
  onPressStopSound = async () =>
  {
    console.log("onPressStopSound");
    if (this.sound != null){
      await this.sound.unloadAsync();
    }
  }

  render() {
    const BackgroundColorConfig = this.Animation.interpolate(
      {
        inputRange: [ 0, 0.25, 0.5, 0.75, 1 ],
        outputRange: [ '#000000', '#845300', '#FFA100', '#845300', '#000000' ]
      });

    return (
      <Animated.View style={[styles.container, { backgroundColor: BackgroundColorConfig }]}>
        <KeepAwake />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.titleText}>Soother 0.2</Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>Click on the button to start soothing</Text>

            <TouchableOpacity style={styles.standardButton} onPress={this.onPressStart} >
              <Text style={styles.standardButtonText} > Start Fading </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.standardButton} onPress={this.onPressStop} >
              <Text style={styles.standardButtonText} > Stop Fading </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.standardButton} onPress={this.onPressPlaySound} >
              <Text style={styles.standardButtonText} > Play Sound </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.standardButton} onPress={this.onPressStopSound} >
              <Text style={styles.standardButtonText} > Stop Sound </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>


      </Animated.View>
    );
  }





}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 34,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  standardButton:{
    backgroundColor: "rgba(255,161,0,0.08)",
    width: 300,
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  standardButtonText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
});
