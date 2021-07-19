export type Country = "canada" | "united_states" | ""

export type ShippingInfo = {
    name: string,
    streetAddress: string,
    city: string,
    region?: string,
    country: string,
    postalCode: string
}

export type CartItem = {
  businessID: string,
  productID: string,
  productOptions: { [optionType: string]: string},
  quantity: number,
}

export type UserData = {
  name: string,
  age: number,
  gender: "male" | "female" | "nonbinary",
  birthDay: string,
  birthMonth: string,
  birthYear: string,
  country: Country,
  shippingAddresses: ShippingInfo[],
  cartItems: CartItem[],
  businessIDs: string[]
}

export const DefaultUserData: UserData = {
  name: "",
  age: 0,
  gender: "male",
  birthDay: "",
  birthMonth: "",
  birthYear: "",
  country: "",
  shippingAddresses: [],
  cartItems: [],
  businessIDs: []
}

export type ProductOption = {
  name: string,
  priceChange: number | null,
  images: string[]
}

export const DefaultProductOption = {
  name: "",
  priceChange: null,
  images: []
}

export type ProductOptionType = {
name: string,
options: ProductOption[]
}

export type ProductData = {
  businessID: string,
  productID: string,
  category: string,
  name: string,
  price: number | null,
  description: string,
  images: string[],
  optionTypes: ProductOptionType[],
  ratings: number[],
  extraInfo: string,
  isVisible: boolean
}

export const DefaultProductData = {
  businessID: "",
  productID: "",
  category: "",
  name: "",
  price: null,
  description: "",
  images: [],
  optionTypes: [],
  ratings: [],
  extraInfo: "",
  isVisible: false
}

export type ProductCategory = {
name: string,
productIDs: string[]
}

export type PublicBusinessData = {
  userID: string,
  businessID: string,
  name: string,
  profileImage: string,
  galleryImages: string[],
  businessType: string,
  totalRating: number,
  description: string,
  coords: {latitude: number | null, longitude: number | null},
  address: string,
  city: string,
  region: string,
  country: Country,
  postalCode: string,
  geohash: string,
  storePickup: boolean,
  localDelivery: boolean,
  deliveryRange: number,
  countryShipping: boolean,
  internationalShipping: boolean,
  keywords: string[],
  productList: ProductCategory[],
}

export const DefaultPublicBusinessData: PublicBusinessData = {
  userID: "",
  businessID: "",
  name: "",
  profileImage: "",
  galleryImages: [],
  businessType: "",
  totalRating: 0,
  description: "",
  coords: {latitude: null, longitude: null},
  address: "",
  city: "",
  region: "",
  country: "",
  postalCode: "",
  geohash: "",
  storePickup: false,
  localDelivery: false,
  deliveryRange: 0,
  countryShipping: false,
  internationalShipping: false,
  keywords: [],
  productList: [],
}

export type PrivateBusinessData = {
  userID: string,
  businessID: string,
  country: Country,
  coords: {latitude: number, longitude: number},
}

export const DefaultPrivateBusinessData: PrivateBusinessData = {
  userID: "",
  businessID: "",
  country: "",
  coords: {latitude: 0, longitude: 0},
}