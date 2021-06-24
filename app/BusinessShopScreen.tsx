import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import { BusinessTab } from "./HelperFiles/Navigation";
import PropTypes from 'prop-types';
import { styleValues, defaults, icons } from "./HelperFiles/StyleSheet";
import { IconButton, TabIcon } from "./HelperFiles/CompIndex";
import { BusinessInfoPage, BusinessProductsPage } from "./HelperFiles/PageIndex";
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomerMainTabParamList } from "./HelperFiles/Navigation";
import { RouteProp } from '@react-navigation/native';

type BusinessShopNavigationProp = StackNavigationProp<CustomerMainTabParamList, "businessShop">;

type BusinessShopRouteProp = RouteProp<CustomerMainTabParamList, "businessShop">;

type Props = {
    navigation: BusinessShopNavigationProp,
    route: BusinessShopRouteProp
}

type State = {}

export default class BusinessShopScreen extends Component<Props, State> {

    businessData = this.props.route.params.businessData;
    state: Readonly<State> = {};

    render() {
        return (
          <BusinessTab.Navigator
            initialRouteName={"info"}
            tabBarOptions={{
              style: defaults.tabBar,
              showLabel: false,
              // Get rid of spacing under icons
              safeAreaInsets: {
                bottom: 0,
                top: 0
              }
            }}
            sceneContainerStyle={defaults.screenContainer}
          >
            <BusinessTab.Screen
                name={"back"}
                component={View}
                options={{
                  tabBarIcon: (options) => <IconButton iconSource={icons.backArrow} options={options} buttonFunc={
                    () => this.props.navigation.navigate("search")
                  }/>
                }}
            />
            <BusinessTab.Screen
                name={"info"}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.document} options={options}/>
                }}
            >
              {props => <BusinessInfoPage {...props} businessData={this.businessData}/>}
            </BusinessTab.Screen>
            <BusinessTab.Screen
                name={"products"}
                options={{
                  tabBarIcon: (options) => <TabIcon iconSource={icons.shoppingCart} options={options}/>
                }}
            >
              {//
              //
              // CHANGE productsData to this.businessData.productsData
              //
              //
            }
              {props => <BusinessProductsPage {...props} businessData={this.businessData}/>}
            </BusinessTab.Screen>
          </BusinessTab.Navigator>
      );
    }
}

const styles = StyleSheet.create({
    
})



const products = [
    {
        "category": "Coffee",
        "products": [
            {
                "name": "Coffee",
                "description": "A freshly brewed coffee that you can enjoy throughout the day. In 2008 our master blenders and roasters created this for you — a smooth, well-rounded blend of Latin American coffees with subtly rich flavors of chocolate and toasted nuts, it’s served fresh every day.",
                "price": 2.99,
                "images": [
                  "https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG",
                  "https://post.healthline.com/wp-content/uploads/2020/08/ways-to-make-coffee-super-healthy-1200x628-facebook-1200x628.jpg",
                  "https://loseitblog.com/wp-content/uploads/2019/01/Coffee-Islamorada-.png",
                  "https://cdn.cancercenter.com/-/media/ctca/images/others/blogs/2019/01-january/01-blog-coffee-l.jpg"
                ],
                "optionTypes": [
                  {
                    "name": "Size",
                    "selections": [{
                        "name": "Small",
                        "priceChange": -1,
                        "image": null
                      }, {
                        "name": "Medium",
                        "priceChange": 0,
                        "image": null
                      }, {
                        "name": "Large",
                        "priceChange": 1,
                        "image": null
                      }]
                  }, {
                    "name": "Roast",
                    "selections": [{
                        "name": "Light",
                        "priceChange": 0,
                        "image": null
                      }, {
                        "name": "Medium",
                        "priceChange": 0,
                        "image": null
                      }, {
                        "name": "Dark",
                        "priceChange": 0,
                        "image": null
                      }]
                  }
                ],
                "ratings": [17,3,56,117,83],
                "extraInfo": "May contain milk."
              }, {
                "name": "Hot Chocolate",
                "description": "A freshly brewed coffee that you can enjoy throughout the day. In 2008 our master blenders and roasters created this for you — a smooth, well-rounded blend of Latin American coffees with subtly rich flavors of chocolate and toasted nuts, it’s served fresh every day.",
                "price": 3.49,
                "images": [
                  "https://assets.bonappetit.com/photos/57accdd1f1c801a1038bc794/16:9/w_2560%2Cc_limit/Hot-Chocolate-2-of-5.jpg",
                ],
                "optionTypes": [
                  {
                    "name": "Size",
                    "selections": [{
                        "name": "Small",
                        "priceChange": -1,
                        "image": null
                      }, {
                        "name": "Medium",
                        "priceChange": 0,
                        "image": null
                      }, {
                        "name": "Large",
                        "priceChange": 1,
                        "image": null
                      }]
                  }, {
                    "name": "Flavor",
                    "selections": [{
                        "name": "Chocolate",
                        "priceChange": 0,
                        "image": null
                      }, {
                        "name": "White Chocolate",
                        "priceChange": 0,
                        "image": null
                      }, {
                        "name": "Vanilla",
                        "priceChange": 0,
                        "image": null
                      }, {
                        "name": "Caramel",
                        "priceChange": 0,
                        "image": null
                      }]
                  }
                ],
                "ratings": [17,3,56,117,83],
                "extraInfo": "May contain milk."
              }
        ]
    }, {
        "category": "Cold Drinks",
        "products": [
            {
                "name": "Iced Coffee",
                "description": "A cold coffee that you can enjoy throughout the day. In 2008 our master blenders and roasters created this for you — a smooth, well-rounded blend of Latin American coffees with subtly rich flavors of chocolate and toasted nuts, it’s served fresh every day.",
                "price": 2.99,
                "images": [
                  "https://www.seriouseats.com/2020/06/20200619-cold-brew-coffee-daniel-gritzer-2.jpg",
                ],
                "optionTypes": [
                  {
                    "name": "Size",
                    "selections": [{
                        "name": "Small",
                        "priceChange": -1,
                        "image": null
                      }, {
                        "name": "Medium",
                        "priceChange": 0,
                        "image": null
                      }, {
                        "name": "Large",
                        "priceChange": 1,
                        "image": null
                      }]
                  }, {
                    "name": "Roast",
                    "selections": [{
                        "name": "Light",
                        "priceChange": 0,
                        "image": null
                      }, {
                        "name": "Medium",
                        "priceChange": 0,
                        "image": null
                      }, {
                        "name": "Dark",
                        "priceChange": 0,
                        "image": null
                      }]
                  }
                ],
                "ratings": [17,3,56,117,83],
                "extraInfo": "May contain milk."
            }
        ]
    },
    {
        "category": "Pastries",
        "products": [
            {
                "name": "Croissant",
                "description": "A croissant is a buttery, flaky, viennoiserie pastry of Austrian origin, named for its historical crescent shape. Croissants and other viennoiserie are made of a layered yeast-leavened dough.",
                "price": 2.49,
                "images": [
                  "https://img.delicious.com.au/RzgR3kXD/w1200/del/2015/12/cornetti-italian-croissants-24713-1.jpg",
                ],
                "optionTypes": [
                  {
                    "name": "Type",
                    "selections": [{
                        "name": "Plain",
                        "priceChange": 0,
                        "image": null
                      }, {
                        "name": "Chocolate",
                        "priceChange": 0,
                        "image": null
                      }]
                  }
                ],
                "ratings": [17,3,56,117,83],
                "extraInfo": "May contain milk."
            }
        ]
    }
]