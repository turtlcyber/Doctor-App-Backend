const express = require('express');
const router = express.Router();

const { 
    addCategory, 
    getCategoryById,
    getProductByKeywords,
    getAllCategories,
    updateCategory,
    deleteCategory,
 } = require('../../controllers/categoryController');

// ADD CATEGORY
router.post("/api/v1/addCategory/:key", addCategory);

// GET CATEGORY BY ID
router.post("/api/v1/viewService/:categoryId", getCategoryById);

// SEARCH PRODUCTS BY KEYWORDS
router.post("/api/v1/allProductSearchByKeywords", getProductByKeywords);

// GET ALL CATEGORIES
router.get("/api/v1/getAllCategories/:key", getAllCategories);

// UPDATE CATEGORY
router.put("/api/v1/updateCategory/:key/:categoryId", updateCategory);

// DELETE CATEGORY
router.delete("/api/v1/deleteCategory/:key/:categoryId", deleteCategory);


module.exports = router;