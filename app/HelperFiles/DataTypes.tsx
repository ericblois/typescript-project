
export type ShippingInfo = {
    name: string,
    streetAddress: string,
    city: string,
    region?: string,
    country: string,
    postalCode: string
  }

export type UserData = {
  name: string,
  age: number,
  gender: "male" | "female" | "nonbinary",
  birthDay: string,
  birthMonth: string,
  birthYear: string,
  country: "canada" | "united_states",
  shippingAddresses: ShippingInfo[],
  defaultAddressIndex: number,
  businessIDs: string[]
}

export type ProductOption = {
name: string,
priceChange: number,
image: string
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
price?: number,
description?: string,
images?: string[],
optionTypes?: ProductOptionType[],
ratings?: number[],
extraInfo?: string,
isVisible: boolean
}

export type ProductCategory = {
name: string,
productIDs: string[]
}

export type ProductRefCategory = {
category: string,
products: firebase.default.firestore.DocumentReference[]
}

export type PublicBusinessData = {
id: string,
name?: string,
profileImage?: string,
galleryImages?: string[],
businessType?: string,
totalRating?: number,
description?: string,
address?: string,
city?: string,
region?: string,
country: string,
postalCode?: string,
geohash?: string,
keywords?: string[],
productList?: ProductCategory[],
}

export type PrivateBusinessData = {
userID: string,
coords?: {latitude: number, longitude: number},
productListReference?: ProductRefCategory[],
}