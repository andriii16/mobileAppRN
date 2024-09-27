/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {ApiConstants, Colors, Fonts, Images} from "../constants";
import {Separator, CategoryListItem, FlowerCard} from "../components";
import {ShopService, StaticImageService} from "../services";
import {Display} from "../utils";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useDispatch, useSelector} from "react-redux";
import {BookmarkAction} from "../actions";

const ListHeader = () => (
  <View
    style={{
      flexDirection: "row",
      flex: 1,
      width: 40,
      justifyContent: "flex-end",
    }}>
    <View
      style={{
        backgroundColor: Colors.NICE_COLOR,
        width: 20,
        borderTopLeftRadius: 64,
        borderBottomLeftRadius: 64,
      }}
    />
  </View>
);

const ListFooter = () => (
  <View
    style={{
      flexDirection: "row",
      flex: 1,
      width: 40,
    }}>
    <View
      style={{
        backgroundColor: Colors.NICE_COLOR,
        width: 20,
        borderTopRightRadius: 64,
        borderBottomRightRadius: 64,
      }}
    />
  </View>
);

const ShopScreen = ({
  navigation,
  route: {
    params: {shopId},
  },
}) => {
  const [shop, setShop] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    ShopService.getOneShopById(shopId).then(response => {
      console.log(response?.data);
      setSelectedCategory(response?.data?.categories[0]);
      setShop(response?.data);
    });
  }, []);

  const dispatch = useDispatch();
  const isBookmarked = useSelector(
    state =>
      state?.bookmarkState?.bookmarks?.filter(item => item?.shopId === shopId)
        ?.length > 0,
  );

  // console.log(shopId);
  // console.log(isBookmarked);
  const addBookmark = () => dispatch(BookmarkAction.addBookmark({shopId}));
  const removeBookmark = () =>
    dispatch(BookmarkAction.removeBookmark({shopId}));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" translucent backgroundColor="transparent" />
      <>
        <Image
          source={{
            uri: StaticImageService.getGalleryImage(
              shop?.images?.cover,
              ApiConstants.STATIC_IMAGE.SIZE.SQUARE,
            ),
          }}
          style={styles.backgroundImage}
        />
        <ScrollView>
          <Separator height={Display.setHeight(35)} />
          <View style={styles.mainContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{shop?.name}</Text>
              <Ionicons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                color={Colors.RED}
                size={24}
                onPress={() =>
                  isBookmarked ? removeBookmark() : addBookmark()
                }
              />
            </View>
            <Text style={styles.tagText}>{shop?.tags?.join(" • ")}</Text>
            <View style={styles.ratingReviewsContainer}>
              <FontAwesome
                name="star"
                size={18}
                color={Colors.DEFAULT_YELLOW}
              />
              <Text style={styles.ratingText}>4.2</Text>
              <Text style={styles.reviewsText}>(455 Recenzija)</Text>
            </View>
            <View style={styles.deliveryDetailsContainer}>
              <View style={styles.rowAndCenter}>
                <Image
                  style={styles.deliveryDetailIcon}
                  source={Images.DELIVERY_CHARGE}
                />
                <Text style={styles.deliveryDetailText}>
                  Besplatna isporuka
                </Text>
              </View>
              <View style={styles.rowAndCenter}>
                <Image
                  style={styles.deliveryDetailIcon}
                  source={Images.DELIVERY_TIME}
                />
                <Text style={styles.deliveryDetailText}>{shop?.time} min</Text>
              </View>
              <View style={styles.rowAndCenter}>
                <Image
                  style={styles.deliveryDetailIcon}
                  source={Images.MARKER}
                />
                <Text style={styles.deliveryDetailText}>
                  {shop?.distance / 1000}km
                </Text>
              </View>
            </View>
            <View style={styles.categoriesContainer}>
              <FlatList
                data={shop?.categories}
                keyExtractor={item => item}
                horizontal
                ListHeaderComponent={() => <ListHeader />}
                ListFooterComponent={() => <ListFooter />}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <CategoryListItem
                    name={item}
                    isActive={item === selectedCategory}
                    selectCategory={category => setSelectedCategory(category)}
                  />
                )}
              />
            </View>
            {/* <View style={styles.flowerList}>
              {shop?.flowers
                ?.filter(flower => flower?.category === selectedCategory)
                ?.map(item => (
                  <FlowerCard
                    key={item?.id}
                    {...item}
                    navigate={() =>
                      navigation.navigate("Flower", {flowerId: item?.id})
                    }
                  />
                ))}
              <Separator height={Display.setHeight(2)} />
            </View> */}
            <View style={styles.flowerList}>
              {shop?.flowers?.filter(
                flower => flower?.category === selectedCategory,
              )?.length > 0 ? (
                shop?.flowers
                  ?.filter(flower => flower?.category === selectedCategory)
                  ?.map(item => (
                    <FlowerCard
                      key={item?.id}
                      {...item}
                      navigate={() =>
                        navigation.navigate("Flower", {flowerId: item?.id})
                      }
                    />
                  ))
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Image style={styles.emptyStateImage} source={Images.EMPTY} />
                  <Text style={styles.emptyStateText}>
                    Trenutno nema dostupnih proizvoda u ovoj kategoriji.
                  </Text>
                </View>
              )}
              <Separator height={Display.setHeight(2)} />
            </View>
          </View>
        </ScrollView>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    height: Display.setWidth(100),
    width: Display.setWidth(100),
  },
  mainContainer: {
    backgroundColor: Colors.SECONDARY_WHITE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 25,
    marginTop: 15,
  },
  title: {
    fontSize: 23,
    lineHeight: 23 * 1.4,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    color: Colors.DEFAULT_BLACK,
  },
  tagText: {
    marginHorizontal: 25,
    marginTop: 5,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_SEMI_BOLD,
    color: Colors.DEFAULT_GREY,
  },
  ratingReviewsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 25,
    marginTop: 10,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_BOLD,
    color: Colors.DEFAULT_BLACK,
  },
  reviewsText: {
    marginLeft: 5,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
  },
  deliveryDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 25,
    marginTop: 10,
    justifyContent: "space-between",
  },
  deliveryDetailText: {
    marginLeft: 3,
    fontSize: 12,
    lineHeight: 12 * 1.4,
    fontFamily: Fonts.POPPINS_MEDIUM,
    color: Colors.DEFAULT_BLACK,
  },
  deliveryDetailIcon: {
    height: 16,
    width: 16,
  },
  rowAndCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoriesContainer: {
    marginVertical: 20,
  },
  flowerList: {
    marginHorizontal: 15,
  },
  emptyStateContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
  },
  emptyStateImage: {
    width: Display.setWidth(50),
    height: Display.setWidth(50),
  },
  emptyStateText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.DEFAULT_GREY,
    fontFamily: Fonts.POPPINS_MEDIUM,
    textAlign: "center",
  },
});

export default ShopScreen;
