const categoryModel = require("../models/categoryModel");
let { getCurrentIPAddress } = require("../uitls/utils");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { port, adminSecretKey } = require("../config/config");
const { isValidObjectId } = require("mongoose");
const logger = require("../config/logger.config");

// ADD CATEGORY
const addCategory = async (req, res) => {
    try {
        let { key } = req.params;

        if (!key) {
            return res.status(400).send({
                status: false,
                message: "key is required"
            });
        };

        if (key !== adminSecretKey) {
            return res.status(401).send({
                status: false,
                message: "Not authorized"
            });
        };

        let { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        };

        let { File_Extension, File_Path, File_data, File_name } = req.body.FileUpload;

        let decodedData = Buffer.from(File_data, "base64");

        let categoryImgFolder = path.join(__dirname, "..", "..", "categoryImages");

        if (!fs.existsSync(categoryImgFolder)) {
            fs.mkdirSync(categoryImgFolder);
        }

        let currentIpAddress = getCurrentIPAddress();
        let imgRelativePath = "/categoryImages/";
        let imgUniqName = uuid.v4() + File_Extension;
        let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(__dirname, "..", "..", "categoryImages", imgUniqName);

        fs.writeFileSync(imgSavingPath, decodedData);

        let imgObj = {
            fileName: imgUniqName,
            filePath: imgFullUrl,
        };

        let categoryObj = {
            name,
            description,
            category_image: imgObj,
        };

        let newCategory = await categoryModel.create(categoryObj);

        return res.status(200).send({
            status: true,
            message: "Category Added",
            data: newCategory,
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in addCategory API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    };
};

// GET CATEGORY BY CATEGORY ID
const getCategoryById = async (req, res) => {
    try {
        let { categoryId } = req.params;

        let category;
        if (categoryId) {
            if (!isValidObjectId(categoryId)) {
                return res.status(400).send({ status: false, message: "Invalid category Id"});
            }
            category = await categoryModel.findById(categoryId);
        };

        if (!category) {
            return res.status(200).send({ status: true, message: "Category Not Found" });
        };

        let allProducts = await productModel.find({ category: category._id });

        return res.status(200).send({
            status: true,
            message: "Success",
            data: category,
            products: allProducts,
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in getCategoryById API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    };
};


// GET CATEGORY BY SERVICE SEARCH {allProductSearchByKeywords}
const getProductByKeywords  = async (req, res) => {
    try {
        let { service_search } = req.body;
        if (!service_search) {
            return res.status(400).send({ status: false, message: "Search parameter is required"});
        };

        let filter = {
            $or: [
            { name: { $regex: service_search, $options: "i" } },
            { subTitle: { $regex: service_search, $options: "i" } }, 
            { description: { $regex: service_search, $options: "i" } }
            ],
        };

        let products = await productModel.find(filter);

        return res.status(200).send({
            status: true,
            message: "Success",
            products: products,
        });

    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in getProductByKeywords API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    }
};


// GET ALL CATEGORIES
const getAllCategories = async (req, res) => {
    try {
        let { key } = req.params;
        if (!key) {
            return res.status(400).send({ status: false, message: "Bad Request!!!" });
        };

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        };

        let allCategories = await categoryModel.find({});

        return res.status(200).send({
            status: true,
            message: "Success",
            data: allCategories,
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in getAllCategories API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    };
};

// UPDATE CATEGORY BY CATEGORY ID
const updateCategory = async (req, res) => {
    try {
        let { key } = req.params;
        if (!key) {
            return res.status(400).send({ status: false, message: "Bad Request!!!" });
        };

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        };

        let { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).send({ status: false, message: "Category Id is required" });
        };

        if (!isValidObjectId(categoryId)) {
            return res.status(400).send({ status: false, message: "Invalid Category Id" });
        };

        let category = await categoryModel.findById(categoryId);

        if (!category) {
            return res.status(404).send({ status: false, message: "Category Not Found" });
        };

        let reqBody = req.body;

        if ("name" in reqBody) {
            category.name = reqBody.name;
        };

        if ("description" in reqBody) {
            category.description = reqBody.description;
        };

        if ("FileUpload" in reqBody) {
            let { File_Extension, File_Path, File_data, File_name } = req.body.FileUpload;

            // console.log("reqbody: ", reqBody);

            let decodedData = Buffer.from(File_data, "base64");

            let currentIpAddress = getCurrentIPAddress();
            let imgRelativePath = "/categoryImages/";
            let imgUniqName = uuid.v4() + File_Extension;
            let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
            let imgSavingPath = path.join(__dirname, "..", "..", "categoryImages", imgUniqName);

            let oldImgName = category.category_image.fileName;
            let oldImgPath = path.join(__dirname, "..", "..", "categoryImages", oldImgName);
            
            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            };

            fs.writeFileSync(imgSavingPath, decodedData);

            let newImgObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };

            category.category_image = newImgObj;
        };

        await category.save();

        return res.status(200).send({
            status: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in updateCategory API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    };
};


// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        let { key } = req.params;
        if (!key) {
            return res.status(400).send({ status: false, message: "Bad Request!!!" });
        };

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        };
        
        let { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).send({ status: false, message: "CategoryId is required" });
        };

        let category = await categoryModel.findById(categoryId);

        if (!category) {
            return res.status(404).send({ status: false, message: "No category found with this category Id"})
        };

        await categoryModel.deleteOne({ _id: categoryId });

        return res.status(200).send({
            status: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        let metadata = {
            stack: error.stack,
            details: error.details || "No additional details provided",
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.originalUrl,
        };

        logger.error(`Error in deleteCategory API: ${error.message}`, { meta: metadata });
        return res.status(400).send({ status: false, message: error.message });
    };
};


module.exports = {
    addCategory,
    getCategoryById,
    getProductByKeywords,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
