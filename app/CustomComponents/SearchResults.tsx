import React, { Component } from "react";
import { View, FlatList, StyleSheet, } from "react-native";
import PropTypes from 'prop-types';
import SearchResultItem from "./SearchResultItem";
import { styleValues } from "../HelperFiles/StyleSheet";
import { businessPropType, firestore, PrivateBusinessData } from "../HelperFiles/Constants";
import { useNavigation } from "@react-navigation/native";

type Props = {
  navigation: ReturnType<typeof useNavigation>,
  businesses: PrivateBusinessData[],
}

type State = {}

export default class SearchResults extends Component<Props, State> {

  render() {
    return (
      <View>
        <FlatList
          style={styles.resultAreaContainer}
          data={this.props.businesses}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={<View style={styles.header} />}
          ItemSeparatorComponent={() => <View style={{height: styleValues.winWidth * 0.125}}/>}
          renderItem={({ item }) => (
            <SearchResultItem navigation={this.props.navigation} businessData={item} />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  resultAreaContainer: {
    height: "100%",
    marginTop: styleValues.winWidth * 0.125,
    marginBottom: styleValues.winWidth * 0.125,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    height: styleValues.winWidth * 0.125,
  },
});

const exampleResults = [
  {
    userID: "abc123",
    name: "Kelly's Tutoring",
    profileImage: "https://tutor.bc.ca/wp-content/uploads/2020/10/2-3.jpg",
    galleryImages: [
      "https://www.canadianfranchisemagazine.com/wp-content/uploads/2020/08/Tutor-Doctor-750x350.jpg",
      "https://www.oxfordlearning.com/wp-content/uploads/2018/02/students-working-at-desk.jpeg",
      "https://cdn.tutors.com/assets/images/bg/desktop/math-tutor-cost.jpg",
    ],
    businessType: "Tutor",
    totalRating: 4.5,
    description: "In 2000, Kelly Dougherty was busy using her free time outside of university to offer students private tutoring. She found herself almost always fully booked, with demand far greater than she could ever cope with on her own. Her passion for tutoring and helping children grew further after she obtained her Master’s Degree in Child Psychology. The increasing demand for effective tutoring services and Kelly's passion led her to found Kelly's Tutoring with the mission to help children improve their school experience and achieve their academic goals.\nAfter noticing the proven effectiveness of her approach, Kelly and her husband Andrew assembled a dream team of like-minded individuals and opened Kelly's Tutoring across North America.",
    address: "1 Westmount Square",
    city: "Westmount",
    province: "Quebec",
    postalCode: "H3Z2P9",
  },
  {
    userID: "bcd234",
    name: "Bean Coffee Shop",
    profileImage: "https://www.fundingcircle.com/us/resources/wp-content/uploads/2019/12/photo-1449198063792-7d754d6f3c80-1.jpg",
    galleryImages: [
      "https://assets.entrepreneur.com/content/3x2/2000/20190529191242-GettyImages-753289793.jpeg",
      "https://curiocity.com/toronto/wp-content/uploads/2019/12/maderas-cafe-05911.jpg",
      "https://www.shopkeep.com/wp-content/uploads/2018/07/post-image-769x513.png",
      "https://blog.brandmycafe.com/wp-content/uploads/2019/08/how-much-does-it-cost-to-start-a-coffee-shop-bmc-front-of-house.png",
      "https://inspirationdesignbooks.com/blog/wp-content/uploads/2018/10/World’s-best-coffee-shops-for-Design-Lovers-1.jpg",
      "https://i.pinimg.com/originals/7b/f5/b1/7bf5b10e2fa9e62782234175c892e799.jpg",
      "https://media.blogto.com/articles/20180131-2048-TheDrakeHotel35.jpg?w=2048&cmd=resize_then_crop&height=1365&quality=70",
      "https://cdn.shopify.com/s/files/1/0135/1827/4660/articles/coffee-shop-lighting_775x.jpg?v=1579712471",
      "https://www.fundingcircle.com/us/resources/wp-content/uploads/2019/12/photo-1449198063792-7d754d6f3c80-1.jpg",
      "https://d2w1ef2ao9g8r9.cloudfront.net/images/Cafe-design-thumbnail.png?mtime=20200618155158&focal=90.34%25+50.14%25",
      "https://i.pinimg.com/originals/1e/86/d9/1e86d9f4b7e4e8b08da6065c96d83bca.jpg",
    ],
    businessType: "Cafe",
    totalRating: 4.9,
    description: "In addition to our renowned specialty coffee and traditional homemade pastries, we now offer a wide range of fine and local products, fresh fruits and vegetables, microbrewery beers and private import natural wines. Enjoy a coffee break in the same warm and relaxed atmosphere, while buying the essentials for your next picnic in the park in our new marketplace!",
    address: "1 Westmount Square",
    city: "Westmount",
    province: "Quebec",
    postalCode: "H3Z2P9",
  },
  {
    userID: "cde345",
    name: "Archie Smith (guitar/bass)",
    profileImage: "https://pickupmusic.com/wp-content/uploads/2018/07/corywong_1681-edit-BOLTS-low_web-819x1024.jpg",
    galleryImages: [

    ],
    businessType: "Musician",
    totalRating: 3.3,
    description: "I'm a multi-string player, and One Man Band. I play Acoustic Guitar, Cigar Box Guitar, Dobro/Slide Guitar, Banjo & Mandolin, while simultaneously playing Harmonica for lead and Stomp Box and Foot Tambourine for percussion. My music is described as 'Soulful Blues aged & seasoned in Americana Folk Roots.' I play mainly original songs, but can perform a fair amount of covers in my own adapted blues/folk/grass style, if you prefer. I also perform with other musicians of all sorts as a Duo, Trio, or a Full Band.",
    address: "1 Westmount Square",
    city: "Westmount",
    province: "Quebec",
    postalCode: "H3Z2P9",
  },
  {
    userID: "def456",
    name: "Squeegee Boys",
    profileImage: "https://efirstbankblog.com/wp-content/uploads/2016/03/Denny-640x565.jpg",
    galleryImages: [
      "https://thecleaningcrewonline.com/wp-content/uploads/2016/03/window-cleaning-1-1024x784.jpg",
      "https://media.angieslist.com/s3fs-public/styles/widescreen_large/public/windowcleaning900p_0.jpg?itok=GexPfp1w",
    ],
    businessType: "Property Maintenance",
    totalRating: 1.2,
    description: "Squeegee Boys is a full service window cleaning company catering to all commercial and residential cleaning needs in Montreal, Quebec. We offer thorough services that restore the sparkling look you desire. Squeegee Boys window cleaning and pressure washing prides itself in providing reliable, courteous and professional quality services at affordable prices. We treat your home or business like it’s our own by delivering high quality and long-lasting results.",
    address: "1 Westmount Square",
    city: "Westmount",
    province: "Quebec",
    postalCode: "H3Z2P9",
  },
  {
    userID: "efg567",
    name: "Tom's Landscaping",
    profileImage: "https://www.sanjoaquinpestcontrol.com/hubfs/7%20Benefits%20to%20Hiring%20a%20Professional%20Landscaper%20%7C%20The%20Experienced%20Gardener.jpg",
    galleryImages: [
      "https://hgtvhome.sndimg.com/content/dam/images/hgtv/stock/2018/1/15/iStock-516844708_colorful-garden-path.jpg.rend.hgtvcom.616.462.suffix/1516141969592.jpeg",
      "https://www.growgreen.ca/wp-content/uploads/2018/07/our-top-5-benefits-of-a-full-fledged-landscaping-renovation-848x480.jpg",
      "https://www.growgreen.ca/wp-content/uploads/2019/03/why-you-should-start-your-landscaping-in-spring.jpg",

    ],
    businessType: "Landscaping",
    totalRating: 4.1,
    description: "60 years dedicated to greatness, Tom's Landscaping is a family-owned and operated business which started in 1954 by Tom Tomson. The handyman immigrated from Italy with a desire to make a name for himself. Tom's Landscaping has now been passed down from generation to generation.",
    address: "1 Westmount Square",
    city: "Westmount",
    province: "Quebec",
    postalCode: "H3Z2P9",
  },
];