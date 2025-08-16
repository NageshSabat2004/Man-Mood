import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/product.scss";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productSnapshot = await getDocs(collection(db, "products"));
        const productsData = productSnapshot.docs.map(doc => ({
          docId: doc.id,            // Firestore doc ID for edits/deletes
          id: doc.data().id,        // short ID for display/search
          ...doc.data()
        }));
        setProducts(productsData);

        const uniqueCategories = [...new Set(productsData.map(p => p.category))];
        setCategories(uniqueCategories.length ? uniqueCategories : [""]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = filterCategory === "All" || p.category === filterCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="products-page">

      {/* Logo */}
      <div className="logo">
        <img src="/Group.svg" alt="logo" />
        <h1>Men Mood</h1>
      </div>

      {/* Filter + Search */}
      <div className="filter-bar">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option>All</option>
          {categories.map((cat, i) => <option key={i}>{cat}</option>)}
        </select>

        <input
          type="text"
          placeholder="Search by name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Grid */}
      <motion.div className="products-grid" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <AnimatePresence>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <motion.div
                key={p.docId}
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
