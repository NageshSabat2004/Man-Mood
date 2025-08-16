import { Link } from "react-router-dom";
import "../styles/product.scss";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <div className="card-content">
        <h3>{product.name}</h3>
        <p className="product-id">ID: {product.id}</p>
        <p>{product.category}</p>

        <div className="card-actions">

          {/* External Visit link */}
          {product.link && (
            <a
              href={product.link}
              target="_blank"
              rel="noreferrer"
              className="btn visit-btn"
            >
              <i class="ri-arrow-right-line"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
