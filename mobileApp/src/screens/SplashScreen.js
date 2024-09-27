/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ImageBackground,
} from "react-native";
import {Colors, Images, Fonts} from "../constants";
import {Display} from "../utils";

const SplashScreen = ({navigation}) => {
  return (
    <ImageBackground
      source={Images.BACKGROUND}
      style={styles.container}
      resizeMode="cover">
      <StatusBar barStyle="light-content" backgroundColor={Colors.NICE_COLOR} />
      <Image source={Images.LOGO} resizeMode="contain" style={styles.image} />
      {/* <Text style={styles.titleText}>BiteBuddy</Text> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.NICE_COLOR,
  },
  image: {
    height: Display.setHeight(20),
    width: Display.setWidth(50),
  },
  titleText: {
    color: Colors.DEFAULT_WHITE,
    fontSize: 32,
    fontFamily: Fonts.POPPINS_LIGHT,
  },
});

export default SplashScreen;
