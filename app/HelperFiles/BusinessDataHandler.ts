import { firestore, ProductData, PublicBusinessData, ProductCategory, ProductRefCategory, isBusinessInfo, isProductList, PrivateBusinessData } from "./Constants";

export default class BusinessDataHandler {

    constructor() {
        // Prevent an instance from being created
        if (this.constructor === BusinessDataHandler) {
            throw new TypeError('Abstract class "BusinessDataHandler" cannot be instantiated directly.'); 
        }
    }

    static create = (businessID: string, businessDocSnap?: firebase.default.firestore.DocumentSnapshot) => {
        if (businessDocSnap) {
            let businessData: PrivateBusinessData = {
                businessID: businessDocSnap.id,
                docReference: businessDocSnap.ref,
                docSnapshot: businessDocSnap,
            }
            BusinessDataHandler.getProductRefList(businessData);
            BusinessDataHandler.getBusinessInfo(businessData);
            return businessData;
        } else {
            let businessData: PrivateBusinessData = {
                businessID: businessID,
                docReference: firestore.doc("/publicBusinessData/" + businessID),
            }
            return businessData;
        }
    }

    // Get this business' document snapshot
    static getBusinessSnapshot = async (businessData: PrivateBusinessData) => {
        if (!businessData.docSnapshot) {
            // Get snapshot
            const snap = await businessData.docReference.get().catch((e) => {throw e});
            // Check if the document exists
            if (!snap.exists) {
                throw new Error("No document exists for business ID: " + businessData.businessID);
            } else {
                businessData.docSnapshot = snap;
            }
        }
      }
    // Get the product list that contains references
    static getProductRefList = async (businessData: PrivateBusinessData) => {
        if (!businessData.productListReference) {
            // Add the doc snapshot to the PrivateBusinessData object
            await BusinessDataHandler.getBusinessSnapshot(businessData).catch((e) => {throw e});
            // Get the reference product list
            const productRefList = businessData.docSnapshot!.get("productList") as ProductRefCategory[];
            // Check if the document exists
            if (!productRefList) {
                throw new Error("Could not retrieve a product list from business ID: " + businessData.businessID);
            } else {
                businessData.productListReference = productRefList;
            }
        }
    }
    // Get only the PublicBusinessData for a business ID
    static getBusinessInfo = async (businessData: PrivateBusinessData) => {
        if (!businessData.info) {
            // Get this business' document snapshot
            await BusinessDataHandler.getBusinessSnapshot(businessData).catch((e) => {throw e});
            // Get business data
            const snapData = businessData.docSnapshot!.data() as firebase.default.firestore.DocumentData;
            if (snapData && "productList" in snapData) {
                // Check if this has a reference for its products yet
                if (!businessData.productListReference) {
                    businessData.productListReference = snapData.productList as ProductRefCategory[]
                }
                // Using object resting, get rid of productList from data retrieved from server, in order to cast as PublicBusinessData
                const { productList, ...reducedData } = snapData;
                const businessInfo = reducedData as PublicBusinessData;
                // Check if reducedData was successfully cast as PublicBusinessData object
                if (businessInfo) {
                    businessData.info = businessInfo;
                } else {
                    throw new TypeError("Could not convert server business data to PublicBusinessData object")
                }
            } else {
            throw new Error("No document or field productList exists for business ID: " + businessData.businessID);
            }
        }
      }
      // Get a business's product list
      static getBusinessProductList = async (businessData: PrivateBusinessData) => {
        if (!businessData.productList) {
            await BusinessDataHandler.getProductRefList(businessData).catch((e) => {throw e});
            // Iterate through each product category, and wait for all promises in nested loop to finish
            const productList = await Promise.all(businessData.productListReference!.map((refCategory: ProductRefCategory) => {
                // Convert list of product references to list of ProductData objects
                const productCategory = Promise.all(refCategory.products.map((productRef: firebase.default.firestore.DocumentReference) => {
                    // Get a ProductData object
                    return productRef.get().then((productSnap) => {
                        // Convert product snapshot to ProductData object
                        const productData = productSnap.data() as ProductData;
                        if (!productData) {
                            throw new Error("Could not retrieve a product from business ID: " + businessData.businessID);
                        }
                        return productData;
                    }, (e) => {throw e});
                })).then((products: ProductData[]) => {
                    // After converting all references, return a ProductCategory object
                    const productCat: ProductCategory = {
                        category: refCategory.category,
                        products: products
                    }
                    return productCat;
                }, (e) => {throw e});
                return productCategory;
            }))
            businessData.productList = productList;
        }
      }

      isValid = (businessData: PrivateBusinessData) => isBusinessInfo(businessData.info) && isProductList(businessData.productList);
}