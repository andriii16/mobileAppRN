import React, {useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import {Separator, ToggleButton} from "../components";
import {Colors, Fonts, Images} from "../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {Display} from "../utils";
import {useDispatch, useSelector} from "react-redux";
import {StorageService} from "../services";
import {GeneralAction} from "../actions";
import {launchCamera, launchImageLibrary} from "react-native-image-picker";
import {Alert} from "react-native";
import UserService from "../services/UserService";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const AccountScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.generalState.userData);
  console.log("user", user);

  const profileImage = useSelector(state => state.generalState.profileImage);

  //   const openImagePicker = () => {
  //     const options = {
  //       mediaType: "photo",
  //       quality: 1,
  //       maxWidth: 300,
  //       maxHeight: 300,
  //     };

  //     launchImageLibrary(options, response => {
  //       if (response.didCancel) {
  //         console.log("User cancelled image picker");
  //       } else if (response.error) {
  //         console.log("ImagePicker Error: ", response.error);
  //       } else {
  //         const uri = response.assets[0].uri;
  //         dispatch(GeneralAction.setProfileImage(uri));
  //       }
  //     });
  //   };

  const openImagePickerMenu = () => {
    Alert.alert("Select Image", "Choose an option", [
      {text: "Camera", onPress: () => openCamera()},
      {text: "Gallery", onPress: () => openGallery()},
      {text: "Cancel", onPress: () => {}, style: "cancel"},
    ]);
  };

  const openCamera = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      maxWidth: 300,
      maxHeight: 300,
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        const uri = response.assets[0].uri;
        console.log("uri", uri);
        // dispatch(GeneralAction.setProfileImage(uri));
        handleImageUpload(uri);
      }
    });
  };

  const handleImageUpload = async uri => {
    dispatch(GeneralAction.setProfileImage(uri));
    const response = await UserService.updateProfileImage(uri);
    if (response.status) {
      Alert.alert("Success", "Profile image updated successfully");
    } else {
      Alert.alert(
        "Error",
        response.message || "Failed to update profile image",
      );
    }
  };

  const openGallery = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      maxWidth: 300,
      maxHeight: 300,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        const uri = response.assets[0].uri;
        handleImageUpload(uri);
        // dispatch(GeneralAction.setProfileImage(uri));
      }
    });
  };

  const logout = () => {
    StorageService.setToken("").then(() => {
      dispatch(GeneralAction.setToken(""));
      dispatch(GeneralAction.setUserData(null));
      dispatch(GeneralAction.setProfileImage(null));
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.SOME_COLOR}
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.backgroundCurvedContainer} />
      <View style={styles.headerContainer}>
        <Ionicons
          name="chevron-back-outline"
          size={20}
          color={Colors.DEFAULT_WHITE}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Nalog</Text>
        {/* <View>
          <Feather name="bell" size={20} color={Colors.DEFAULT_WHITE} />
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>12</Text>
          </View>
        </View> */}
        <View>
          {/* <Image
            source={Images.ACCOUNT}
            resizeMode="contain"
            style={styles.image}
          /> */}
          <FontAwesome name="cogs" size={24} color={Colors.DEFAULT_WHITE} />
        </View>
      </View>
      <View style={styles.profileHeaderContainer}>
        {/* <View style={styles.profileImageContainer}>
          <Image style={styles.profileImage} source={Images.AVATAR} />
        </View> */}
        {/* <TouchableOpacity onPress={openImagePicker}>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={profileImage ? {uri: profileImage} : Images.AVATAR}
            />
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={openImagePickerMenu}>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={profileImage ? {uri: profileImage} : Images.AVATAR}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.profileTextContainer}>
          <Text style={styles.nameText}>{user?.data?.username || "N/A"}</Text>
          <Text style={styles.emailText}>{user?.data?.email || "N/A"}</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
          <View style={styles.menuIcon}>
            <Text>🌟</Text>
          </View>
          <Text style={styles.menuText}>Zanimljive {"\n"}činjenice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
          <View
            style={{...styles.menuIcon, backgroundColor: Colors.LIGHT_GREY2}}>
            <Text>💡</Text>
          </View>
          <Text style={styles.menuText}>Ideje za {"\n"} poklone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
          <View style={{...styles.menuIcon, backgroundColor: Colors.LIGHT_RED}}>
            <Text>🌹</Text>
          </View>
          <Text style={styles.menuText}>Najpopularnije cvijeće</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        <Text style={styles.sectionHeaderText}>Moj nalog</Text>
        <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
          <View style={styles.sectionTextContainer}>
            <Ionicons name="mail" size={18} color={Colors.SOME_COLOR} />
            <Text style={styles.sectionText}>Email: {user?.data?.email} </Text>
          </View>
          <Feather
            name="chevron-right"
            color={Colors.INACTIVE_GREY}
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
          <View style={styles.sectionTextContainer}>
            <Ionicons
              name="person-outline"
              size={18}
              color={Colors.SOME_COLOR}
            />
            <Text style={styles.sectionText}>
              Korisničko ime: {user?.data?.username}
            </Text>
          </View>
          <Feather
            name="chevron-right"
            color={Colors.INACTIVE_GREY}
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sectionContainer} activeOpacity={0.8}>
          <View style={styles.sectionTextContainer}>
            <Ionicons name="card-outline" size={18} color={Colors.SOME_COLOR} />
            <Text style={styles.sectionText}>Plaćanje</Text>
          </View>
          <Feather
            name="chevron-right"
            color={Colors.INACTIVE_GREY}
            size={20}
          />
        </TouchableOpacity>

        {/* <Text style={styles.sectionHeaderText}>Notification</Text>
        <View style={styles.sectionContainer} activeOpacity={0.8}>
          <View style={styles.sectionTextContainer}>
            <Feather name="bell" size={18} color={Colors.DEFAULT_GREEN} />
            <Text style={styles.sectionText}>Notification</Text>
          </View>
          <ToggleButton size={0.5} />
        </View>
        <View style={styles.sectionContainer} activeOpacity={0.8}>
          <View style={styles.sectionTextContainer}>
            <Feather name="bell" size={18} color={Colors.DEFAULT_GREEN} />
            <Text style={styles.sectionText}>Promos & Offers Notification</Text>
          </View>
          <ToggleButton size={0.5} />
        </View>

        <Text style={styles.sectionHeaderText}>More</Text>
        <View style={styles.sectionContainer} activeOpacity={0.8}>
          <View style={styles.sectionTextContainer}>
            <Ionicons
              name="color-palette-outline"
              size={18}
              color={Colors.DEFAULT_GREEN}
            />
            <Text style={styles.sectionText}>Dark Mode</Text>
          </View>
          <ToggleButton size={0.5} />
        </View> */}
        <Text style={styles.sectionHeaderText}>Izađite iz aplikacije</Text>
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.sectionTextContainer}
            activeOpacity={0.8}
            onPress={() => logout()}>
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color={Colors.SOME_COLOR}
            />
            <Text style={styles.sectionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SECONDARY_WHITE,
  },
  backgroundCurvedContainer: {
    backgroundColor: Colors.SOME_COLOR,
    height: 2000,
    position: "absolute",
    top: -1 * (2000 - 230),
    width: 2000,
    borderRadius: 2000,
    alignSelf: "center",
    zIndex: -1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.POPPINS_MEDIUM,
    lineHeight: 20 * 1.4,
    color: Colors.DEFAULT_WHITE,
  },
  alertBadge: {
    backgroundColor: Colors.DEFAULT_YELLOW,
    position: "absolute",
    height: 16,
    width: 16,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    right: -2,
    top: -10,
  },
  alertBadgeText: {
    fontSize: 10,
    fontFamily: Fonts.POPPINS_BOLD,
    lineHeight: 10 * 1.4,
    color: Colors.DEFAULT_WHITE,
  },
  profileHeaderContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  profileImageContainer: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
    elevation: 3,
  },
  profileImage: {
    width: Display.setWidth(15),
    height: Display.setWidth(15),
    borderRadius: 32,
  },
  profileTextContainer: {
    marginLeft: 10,
  },
  nameText: {
    fontSize: 18,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 14 * 1.4,
    color: Colors.DEFAULT_WHITE,
    marginBottom: 5,
  },
  emailText: {
    fontSize: 14,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 10 * 1.4,
    color: Colors.DEFAULT_WHITE,
  },
  menuContainer: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },

  menuItem: {
    flex: 1,
    alignItems: "center",
  },
  menuIcon: {
    backgroundColor: Colors.LIGHT_YELLOW,
    height: Display.setWidth(8),
    width: Display.setWidth(8),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
  },
  menuText: {
    fontSize: 12,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    lineHeight: 12 * 1.4,
    color: Colors.DEFAULT_BLACK,
    textAlign: "center",
    marginTop: 5,
  },
  mainContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: Colors.DEFAULT_WHITE,
    elevation: 3,
    paddingHorizontal: 20,
    borderRadius: 10,
    paddingBottom: 20,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    lineHeight: 14 * 1.4,
    color: Colors.DEFAULT_BLACK,
    marginTop: 25,
  },
  sectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  sectionTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionText: {
    fontSize: 13,
    fontFamily: Fonts.POPPINS_REGULAR,
    lineHeight: 13 * 1.4,
    color: Colors.INACTIVE_GREY,
    marginLeft: 10,
  },
  image: {
    height: Display.setWidth(10),
    width: Display.setWidth(10),
  },
});

export default AccountScreen;
