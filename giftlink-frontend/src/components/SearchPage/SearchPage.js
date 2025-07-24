import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

const categories = ['Toys', 'Books', 'Games', 'Electronics']; // Update as needed
const conditions = ['New', 'Used', 'Refurbished']; // Update as needed

function SearchPage() {
  const navigate = useNavigate();

  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [ageRange, setAgeRange] = useState(10); // example max age 10
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch search results based on filters
  const handleSearch = async () => {
    try {
      const baseUrl = `${urlConfig.backendUrl}/api/search?`;
      const queryParams = new URLSearchParams({
        name: searchQuery,
        age_years: ageRange,
        category: selectedCategory,
        condition: selectedCondition,
      }).toString();

      const response = await fetch(`${baseUrl}${queryParams}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
      setSearchResults([]);
    }
  };

  // Navigate to product details page
  const goToDetailsPage = (productId) => {
    navigate(`/app/product/${productId}`);
  };

  return (
    <div className="container mt-4">
      {/* Search input */}
      <div className="form-group mb-3">
        <label htmlFor="searchInput">Search</label>
        <input
          id="searchInput"
          type="text"
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter product name..."
        />
      </div>

      {/* Category dropdown */}
      <div className="form-group mb-3">
        <label htmlFor="categorySelect">Category</label>
        <select
          id="categorySelect"
          className="form-control"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Condition dropdown */}
      <div className="form-group mb-3">
        <label htmlFor="conditionSelect">Condition</label>
        <select
          id="conditionSelect"
          className="form-control"
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
        >
          <option value="">All</option>
          {conditions.map((condition) => (
            <option key={condition} value={condition}>{condition}</option>
          ))}
        </select>
      </div>

      {/* Age range slider */}
      <div className="form-group mb-3">
        <label htmlFor="ageRange">Less than {ageRange} years</label>
        <input
          id="ageRange"
          type="range"
          className="form-control-range"
          min="1"
          max="50"
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
        />
      </div>

      {/* Search button */}
      <button className="btn btn-primary mb-3" onClick={handleSearch}>
        Search
      </button>

      {/* Search results */}
      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <div key={product.id || product._id} className="card mb-3">
              {product.image && (
                <img src={product.image} alt={product.name} className="card-img-top" />
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description?.slice(0, 100)}...</p>
              </div>
              <div className="card-footer">
                <button onClick={() => goToDetailsPage(product.id || product._id)} className="btn btn-primary">
                  View More
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info" role="alert">
            No products found. Please revise your filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
