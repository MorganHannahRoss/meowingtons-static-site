import { checkout } from "./services/checkout";
import { React, useEffect, useState } from "react";
import "./App.css";
import Select from "react-select";
import { Hearts } from "react-loader-spinner";

// The function that makes the fetch request to the Products API
import { getProducts } from "./services/getProducts";

//filter options from react-select
const filterOptions = [
  { value: "all", label: "All" },
  { value: "beds", label: "Cat Beds and Cushions" },
  { value: "Trees", label: "Cat Trees and Condos" },
  { value: "treats", label: "Cat Toys and Treats" },
];
//sort options for react select
const sortOptions = [
  { value: "low", label: "Price: low" },
  { value: "high", label: "Price: high" },
];

function App() {
  // use the products variable to read all of your products
  // and display them on your page

  //filter by dropdown menu (beds/Trees/treats)
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(undefined);

  //sort by dropdown menu (price /old etc)
  const [selectedSort, setSelectedSort] = useState(undefined);
  //userface to change a category
  function handleCategoryChange(option) {
    setSelectedCategory(option);
    if (option.value === "all") {
      return setProducts(allProducts);
    }
    const filtered = allProducts.filter((product) => {
      const isCategory = product.metadata.category === option.value;
      return isCategory;
    });
    setProducts(filtered);
  }
  //filter the products
  function handleSortChange(option) {
    setSelectedSort(option);
    const sorted = products.sort((a, b) => {
      if (option.value === "low") {
        return a.prices[0].unit_amount - b.prices[0].unit_amount;
      }
      if (option.value === "high") {
        return b.prices[0].unit_amount - a.prices[0].unit_amount;
      }
    });
    setProducts(sorted);
  }

  //download products
  useEffect(() => {
    const loadData = async () => {
      const products = await getProducts();
      setProducts(products);
      setAllProducts(products);
    };

    loadData();
  }, []);

  //sort by - price - low to high/high to low

  //Featured products menu
  const featuredProducts = allProducts.filter((product) => {
    const isFeatured = product.metadata.featured === "yes";
    return isFeatured;
  });

  // HTML BELOW
  return (
    <div className="body">
      <header>
        <img
          class="logo"
          alt="Meowingtons cat logo"
          src="/logo-meowingtons.webp"
        />
      </header>

      <section>
        <h1>Featured Products</h1>

        <Hearts
          height="80"
          width="80"
          color="pink"
          ariaLabel="hearts-loading"
          wrapperStyle={{}}
          wrapperClass="center"
          visible={products.length <= 0}
        />

        <div class="feature-grid">
          {featuredProducts.map((product, index) => (
            <StoreProduct key={index} product={product} />
          ))}
        </div>
      </section>

      <section>
        <nav class="sort-by">
          <span>
            Filter By
            <Select
              options={filterOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
            />
          </span>
          <span>
            Sort By
            <Select
              options={sortOptions}
              value={selectedSort}
              onChange={handleSortChange}
            />
          </span>
        </nav>

        <main class="container">
          {products.map((product, index) => (
            <StoreProduct key={index} product={product} />
          ))}
        </main>
      </section>
    </div>
  );
}
// products below

const StoreProduct = ({ product }) => {
  function handleClick() {
    checkout(product.prices[0].id);
  }
  return (
    <section className="product-card">
      <p>{product.name}</p>
      <p>
        <img src={product.images[0]} alt={product.name} width="100%" />
      </p>
      <p>${product.prices[0].unit_amount / 100}.00</p>
      <p>{product.description}</p>
      <button onClick={handleClick}>Buy Now</button>
    </section>
  );
};

export default App;
