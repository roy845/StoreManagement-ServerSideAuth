import { useSelector } from "react-redux";
import { selectTotalProductsPurchased } from "../features/products/productsSlice";

const TotalProductsPurchased = () => {
  const totalPurchased = useSelector(selectTotalProductsPurchased);

  return (
    <div>
      <strong>Total Products Purchased:</strong> {totalPurchased}
    </div>
  );
};

export default TotalProductsPurchased;
