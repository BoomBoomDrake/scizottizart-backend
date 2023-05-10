import StoreItemDAO from "../dao/storeItemDAO.js";
import stream from "stream";

export default class StoreItemController {

    static async apiGetItems(req, res, next) {

        let response;

        if (req.query.all) {
            response = await StoreItemDAO.getItems("all");
        } else {
            response = await StoreItemDAO.getItems(req.query);
        }

        res.json({items: response});
    }
    
    static async apiGetItemsByCategory(req, res, next) {
        const response = await StoreItemDAO.getItemsByCategory(req.params.category)
        res.json({items: response});
    }

    static async apiAddItem(req, res, next) {
        const defaultMediums = [
            {
              name: 'William Turner Paper',
              finishes: [
                {
                  name: 'None',
                  sizes: {
                    '5x7': 4000,
                    '8x10': 5000,
                    '11x17': 8000
                  }
                },
                {
                  name: 'Matte',
                  sizes: {
                    '8x10': 4000,
                    '11x14': 5000,
                    '16x20': 8000
                  }
                }
              ]
            },
            {
              name: 'Canvas',
              finishes: [
                {
                  name: 'Satin',
                  sizes: {
                    '5x7': 4500,
                    '8x10': 6000,
                    '11x17': 9000,
                    '18x24': 13000
                  }
                },
                {
                  name: 'Matte',
                  sizes: {
                    '5x7': 4500,
                    '8x10': 6000,
                    '11x17': 9000,
                    '18x24': 13000
                  }
                }
              ]
            }
          ]

        try {

            const { body, files } = req;
            const name = body.name;
            const category = body.category;
            const mediumArray = defaultMediums;
            const date = new Date();

            const fileObject = files[0]

            const response = await StoreItemDAO.addItem(
                fileObject,
                name,
                category,
                mediumArray,
                date,
            )
            console.log(response);
            res.json(response);
        } catch (e) {
            console.error(e.message);
        }
    }

    static async apiUpdateItem(req, res, next) {
        try {

            let updateResponse;

            const { body, files } = req;
            const id = body._id;
            const name = body.name;
            const category = body.category;
            const date = new Date();

            const fileObject = files[0] ? files[0] : "No File";
            const bufferStream = new stream.PassThrough();

            if (fileObject === "No File") {
                updateResponse = await StoreItemDAO.updateItem(
                    id,
                    name,
                    category,
                    date,
                );
            } else {
                bufferStream.end(fileObject.buffer);
                updateResponse = await StoreItemDAO.updateItemWithImage(
                    id,
                    name,
                    category,
                    date,
                    fileObject,
                    bufferStream,
                )
            }

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
            console.log(req.params.id);
            const response = await StoreItemDAO.deleteItem(req.params.id)
            res.json(response);
        } catch (e) {
            console.log(e); 
            res.status(500).json({error: e.message});
        }
    }

    
}