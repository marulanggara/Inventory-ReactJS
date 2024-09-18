const express = require("express");
const db = require("./config/database");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Buat endpoint
// GET Products with categories
app.get("/products", async (req, res) => {
    try {
        const products = await db.query(`
            SELECT tb_products.*, tb_categories.name AS category_name
            FROM tb_products
            LEFT JOIN tb_categories 
            ON tb_products.category_id = tb_categories.id
        `);
        res.json(products[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching products" });
    }
});

// POST Product untuk tambah product
app.post("/products", async (req, res) => {
    try {
        const { code_products, no_bpom, name, stock, expired_date, category_id } = req.body;
        const result = await db.query(`
            INSERT INTO tb_products
            (code_products, no_bpom, name, stock, expired_date, category_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [code_products, no_bpom, name, stock, expired_date, category_id]);
        res.json({ message: "Product added successfully", productId: result.insertId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while adding product" });
    }
});

// GET Categories
app.get("/categories", async (req, res) => {
    try {
        const categories = await db.query("SELECT * FROM tb_categories");
        res.json(categories[0]);
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})