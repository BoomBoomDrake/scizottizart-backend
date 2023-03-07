import mongodb from "mongodb";
import uploadImageToDrive from "./imageDriveDAO.js";
const ObjectId = mongodb.ObjectId
let storeItems

export default class StoreItemDAO {
    static async injectDB(conn) {
        if (storeItems) {
            return
        }
        try {
            storeItems = await conn.db(process.env.STOREITEMS_NS).collection("store_items");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in StoreItemDAO: ${e}`,
            )
        }
    }

    static async getItemsByCategory(category) {
        let query = {"category": category};

        let cursor

        try {
            cursor = await storeItems.find(query);
        } catch (e) {
            console.error(`Unable to find command, ${e}`)
            return [];
        }

        try {
            const response = await cursor.toArray();
            return response;
        } catch (e) {
            console.error(`Unable to convert cursor to array: ${e}`);
        }

    
    }

    static async addItem(
        fileObject,
        bufferStream,
        name,
        description,
        category,
        mediumArray,
        date
        ) {
        let imageID
        try {
            const {data} = await uploadImageToDrive(fileObject, bufferStream);
            imageID = data.id;
            console.log(data);
        } catch (error) {
            console.error(`Problem uploading file to drive: ${error}`);
            return {error: error};
        }

        
        
        try {
            const itemDoc = {
                name: name,
                description: description,
                category: category,
                mediums: mediumArray,
                image: `https://drive.google.com/uc?id=${imageID}`,
                date: date,
            }
            return await storeItems.insertOne(itemDoc);
        } catch (e) {
            console.error(`Unable to add item: ${e}`);
            return {error: e};
        }

    }

    // TODO: remove comments from mediumArray portions
    static async updateItem(
        id,
        name,
        description,
        category,
        // mediumArray,
        date
    ) {
        try {
            const updateResponse = await storeItems.updateOne(
                {_id: new ObjectId(id)},
                {$set: {
                    name: name,
                    description: description,
                    category: category,
                    // mediumArray: mediumArray,
                    date: date
                }}
            )
            return updateResponse
        } catch (e) {
            console.error(`Unable to update the item: ${e}`);
            return { error: e}
        }
    }

    static async deleteItem(id) {
        try {
            const deleteResponse = await storeItems.deleteOne({_id: new ObjectId(id)});
            return deleteResponse;
        } catch (error) {
            console.error(`Unable to delete item: ${error}`);
            return {error: error};
        }
    }
}