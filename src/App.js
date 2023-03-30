import { React, useEffect, useState } from "react";
import "./App.css";

// The function that makes the fetch request to the Products API
import { getProducts } from "./services/getProducts";

function App() {
  // use the products variable to read all of your products
  // and display them on your page
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const products = await getProducts();
      setProducts(products);
    };

    loadData();
  }, []);

  console.log(products);

  //TEST
  return (
    <div className="container">
      <h1>Meowingtons</h1>
      {products.map((product, index) => (
        <StoreProduct key={index} product={product} />
      ))}
    </div>
  );
}
// //Practice - TEST PRODUCTS BELOW

const StoreProduct = ({ product }) => {
  return (
    <li>
      <p>{product.name}</p>
      <p>
        <img src={product.images[0]} alt={product.name} width="50%" />
      </p>
      <p> {product.price}</p>
      <p>{product.description}</p>
      <button>Buy Now</button>
    </li>
  );
};

export default App;
