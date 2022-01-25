const Food = require('../model/food');
const User = require('../model/user');
const mongoose = require('mongoose');
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const { google } = require('googleapis');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs');


const secretAccessKey = process.env.CLIENT_SECRET;
const accessKeyId = process.env.CLIENT_ID;

const redirect_uri = process.env.REDIRECT_URI;
const refresh_token = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    accessKeyId,
    secretAccessKey,
    redirect_uri
)

oauth2Client.setCredentials({ refresh_token: refresh_token });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

async function uploadFile(file) {
    try {
        const res = await drive.files.create({
            requestBody: {
                name: file.originalname,
                mimeType: file.mimetype
            },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path)
            }
        })
        await drive.permissions.create({
            fileId: res.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        return res.data;
        // generatePublicUrl(res.data.id, foodItem);
    } catch (err) {
        console.log(err.message)
    }
}

async function deleteFile(fileId) {
    try {
        const res = await drive.files.delete({
            fileId: fileId
        });
        console.log('File Successfully Deleted')
    } catch (err) {
        console.log(err.message)
    }
}

const foodController = {
    getIndivItemPage: function (req, res) {
        const { itemID } = req.params;

        // Check if logged in
        // if (req.session.username) {
        Food.findOne({ _id: itemID }, function (err, result) {
            if (err) throw err
            if (result) {
                var body = {
                    Username: req.session.username,
                    Food: result
                }
                res.render('indivitem.hbs', body);
            }
        })
        // }
        // else {
        //     res.redirect('login.hbs');
        // }

    },

    getMenuPage: function (req, res) {
        const { category } = req.query;
        var body = {
            Username: req.session.username,
            Category: category
        }
        res.render('menu.hbs', body);
    },

    getBundleMeals: function (req, res) {
        const { category } = req.query;
        var body = {
            Username: req.session.username,
            Category: category
        }
        res.render('bundlemeals.hbs', body);
    },

    addFood: async function (req, res) {
        const { FoodName, Price, Description, Category } = req.body;

        try {
            var fileID = await uploadFile(req.file);
            console.log(fileID);
            var ImagePath = `https://drive.google.com/uc?export=view&id=${fileID.id}`

            const newFood = new Food({
                FoodName: FoodName,
                Price: Price,
                Description: Description,
                Category: Category,
                isAvailable: true,
                ImagePath: ImagePath
            });

            newFood.save(function (err) {
                if (err) throw err
                else
                    //res.send('Success');
                    res.redirect('/admin');
            });
        } catch (err) {
            if (err) throw err;
        }
    },

    getMenu: async function (req, res) {
        try {
            // const menu = await Food.find().lean({ virtuals: true });
            const menu = await Food.find();
            res.send(menu);
        } catch (err) {
            if (err) throw err;
        }
    },

    getBundle: async function (req, res) {
        try {
            const menu = await Food.find({ Category: 'Bundle Meal' });
            res.send(menu);
        } catch (err) {
            if (err) throw err;
        }
    },

    updateItem: function (req, res) {
        const { itemID } = req.params;
        const { FoodName, Price, Description, Category, isAvailable } = req.body;
        const update = {
            FoodName: FoodName,
            Price: Price,
            Description: Description,
            Category: Category,
            isAvailable: isAvailable
        };


        Food.updateOne({ _id: itemID }, update, function (err, update) {
            if (err) throw err;
            if (update) {
                /* If the item is set to unavailable, remove it from all of the 
                   user's carts */
                if (isAvailable == 'false') {
                    const result = removeItemFromCart(itemID);
                    if (result)
                        console.log('item removed from cart')
                }
                res.send('Success');
            }
        });
    },

    removeItem: function (req, res) {

        const { itemID } = req.params;
        const { imageID } = req.body;

        Food.findOneAndRemove({ _id: itemID }, function (err, result) {
            if (err) throw err
            if (result) {
                deleteFile(imageID);
                res.send('Sucess');
            }
        });

    }
}

async function removeItemFromCart(foodID) {
    try {
        const result = await User.updateMany({},
            { $pull: { Cart: { ItemID: foodID } } },
            { multi: true });
        return true
    } catch (err) {
        return false
    }

}

module.exports = foodController;
