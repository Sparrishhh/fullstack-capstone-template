import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import urlConfig from '../../config/urlConfig'; // Adjust path as needed

const categories = ['Toys', 'Books', 'Games', 'Electronics']; // Replace with actual categories from your backend or config
const conditions = ['New', 'Used', 'Refurbished']; // Replace with actual conditions

function SearchPage() {
  const navigate = useNavigate();

  // Task 1: State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [ageRange, setAgeRange] = useState(6);
  const [searchResults, setSearchResults] = useState([]);

  // Task 2 & 9: Fetch search results
  const handleSearch = async () => {
    const baseUrl = `${urlConfig.backendUrl}/api/search?`;
    const queryParams = new URLSearchParams({
      name: searchQuery,
      age_years: ageRange,
      category: document.getElementById('categorySelect').value,
      condition: document.getElementById('conditionSelect').value,
    }).toString();

    try {
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

  // Task 8: Navigate to details page
  const goToDetailsPage = (productId) => {
    navigate(`/app/product/${productId}`);
  };

  return (
    <div className="container mt-4">
      {/* Task 10: Text input for search */}
      <div className="form-group">
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

      {/* Task 3: Category dropdown */}
      <div className="form-group">
        <label htmlFor="categorySelect">Category</label>
        <select id="categorySelect" className="form-control my-1">
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Task 3: Condition dropdown */}
      <div className="form-group">
        <label htmlFor="conditionSelect">Condition</label>
        <select id="conditionSelect" className="form-control my-1">
          <option value="">All</option>
          {conditions.map((condition) => (
            <option key={condition} value={condition}>{condition}</option>
          ))}
        </select>
      </div>

      {/* Task 4: Age range slider */}
      <div className="form-group">
        <label htmlFor="ageRange">Less than {ageRange} years</label>
        <input
          id="ageRange"
          type="range"
          className="form-control-range"
          min="1"
          max="10"
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
        />
      </div>

      {/* Task 11: Search button */}
      <button className="btn btn-primary mb-3" onClick={handleSearch}>Search</button>

      {/* Task 5: Display results or empty message */}
      <div className="search-results mt-4">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <div key={product.id} className="card mb-3">
              {product.image && (
                <img src={product.image} alt={product.name} className="card-img-top" />
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description?.slice(0, 100)}...</p>
              </div>
              <div className="card-footer">
                <button onClick={() => goToDetailsPage(product.id)} className="btn btn-primary">
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
