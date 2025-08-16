import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/product.scss";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      const list = JSON.parse(saved);
      const found = list.find((p) => p.id === Number(id));
      setProduct(found);
    }
  }, [id]);

  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container product-detail">
      <button onClick={() => navigate(-1)} className="btn-primary">← Back</button>
      <div className="detail-box">
        <img src={product.image} alt={product.name} />
        <div className="detail-content">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <span className="category">{product.category}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
