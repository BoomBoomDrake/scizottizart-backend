import mongodb from "mongodb";
import {uploadImageToDrive, deleteImageFromDrive} from "./imageDriveDAO.js";
import bucket from "./gcloudDAO.js";
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

    static async getItems(query) {
        let cursor;

        if (query === "all") {
            try {
                cursor = await storeItems.find();
            } catch (e) {
                console.error(`Unable to complete search: ${e}`)
                return [];
            }
        } else {
            try {
                cursor = await storeItems.find(query);
            } catch (e) {
                console.error(`Unable to complete search: ${e}`);
            }
        }

        try {
            const response = await cursor.toArray();
            return response
        } catch (e) {
            console.error(`Unable to convert cursor to array: ${e}`);
            return {error: e};
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
        name,
        category,
        mediumArray,
        date
        ) {
        const id = new ObjectId();
        const fileName = `${id}.${fileObject.originalname.split(".")[1]}`;

        try {
            const file = bucket.file(fileName);
            file.save(fileObject.buffer, {
                contentType: fileObject.mimetype
            },(err) => {
                if (err) {
                    console.error(`Error during cloud storage upload: ${err}`);
                    return {error: err};
                }
            });
        } catch (error) {
            console.error(`Error during cloud storage upload: ${error}`);
            throw new Error(error);
        }
        
        try {
            const itemDoc = {
                _id: new ObjectId(id),
                name: name,
                img: `https://ik.imagekit.io/scizottizart/${fileName}`,
                category: category,
                date: date,
                mediums: mediumArray,
            }
            return await storeItems.insertOne(itemDoc);
        } catch (e) {
            console.error(`Unable to add item: ${e}`);
            return {error: e};
        }

    }

    static async updateItem(
        id,
        name,
        category,
        date
    ) {
        try {
            const updateResponse = await storeItems.updateOne(
                {_id: new ObjectId(id)},
                {$set: {
                    name: name,
                    category: category,
                    date: date
                }}
            )
            return updateResponse
        } catch (e) {
            console.error(`Unable to update the item: ${e}`);
            return { error: e}
        }
    }

    static async updateItemWithImage(
        id,
        name,
        category,
        date,
        fileObject,
        bufferStream,
    ) {
        let item = await this.getItems({_id: new ObjectId(id)})
        let currentImg = item[0].img.slice(item[0].img.indexOf("=") + 1)
        let driveResponse;

        try {
            driveResponse = await deleteImageFromDrive(currentImg);
        } catch (error) {
            console.log(error);
            return {error: error};
        }


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
            const updateResponse = await storeItems.updateOne(
                {_id: new ObjectId(id)},
                {$set: {
                    name: name,
                    category: category,
                    img: `https://drive.google.com/uc?id=${imageID}`,
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
        let item = await this.getItems({_id: new ObjectId(id)})
        let currentImg = item[0].img.slice(item[0].img.indexOf("=") + 1)
        let driveResponse;

        try {
            driveResponse = await deleteImageFromDrive(currentImg);
        } catch (error) {
            console.log(error);
            return {error: error};
        }

        try {
            const deleteResponse = await storeItems.deleteOne({_id: new ObjectId(id)});
            return deleteResponse;
        } catch (error) {
            console.error(`Unable to delete item: ${error}`);
            return {error: error};
        }
    }
}