export type Country = "canada" | "united_states" | ""
export const possibleRegions = [
  "alberta",
  "british_columbia",
  "manitoba",
  "new_brunswick",
  "newfoundland_and_labrador",
  "northwest_territories",
  "nova_scotia",
  "nunavut",
  "ontario",
  "prince_edward_island",
  "quebec",
  "saskatchewan",
  "yukon",
  "alabama",
  "alaska",
  "arizona",
  "arkansas",
  "california",
  "colorado",
  "connecticut",
  "delaware",
  "florida",
  "georgia",
  "hawaii",
  "idaho",
  "illinois",
  "indiana",
  "iowa",
  "kansas",
  "kentucky",
  "louisana",
  "maine",
  "maryland",
  "massachusetts",
  "michigan",
  "minnesota",
  "mississippi",
  "missouri",
  "montana",
  "nebraska",
  "nevada",
  "new_hampshire",
  "new_jersey",
  "new_mexico",
  "new_york",
  "north_carolina",
  "north_dakota",
  "ohio",
  "oklahoma",
  "oregon",
  "pennsylvania",
  "rhode_island",
  "south_carolina",
  "south_dakota",
  "tennessee",
  "texas",
  "utah",
  "vermont",
  "virginia",
  "washington",
  "west_virginia",
  "wisconsin",
  "wyoming"
]

export type ShippingInfo = {
    name: string,
    streetAddress: string,
    city: string,
    region: string | null,
    country: string,
    postalCode: string,
    apartment: string | null,
    message: string | null,
}

export const DefaultShippingInfo: Readonly<ShippingInfo> = {
  name: "",
  streetAddress: "",
  city: "",
  region: null,
  country: "",
  postalCode: "",
  apartment: null,
  message: null,
}

export type OptionSelections = {
  [optionType: string]: {optionName: string, priceChange: number}[]
}

export type CartItem = {
  businessID: string,
  productID: string,
  productOptions: OptionSelections,
  basePrice: number,
  totalPrice: number,
  quantity: number,
}

export type OrderData = {
  businessID: string,
  userID: string,
  orderID: string,
  cartItems: CartItem[],
  subtotalPrice: number,
  totalPrice: number,
  shippingInfo: ShippingInfo,
  deliveryMethod: "pickup" | "local" | "country" | "international",
  deliveryPrice: number,
  creationTime: string,
  responseTime: string | null,
  completionTime: string | null,
  status: "pending" | "accepted" | "cancelled" | "completed" | "received"
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
  favorites: string[],
  businessIDs: string[]
}

export const DefaultUserData: Readonly<UserData> = {
  name: "",
  age: 0,
  gender: "male",
  birthDay: "",
  birthMonth: "",
  birthYear: "",
  country: "",
  shippingAddresses: [],
  cartItems: [],
  favorites: [],
  businessIDs: []
}

export type ProductOption = {
  name: string,
  optionType: string,
  allowQuantity: boolean,
  priceChange: number,
  images: string[]
}

export const DefaultProductOption: Readonly<ProductOption> = {
  name: "",
  optionType: "",
  allowQuantity: false,
  priceChange: 0,
  images: []
}

export type ProductOptionType = {
  name: string,
  allowMultiple: boolean,
  optional: boolean,
  options: ProductOption[]
}

export const DefaultProductOptionType: Readonly<ProductOptionType> = {
    name: "",
    allowMultiple: false,
    optional: false,
    options: []
}

export type ProductData = {
  businessID: string,
  productID: string,
  category: string,
  name: string,
  price: number,
  description: string,
  images: string[],
  optionTypes: ProductOptionType[],
  ratings: number[],
  extraInfo: string,
  isVisible: boolean,
}

export const DefaultProductData: Readonly<ProductData> = {
  businessID: "",
  productID: "",
  category: "",
  name: "",
  price: 0,
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

export const DefaultProductCategory: ProductCategory = {
  name: "",
  productIDs: []
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
  coords: {latitude: number, longitude: number} | null,
  address: string,
  city: string,
  region: string,
  country: Country,
  postalCode: string,
  geohash: string | null,
  deliveryMethods: {
    pickup: boolean,
    local: boolean,
    country: boolean,
    international: boolean
  },
  localDeliveryRange: number,
  keywords: string[],
  productList: ProductCategory[],
  isValid: boolean
}

export const DefaultPublicBusinessData: Readonly<PublicBusinessData> = {
  userID: "",
  businessID: "",
  name: "",
  profileImage: "",
  galleryImages: [],
  businessType: "",
  totalRating: 0,
  description: "",
  coords: null,
  address: "",
  city: "",
  region: "",
  country: "",
  postalCode: "",
  geohash: null,
  deliveryMethods: {
    pickup: false,
    local: false,
    country: false,
    international: false
  },
  localDeliveryRange: 0,
  keywords: [],
  productList: [],
  isValid: false
}

export type PrivateBusinessData = {
  userID: string,
  businessID: string,
  country: Country,
  coords: {latitude: number, longitude: number} | null,
}

export const DefaultPrivateBusinessData: Readonly<PrivateBusinessData> = {
  userID: "",
  businessID: "",
  country: "",
  coords: {latitude: 0, longitude: 0},
}