import { useState } from "react";
import "../styles/admin.scss";

function ProductForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.image || !form.category) {
      alert("Please fill all fields");
      return;
    }
    onSubmit(form);
    setForm({ name: "", description: "", image: "", category: "" });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
      />
      <input
        type="text"
        name="category"
        placeholder="Category (e.g. Shoes, Jackets)"
        value={form.category}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      ></textarea>
      <button type="submit" className="btn-primary">Add Product</button>
    </form>
  );
}

export default ProductForm;
