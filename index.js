import dotenv from "dotenv";
import mongodb from "mongodb";
import app from "./server.js";
import StoreItemDAO from "./dao/storeItemDAO.js";
dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;
const fixieData = process.env.FIXIE_SOCKS_HOST.split(new RegExp('[/(:\\/@/]+'));

const environment = process.env.NODE_ENV;

if (environment === "test") {
    MongoClient.connect(
        process.env.STOREITEMS_DB_URI,
        {
            maxPoolSize: 50,
            wtimeoutMS: 2500,
        }
    )
    .catch(err => {
        console.log(err.stack);
        process.exit(1);
    })
    .then(async client => {
        await StoreItemDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`Listening on port ${port}.`);
        });
    });
} else if (environment === "production") {
    MongoClient.connect(
        process.env.STOREITEMS_DB_URI,
        {
            maxPoolSize: 50,
            wtimeoutMS: 2500,
            proxyUsername: fixieData[0],
            proxyPassword: fixieData[1],
            proxyHost: fixieData[2],
            proxyPort: fixieData[3]
        }
    )
    .catch(err => {
        console.log(err.stack);
        process.exit(1);
    })
    .then(async client => {
        await StoreItemDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`Listening on port ${port}.`);
        });
    });
} else {
    console.log("Error with node environment variable");
}

