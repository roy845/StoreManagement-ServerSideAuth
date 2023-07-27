import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPurchases } from "../features/purchases/purchasesSlice";
import CustomerItem from "./CustomerItem";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { db } from "../config/firebase";
import { setCustomers } from "../features/customers/customersSlice";

const CustomerRegion = ({ productId }) => {
  const dispatch = useDispatch();
  const purchases = useSelector((state) => state.purchases.purchases);
  const customers = useSelector((state) => state.customers.customers);

  useEffect(() => {
    // Fetch products data from Firestore
    const fetchPurchases = async () => {
      try {
        const purchasesCollection = collection(db, "purchases");
        const purchasesSnapshot = await getDocs(purchasesCollection);
        const purchasesData = purchasesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setPurchases(purchasesData));
      } catch (error) {
        toast.error("Error fetching purchases:", error);
      }
    };

    fetchPurchases();
  }, [dispatch]);

  useEffect(() => {
    // Fetch products data from Firestore
    const fetchCustomers = async () => {
      try {
        const customersCollection = collection(db, "customers");
        const customersSnapshot = await getDocs(customersCollection);
        const customersData = customersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setCustomers(customersData));
      } catch (error) {
        toast.error("Error fetching products:", error);
      }
    };

    fetchCustomers();
  }, [dispatch]);

  // Find all purchases related to the product.
  const productPurchases = purchases?.filter(
    (purchase) => purchase.ProductID === productId
  );

  // Find all customers who made these purchases.
  const productCustomers = customers?.filter((customer) =>
    productPurchases.find((purchase) => purchase.CustomerID === customer.id)
  );

  return (
    <div>
      {productCustomers.length > 0 && <h3>Customers Bought That Product:</h3>}
      {productCustomers.map((customer) => (
        <CustomerItem
          key={customer.id}
          customer={customer}
          purchase={productPurchases.find(
            (purchase) => purchase.CustomerID === customer.id
          )}
        />
      ))}
    </div>
  );
};

export default CustomerRegion;
