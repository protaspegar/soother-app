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
import { Ionicons } from '@expo/vector-icons';
import { Asset, Audio, FileSystem, KeepAwake, Font, Permissions } from 'expo';
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {

  constructor()
  {
    super();
    this.state = {
      isAnimationRunning: false,
      isSoundPlaying: false,
      useChangingVolume: true,
    };

    this.sound = null;
    this.Animation = new Animated.Value(0);
    this.Animation.setValue(0);
  }

  RunBackgroundColorAnimation = () =>
  {
    //console.log("RunBackgroundColorAnimation");
    this.Animation.setValue(0);
    if (this.state.isAnimationRunning){

      Animated.timing(
        this.Animation,
        {
          toValue: 1,
          duration: 10000
        }
        ).start(() => { this.RunBackgroundColorAnimation() });
    }
  }


  onPressStart = () => 
  {
    //console.log("onPressStart");
    this.setState({ isAnimationRunning: true });
  }
  onPressStop = () => 
  {
    //console.log("onPressStop");
    this.setState({ isAnimationRunning: false });
  }
  onPressPlaySound = async () =>
  {
    //console.log("onPressPlaySound");
    this.setState({ isSoundPlaying: true });
    await Audio.setIsEnabledAsync(true);
    const sound = new Audio.Sound();
    await sound.loadAsync(require('../assets/audios/spring-weather.mp3'));
    await sound.setIsLoopingAsync(true);
    await sound.playAsync();
    this.sound = sound;
    this.updateAudioVolume();
  }
  onPressStopSound = async () =>
  {
    //console.log("onPressStopSound");
    this.setState({ isSoundPlaying: false });
    if (this.sound != null){
      await this.sound.unloadAsync();
    }
  }
  onPressUseChangingVolume = () =>
  {
    this.setState({ useChangingVolume: !this.state.useChangingVolume });
  }

  updateAudioVolume = async () =>
  {
    if(this.state.isSoundPlaying && this.state.isAnimationRunning && this.state.useChangingVolume){
      let soundVolume = this.Animation._value;
      soundVolume = 1.0 - (Math.abs(soundVolume - 0.5) * 2);
      this.sound.setVolumeAsync(soundVolume);
    }
    setTimeout(this.updateAudioVolume, 100)
    
  } 

  componentDidUpdate(prevProps, prevState) {
    // only start animation if it wasn't running already
    if (this.state.isAnimationRunning && this.Animation._value == 0) {
      this.RunBackgroundColorAnimation();
    }
  }

  renderStartFadingButton(){
    if (!this.state.isAnimationRunning) {
      return (
            <TouchableOpacity style={styles.standardButton} onPress={this.onPressStart} >
              <Text style={styles.standardButtonText} > Start Fading </Text>
            </TouchableOpacity>
        );
    }
    else{
      return null
    }
  }
  renderStopFadingButton(){
    if (this.state.isAnimationRunning) {
      return (
            <TouchableOpacity style={styles.standardButton} onPress={this.onPressStop} >
              <Text style={styles.standardButtonText} > Stop Fading </Text>
            </TouchableOpacity>
        );
    }
    else{
      return null
    }
  }

  renderStartSoundButton(){
    if (!this.state.isSoundPlaying) {
      return (
            <TouchableOpacity style={styles.standardButton} onPress={this.onPressPlaySound} >
              <Text style={styles.standardButtonText} > Start Sound </Text>
            </TouchableOpacity>
        );
    }
    else{
      return null
    }
  }
  renderStopSoundButton(){
    if (this.state.isSoundPlaying) {
      return (
            <TouchableOpacity style={styles.standardButton} onPress={this.onPressStopSound} >
              <Text style={styles.standardButtonText} > Stop Sound </Text>
            </TouchableOpacity>
        );
    }
    else{
      return null
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
          <View style={styles.welcomeContainer} >
            <Text style={styles.titleText} >Soother 0.3</Text>
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText} >Click on the button to start soothing</Text>

            { this.renderStartFadingButton() }
            { this.renderStopFadingButton() }

            { this.renderStartSoundButton() }
            { this.renderStopSoundButton() }

          </View>
        </ScrollView>

        <View style={styles.settingsContainer}>
          <Text style={styles.getStartedText} >Settings</Text>

          <TouchableOpacity style={styles.checkboxContainer} onPress={this.onPressUseChangingVolume} >
            { this.state.useChangingVolume && <Ionicons name="md-checkbox-outline" size={32} color="rgba(96,100,109, 1)" /> }
            { !this.state.useChangingVolume && <Ionicons name="md-square-outline" size={32} color="rgba(96,100,109, 1)" /> }
            <Text style={styles.checkboxText} > Use Changing Volume </Text>
          </TouchableOpacity>

        </View>


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
  settingsContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
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
  checkboxContainer:{
    width: 300,
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  checkboxText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
  },
});
