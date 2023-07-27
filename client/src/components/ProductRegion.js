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
        Price: {Price} ₪
      </p>
      <p
        style={{
          color: Quantity === 0 ? "red" : "black",
        }}
      >
        Quantity: {Quantity}
      </p>
      <CustomerRegion productId={product.id} />
    </div>
  );
};

export default ProductRegion;
