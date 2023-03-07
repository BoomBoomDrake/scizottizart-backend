import StoreItemDAO from "../dao/storeItemDAO.js";
import stream from "stream";

export default class StoreItemController {
    static async apiGetItemsByCategory(req, res, next) {
        const response = await StoreItemDAO.getItemsByCategory(req.params.category)
        res.json({items: response});
    }

    static async apiAddItem(req, res, next) {
        try {
            const { body, files } = req
            const name = body.name
            const description = body.description
            const category = body.category

            const medium1 = {
                name: body.medium1[0],
                sizes: body.medium1.filter((size) => {
                    if (body.medium1.indexOf(size) % 2 !== 0) {
                        return size
                    }
                }),
                prices: body.medium1.filter((price) => {
                    if (body.medium1.indexOf(price) % 2 == 0 && body.medium1.indexOf(price) !== 0) {
                        return price
                    }
                }),
            }
    
            const medium2 = {
                name: body.medium2[0],
                sizes: body.medium2.filter((size) => {
                    if (body.medium2.indexOf(size) % 2 !== 0) {
                        return size
                    }
                }),
                prices: body.medium2.filter((price) => {
                    if (body.medium2.indexOf(price) % 2 == 0 && body.medium2.indexOf(price) !== 0) {
                        return price
                    }
                }),
            }

            const mediumArray = [medium1, medium2];
            const date = new Date();

            const fileObject = files[0]
            const bufferStream = new stream.PassThrough();
            bufferStream.end(fileObject.buffer);

            const response = await StoreItemDAO.addItem(
                fileObject,
                bufferStream,
                name,
                description,
                category,
                mediumArray,
                date,
            )

            console.log(medium1, medium2);
            res.json(response);
        } catch (e) {
            console.error(e.message);
        }
    }

    // TODO: remove comments on mediumArray portion after front end connection
    static async apiUpdateItem(req, res, next) {
        try {
            const id = req.body.id
            const name = req.body.name
            const description = req.body.description
            const category = req.body.category

            // const medium1 = {
            //     name: body.medium1[0],
            //     sizes: body.medium1.filter((size) => {
            //         if (body.medium1.indexOf(size) % 2 !== 0) {
            //             return size
            //         }
            //     }),
            //     prices: body.medium1.filter((price) => {
            //         if (body.medium1.indexOf(price) % 2 == 0 && body.medium1.indexOf(price) !== 0) {
            //             return price
            //         }
            //     }),
            // }
    
            // const medium2 = {
            //     name: body.medium2[0],
            //     sizes: body.medium2.filter((size) => {
            //         if (body.medium2.indexOf(size) % 2 !== 0) {
            //             return size
            //         }
            //     }),
            //     prices: body.medium2.filter((price) => {
            //         if (body.medium2.indexOf(price) % 2 == 0 && body.medium2.indexOf(price) !== 0) {
            //             return price
            //         }
            //     }),
            // }

            // const mediumArray = [medium1, medium2];
            const date = new Date();

            const updateResponse = await StoreItemDAO.updateItem(
                id,
                name,
                description,
                category,
                // mediumArray,
                date
            )

            var { error } = updateResponse
            if (error) {
                res.status(400).json({error})
            }

            if (updateResponse.modifiedCount === 0) {
                throw new Error(
                    "Unable to update item: modified count error",
                )
            }

            res.json(updateResponse);


        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    static async apiDeleteItem(req, res, next) {
        try {
            const id = req.body.id;
            const deleteResponse = await StoreItemDAO.deleteItem(id);
            res.json(deleteResponse);
        } catch (e) {
            res.status(500).json({error: e.message});
        }
    }

    
}