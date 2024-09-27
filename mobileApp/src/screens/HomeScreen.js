import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  CategoryMenuItem,
  ShopCard,
  // RestaurantMediumCard,
  Separator,
  ShopMediumCard,
} from "../components";
import {Colors, Fonts, Mock, Images} from "../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import {ShopService} from "../services";
import {Display} from "../utils";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useDispatch} from "react-redux";
import {GeneralAction} from "../actions";

const sortStyle = isActive =>
  isActive
    ? styles.sortListItem
    : {...styles.sortListItem, borderBottomColor: Colors.DEFAULT_WHITE};

const HomeScreen = ({navigation}) => {
  const [activeCategory, setActiveCategory] = useState();
  const [shops, setShops] = useState(null);
  const [activeSortItem, setActiveSortItem] = useState("recent");

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      ShopService.getShops().then(response => {
        if (response?.status) {
          setShops(response?.data);
        }
      });
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    dispatch(GeneralAction.logout())
      .then(() => {
        navigation.navigate("Signin");
      })
      .catch(error => {
        console.error("Greška pri odjavi:", error);
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
        <View style={styles.locationContainer}>
          {/* <Ionicons
            name="location-outline"
            size={15}
            color={Colors.DEFAULT_WHITE}
          /> */}
          <Ionicons name="gift" size={24} color="white"></Ionicons>
          <Text style={styles.locationText}>Učinite voljene ljude srećnim</Text>
          {/* <Text style={styles.selectedLocationText}>KUĆA</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={16}
            color={Colors.PASTEL_BROWN}
          /> */}
          {/* <Feather
            name="bell"
            size={24}
            color={Colors.DEFAULT_WHITE}
            style={{position: "absolute", right: 0}}
          />
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>12</Text>
          </View> */}
          <FontAwesome
            name="sign-out" // FontAwesome ikona za odjavu
            size={24}
            color={Colors.DEFAULT_WHITE}
            style={{position: "absolute", right: 0}}
            onPress={handleLogout}
          />
        </View>

        <View style={styles.searchContainer}>
          {/* <View style={styles.searchSection}>
            <Ionicons
              name="search-outline"
              size={25}
              color={Colors.DEFAULT_GREY}
            /> */}
          {/* <Text style={styles.searchText}>Pretražite..</Text> */}
          <Image
            source={Images.LOGO}
            resizeMode="contain"
            style={styles.image}
          />
          {/* </View> */}
          {/* <Feather
            name="sliders"
            size={20}
            color={Colors.DEFAULT_YELLOW}
            style={{marginRight: 10}}
          /> */}
        </View>
        <View style={styles.categoriesContainer}>
          {Mock.CATEGORIES.map(({name, logo}) => (
            <CategoryMenuItem
              key={name}
              name={name}
              logo={logo}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          ))}
        </View>
      </View>
      <ScrollView style={styles.listContainer}>
        <View style={styles.horizontalListContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>Najbolje ocijenjeno</Text>
            <Text style={styles.listHeaderSubtitle}>Pogledajte sve</Text>
          </View>
          <FlatList
            data={shops}
            keyExtractor={item => item?.id}
            horizontal
            ListHeaderComponent={() => <Separator width={20} />}
            ListFooterComponent={() => <Separator width={20} />}
            ItemSeparatorComponent={() => <Separator width={10} />}
            renderItem={({item}) => (
              <ShopCard
                {...item}
                navigate={shopId => navigation.navigate("Shop", {shopId})}
              />
            )}
          />
        </View>
        <View style={styles.sortListContainer}>
          <TouchableOpacity
            style={sortStyle(activeSortItem === "recent")}
            activeOpacity={0.8}
            onPress={() => setActiveSortItem("recent")}>
            <Text style={styles.sortListItemText}>Novo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={sortStyle(activeSortItem === "favorite")}
            activeOpacity={0.8}
            onPress={() => setActiveSortItem("favorite")}>
            <Text style={styles.sortListItemText}>Omiljeno</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={sortStyle(activeSortItem === "rating")}
            activeOpacity={0.8}
            onPress={() => setActiveSortItem("rating")}>
            <Text style={styles.sortListItemText}>Rejting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={sortStyle(activeSortItem === "popular")}
            activeOpacity={0.8}
            onPress={() => setActiveSortItem("popular")}>
            <Text style={styles.sortListItemText}>Popularno</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={sortStyle(activeSortItem === "trending")}
            activeOpacity={0.8}
            onPress={() => setActiveSortItem("trending")}>
            <Text style={styles.sortListItemText}>Trending</Text>
          </TouchableOpacity>
        </View>
        {shops?.map(item => (
          <ShopMediumCard {...item} key={item?.id} />
        ))}
        <Separator height={Display.setHeight(5)} />
      </ScrollView>
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
    height: 1800,
    position: "absolute",
    top: -1 * (1800 - 210),
    width: 1800,
    borderRadius: 1800,
    alignSelf: "center",
    zIndex: -1,
  },
  headerContainer: {
    justifyContent: "space-evenly",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginHorizontal: 20,
  },
  locationText: {
    color: Colors.DEFAULT_WHITE,
    marginLeft: 5,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    marginTop: 5,
  },
  selectedLocationText: {
    color: Colors.PASTEL_BROWN,
    marginLeft: 5,
    fontSize: 14,
    lineHeight: 14 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  alertBadge: {
    borderRadius: 32,
    backgroundColor: Colors.DEFAULT_YELLOW,
    justifyContent: "center",
    alignItems: "center",
    height: 16,
    width: 16,
    position: "absolute",
    right: -2,
    top: -10,
  },
  alertBadgeText: {
    color: Colors.DEFAULT_WHITE,
    fontSize: 10,
    lineHeight: 10 * 1.4,
    fontFamily: Fonts.POPPINS_BOLD,
  },
  // searchContainer: {
  //   backgroundColor: Colors.DEFAULT_WHITE,
  //   height: 45,
  //   borderRadius: 8,
  //   marginHorizontal: 20,
  //   marginTop: 20,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },
  searchContainer: {
    // backgroundColor: Colors.DEFAULT_WHITE,
    height: 45,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  searchText: {
    color: Colors.DEFAULT_GREY,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    marginLeft: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  listContainer: {
    paddingVertical: 5,
    zIndex: -5,
  },
  horizontalListContainer: {
    marginTop: 30,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 5,
  },
  listHeaderTitle: {
    color: Colors.DEFAULT_BLACK,
    fontSize: 16,
    lineHeight: 16 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  listHeaderSubtitle: {
    color: Colors.SOME_COLOR,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
  },
  sortListContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: Colors.DEFAULT_WHITE,
    marginTop: 8,
    elevation: 1,
  },
  sortListItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.DEFAULT_BROWN,
    height: 40,
  },
  sortListItemText: {
    color: Colors.DEFAULT_BLACK,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
  },
  image: {
    height: Display.setWidth(30),
    width: Display.setWidth(30),
  },
});

export default HomeScreen;
