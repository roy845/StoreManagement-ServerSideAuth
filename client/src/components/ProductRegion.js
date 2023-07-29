import React from "react";
import CustomerRegion from "./CustomerRegion";
import { Link } from "react-router-dom";

const ProductRegion = ({ product }) => {
  const { Name, Price, Quantity } = product;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* First Region: Product Data */}
      <div
        style={{
          marginTop: "15px",
          border: "2px solid blue",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <h3>
          <Link
            to={`/editProduct/${product.id}`}
            style={{
              textDecoration: "none",
              color: Quantity === 0 ? "red" : "black",
            }}
          >
            {Name}
          </Link>
        </h3>
        <p
          style={{
            color: Quantity === 0 ? "red" : "black",
          }}
        >
          <strong>Price:</strong> {Price} ₪
        </p>
        <p
          style={{
            color: Quantity === 0 ? "red" : "black",
          }}
        >
          <strong>Quantity:</strong> {Quantity}
        </p>
      </div>

      {/* Second Region: Customer Region */}
      <div
        style={{
          border: "2px solid purple",
          padding: "10px",
        }}
      >
        <CustomerRegion productId={product.id} />
      </div>
    </div>
  );
};

export default ProductRegion;
