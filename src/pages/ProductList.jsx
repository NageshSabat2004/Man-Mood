import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/product.scss";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];

    setProducts(savedProducts);
    setCategories(savedCategories.length ? savedCategories : [""]);
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      filterCategory === "All" || p.category === filterCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="products-page">
      <div className="admin-login-btn">
    <button onClick={() => window.location.href = "/login"}>
      Admin Login
    </button>
  </div>
  
      <div className="logo">
        <img src="/Group.svg"></img>
        <h1>Men Mood</h1>
      </div>

      {/* Filter + Search */}
      <div className="filter-bar">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option>All</option>
          {categories.map((cat, i) => (
            <option key={i}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Animated Product Cards */}
      <motion.div
        className="products-grid"
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))
          ) : (
            <p className="no-data">No matching products found</p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
