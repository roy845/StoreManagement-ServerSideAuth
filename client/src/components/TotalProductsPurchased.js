import { useSelector } from "react-redux";
import { selectTotalProductsPurchased } from "../features/products/productsSlice";

const TotalProductsPurchased = () => {
  const totalPurchased = useSelector(selectTotalProductsPurchased);

  return <div>Total Products Purchased: {totalPurchased}</div>;
};

export default TotalProductsPurchased;
