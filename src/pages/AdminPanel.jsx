import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { nanoid } from "nanoid";
import "../styles/admin.scss";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", category: "", image: "", link: "" });
  const [newCategory, setNewCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(snapshot.docs.map(doc => ({
        docId: doc.id,
        id: doc.data().id,
        ...doc.data()
      })));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
    setCategories(savedCategories.length ? savedCategories : ["Shirts", "Shoes", "Trousers"]);
  }, []);

  const saveCategories = (items) => {
    setCategories(items);
    localStorage.setItem("categories", JSON.stringify(items));
  };

  // Add / Update Product
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category) return alert("Fill all fields");

    try {
      if (editingProduct) {
        const productRef = doc(db, "products", editingProduct.docId);
        await updateDoc(productRef, { ...newProduct });
        setEditingProduct(null);
      } else {
        await addDoc(collection(db, "products"), { ...newProduct, id: nanoid(6) });
      }
      await fetchProducts();
      setNewProduct({ name: "", category: "", image: "", link: "" });
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Delete Product
  const deleteProduct = async (docId) => {
    try {
      await deleteDoc(doc(db, "products", docId));
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Edit Product
  const editProduct = (product) => {
    setNewProduct({ name: product.name, category: product.category, image: product.image, link: product.link });
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add / Delete Category
  const addCategory = () => {
    if (!newCategory.trim()) return;
    const updated = [...categories, newCategory.trim()];
    saveCategories(updated);
    setNewCategory("");
  };
  const deleteCategory = (cat) => {
    const updated = categories.filter((c) => c !== cat);
    saveCategories(updated);
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      {/* Add / Edit Product */}
      <div className="form">
        <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
          <option value="">Select Category</option>
          {categories.map((c, i) => <option key={i}>{c}</option>)}
        </select>
        <input placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
        <input placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
        <input placeholder="Visit Link" value={newProduct.link} onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })} />
        <button onClick={addProduct}>{editingProduct ? "Update Product" : "Add Product"}</button>
      </div>

      {/* Category CRUD */}
      <div className="category-crud">
        <h2>Categories</h2>
        <div className="cat-list">
          {categories.map((c, i) => (
            <span key={i} className="cat-item">
              {c} <button onClick={() => deleteCategory(c)}><i className="ri-delete-bin-line"></i></button>
            </span>
          ))}
        </div>
        <div className="cato">
          <input placeholder="New Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          <button onClick={addCategory}>Add Category</button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="toolbar">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option>All</option>
          {categories.map((cat, i) => <option key={i}>{cat}</option>)}
        </select>
        <input type="text" placeholder="Search by Name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((p) => (
          <motion.div key={p.docId} className="admin-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p><strong>ID:</strong> {p.id}</p>
            <p><strong>Category:</strong> {p.category}</p>
            <div className="btn-group">
              <a href={p.link} target="_blank" rel="noreferrer" className="visit-btn">
                <button><i className="ri-link"></i></button>
              </a>
              <button className="edit-btn" onClick={() => editProduct(p)}><i className="ri-pencil-line"></i></button>
              <button className="delete-btn" onClick={() => deleteProduct(p.docId)}><i className="ri-delete-bin-line"></i></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}







// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
// import { db } from "../firebase";
// import "../styles/admin.scss";

// export default function AdminPanel() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [search, setSearch] = useState("");
//   const [newProduct, setNewProduct] = useState({ name: "", category: "", image: "", link: "" });
//   const [newCategory, setNewCategory] = useState("");
//   const [editingProduct, setEditingProduct] = useState(null);

//   // Fetch products from Firestore
//   const fetchProducts = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, "products"));
//       setProducts(snapshot.docs.map(doc => ({
//         docId: doc.id,
//         id: doc.data().id || doc.id,
//         ...doc.data()
//       })));
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
//     setCategories(savedCategories.length ? savedCategories : ["Shirts", "Shoes", "Trousers"]);
//   }, []);

//   const saveCategories = (items) => {
//     setCategories(items);
//     localStorage.setItem("categories", JSON.stringify(items));
//   };

//   // Add / Update Product
//   const addProduct = async () => {
//     if (!newProduct.name || !newProduct.category) return alert("Fill all fields");

//     try {
//       if (editingProduct) {
//         const productRef = doc(db, "products", editingProduct.docId);
//         await updateDoc(productRef, { ...newProduct });
//         setEditingProduct(null);
//       } else {
//         await addDoc(collection(db, "products"), { ...newProduct, id: Date.now() });
//       }
//       await fetchProducts();
//       setNewProduct({ name: "", category: "", image: "", link: "" });
//     } catch (error) {
//       console.error("Error saving product:", error);
//     }
//   };

//   // Delete Product
//   const deleteProduct = async (docId) => {
//     try {
//       await deleteDoc(doc(db, "products", docId));
//       await fetchProducts();
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   // Edit Product
//   const editProduct = (product) => {
//     setNewProduct({ name: product.name, category: product.category, image: product.image, link: product.link });
//     setEditingProduct(product);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Add / Delete Category
//   const addCategory = () => {
//     if (!newCategory.trim()) return;
//     const updated = [...categories, newCategory.trim()];
//     saveCategories(updated);
//     setNewCategory("");
//   };
//   const deleteCategory = (cat) => {
//     const updated = categories.filter((c) => c !== cat);
//     saveCategories(updated);
//   };

//   const filteredProducts = products.filter((p) => {
//     const matchCategory = filterCategory === "All" || p.category === filterCategory;
//     const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || String(p.id).toLowerCase().includes(search.toLowerCase());
//     return matchCategory && matchSearch;
//   });

//   return (
//     <div className="admin-panel">
//       <h1>Admin Panel</h1>

//       {/* Add / Edit Product */}
//       <div className="form">
//         <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
//           <option value="">Select Category</option>
//           {categories.map((c, i) => <option key={i}>{c}</option>)}
//         </select>
//         <input placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
//         <input placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
//         <input placeholder="Visit Link" value={newProduct.link} onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })} />
//         <button onClick={addProduct}>{editingProduct ? "Update Product" : "Add Product"}</button>
//       </div>

//       {/* Category CRUD */}
//       <div className="category-crud">
//         <h2>Categories</h2>
//         <div className="cat-list">
//           {categories.map((c, i) => (
//             <span key={i} className="cat-item">
//               {c} <button onClick={() => deleteCategory(c)}><i className="ri-delete-bin-line"></i></button>
//             </span>
//           ))}
//         </div>
//         <div className="cato">
//           <input placeholder="New Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
//           <button onClick={addCategory}>Add Category</button>
//         </div>
//       </div>

//       {/* Search + Filter */}
//       <div className="toolbar">
//         <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
//           <option>All</option>
//           {categories.map((cat, i) => <option key={i}>{cat}</option>)}
//         </select>
//         <input type="text" placeholder="Search by Name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
//       </div>

//       {/* Products Grid */}
//       <div className="products-grid">
//         {filteredProducts.map((p) => (
//           <motion.div key={p.docId} className="admin-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
//             <img src={p.image} alt={p.name} />
//             <h3>{p.name}</h3>
//             <p><strong>ID:</strong> {p.id}</p>
//             <p><strong>Category:</strong> {p.category}</p>
//             <div className="btn-group">
//               <a href={p.link} target="_blank" rel="noreferrer" className="visit-btn">
//                 <button><i className="ri-link"></i></button>
//               </a>
//               <button className="edit-btn" onClick={() => editProduct(p)}><i className="ri-pencil-line"></i></button>
//               <button className="delete-btn" onClick={() => deleteProduct(p.docId)}><i className="ri-delete-bin-line"></i></button>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }














// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
// import { db } from "../firebase";
// import "../styles/admin.scss";

// export default function AdminPanel() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [search, setSearch] = useState("");
//   const [newProduct, setNewProduct] = useState({ name: "", category: "", image: "", link: "" });
//   const [newCategory, setNewCategory] = useState("");
//   const [editingProduct, setEditingProduct] = useState(null);

//   // Fetch products from Firestore
//   const fetchProducts = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, "products"));
//       setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
//     setCategories(savedCategories.length ? savedCategories : ["Shirts", "Shoes", "Trousers"]);
//   }, []);

//   // Save categories in localStorage
//   const saveCategories = (items) => {
//     setCategories(items);
//     localStorage.setItem("categories", JSON.stringify(items));
//   };

//   // Add / Update Product
//   const addProduct = async () => {
//     if (!newProduct.name || !newProduct.category) return alert("Fill all fields");

//     try {
//       if (editingProduct) {
//         const productRef = doc(db, "products", editingProduct.id);
//         await updateDoc(productRef, newProduct);
//         setEditingProduct(null);
//       } else {
//         await addDoc(collection(db, "products"), newProduct);
//       }
//       await fetchProducts();
//       setNewProduct({ name: "", category: "", image: "", link: "" });
//     } catch (error) {
//       console.error("Error saving product:", error);
//     }
//   };

//   // Delete Product
//   const deleteProduct = async (id) => {
//     try {
//       await deleteDoc(doc(db, "products", id));
//       await fetchProducts();
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   // Edit Product
//   const editProduct = (product) => {
//     setNewProduct(product);
//     setEditingProduct(product);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Add Category
//   const addCategory = () => {
//     if (!newCategory.trim()) return;
//     const updated = [...categories, newCategory.trim()];
//     saveCategories(updated);
//     setNewCategory("");
//   };

//   // Delete Category
//   const deleteCategory = (cat) => {
//     const updated = categories.filter((c) => c !== cat);
//     saveCategories(updated);
//   };

//   const filteredProducts = products.filter((p) => {
//     const matchCategory = filterCategory === "All" || p.category === filterCategory;
//     const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toString().includes(search.toLowerCase());
//     return matchCategory && matchSearch;
//   });

//   return (
//     <div className="admin-panel">
//       <h1>Admin Panel</h1>

//       {/* Add / Edit Product */}
//       <div className="form">
//         <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
//           <option value="">Select Category</option>
//           {categories.map((c, i) => <option key={i}>{c}</option>)}
//         </select>
//         <input placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
//         <input placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
//         <input placeholder="Visit Link" value={newProduct.link} onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })} />
//         <button onClick={addProduct}>{editingProduct ? "Update Product" : "Add Product"}</button>
//       </div>

//       {/* Category CRUD */}
//       <div className="category-crud">
//         <h2>Categories</h2>
//         <div className="cat-list">
//           {categories.map((c, i) => (
//             <span key={i} className="cat-item">
//               {c} <button onClick={() => deleteCategory(c)}><i className="ri-delete-bin-line"></i></button>
//             </span>
//           ))}
//         </div>
//         <div className="cato">
//           <input placeholder="New Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
//           <button onClick={addCategory}>Add Category</button>
//         </div>
//       </div>

//       {/* Search + Filter */}
//       <div className="toolbar">
//         <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
//           <option>All</option>
//           {categories.map((cat, i) => <option key={i}>{cat}</option>)}
//         </select>
//         <input type="text" placeholder="Search by Name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
//       </div>

//       {/* Products Grid */}
//       <div className="products-grid">
//         {filteredProducts.map((p) => (
//           <motion.div key={p.id} className="admin-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
//             <img src={p.image} alt={p.name} />
//             <h3>{p.name}</h3>
//             <p><strong>ID:</strong> {p.id}</p>
//             <p><strong>Category:</strong> {p.category}</p>
//             <div className="btn-group">
//               <a href={p.link} target="_blank" rel="noreferrer" className="visit-btn">
//                 <button><i className="ri-link"></i></button>
//               </a>
//               <button className="edit-btn" onClick={() => editProduct(p)}><i className="ri-pencil-line"></i></button>
//               <button className="delete-btn" onClick={() => deleteProduct(p.id)}><i className="ri-delete-bin-line"></i></button>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }
