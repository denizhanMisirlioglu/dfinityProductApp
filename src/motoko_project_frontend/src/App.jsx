import { useState } from 'react';
import { motoko_project_backend } from 'declarations/motoko_project_backend';

function App() {
  const [greeting, setGreeting] = useState('');
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productId, setProductId] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    motoko_project_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    }).catch(error => {
      console.error("Failed to greet:", error);
    });
  }

  async function handleAddProduct() {
    const price = Number(productPrice);
    if (productName && !isNaN(price)) {
      const newId = await motoko_project_backend.addProduct(productName, price);
      alert(`Product added with ID: ${newId}`);
      setProductName('');
      setProductPrice('');
    }
  }

  async function handleGetProduct() {
    const id = Number(productId);
    if (!isNaN(id)) {
      const result = await motoko_project_backend.getProduct(id);
      console.log("getProduct result:", result); // Veriyi kontrol etmek için
      if (result && result[0]) {
        setProduct(result[0]);
      } else {
        alert("Product not found.");
        setProduct(null);
      }
    }
  }

  async function handleGetAllProducts() {
    const allProducts = await motoko_project_backend.getAllProducts();
    console.log("getAllProducts result:", allProducts); // Veriyi kontrol etmek için
    setProducts(allProducts);
  }

  return (
    <main>
      <h2>DFINITY Product App</h2>

      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name:</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Greet Me!</button>
      </form>
      {greeting && <section id="greeting">{greeting}</section>}

      <hr />

      <h2>Add a New Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Product Price"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
      />
      <button onClick={handleAddProduct}>Add Product</button>

      <hr />

      <h2>Find a Product by ID</h2>
      <input
        type="number"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <button onClick={handleGetProduct}>Get Product</button>
      {product ? (
        <div className="product-info">
          <p><strong>Product ID:</strong> {product.id !== undefined ? product.id.toString() : "N/A"}</p>
          <p><strong>Name:</strong> {product.name || "N/A"}</p>
          <p><strong>Price:</strong> {product.price !== undefined ? product.price.toString() : "N/A"}</p>
        </div>
      ) : (
        <p>No product information available.</p>
      )}

      <hr />

      <h2>All Products</h2>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1em" }}>
        <button onClick={handleGetAllProducts}>Show All Products</button>
      </div>
      <ul>
        {products.map((prod) => (
          <li key={prod.id}>
            <strong>ID:</strong> {prod.id !== undefined ? prod.id.toString() : "N/A"}, <strong>Name:</strong> {prod.name || "N/A"}, <strong>Price:</strong> {prod.price !== undefined ? prod.price.toString() : "N/A"}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
