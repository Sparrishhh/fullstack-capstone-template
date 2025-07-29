import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

const categories = ['Toys', 'Books', 'Games', 'Electronics'];
const conditions = ['New', 'Used', 'Refurbished'];

function SearchPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [ageRange, setAgeRange] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setHasSearched(true);
    try {
      const baseUrl = `${urlConfig.backendUrl}/api/search?`;
      const queryParams = new URLSearchParams({
        name: searchQuery,
        age_years: ageRange,
        category: selectedCategory,
        condition: selectedCondition,
      }).toString();

      const fullUrl = `${baseUrl}${queryParams}`;
      console.log('Fetching search:', fullUrl);

      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      console.log('Search results:', data);

      setSearchResults(data);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
      setSearchResults([]);
    }
  };

  const goToDetailsPage = (productId) => {
    navigate(`/app/product/${productId}`);
  };

  return (
    <div className="container mt-4">
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

      <div className="form-group mb-3">
        <label htmlFor="ageRange">Less than {ageRange} years</label>
        <input
          id="ageRange"
          type="range"
          className="form-control-range"
          min="1"
          max="50"
          value={ageRange}
          onChange={(e) => setAgeRange(Number(e.target.value))}
        />
      </div>

      <button className="btn btn-primary mb-3" onClick={handleSearch}>
        Search
      </button>

      <div className="search-results">
        {searchResults.length > 0 ? (
          searchResults.map((product) => {
            const imageUrl = product.image
              ? product.image.startsWith('http')
                ? product.image
                : `/images/${product.image}`
              : null;

            return (
              <div key={product.id || product._id} className="card mb-3">
                {imageUrl && (
                  <img src={imageUrl} alt={product.name} className="card-img-top" />
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
            );
          })
        ) : (
          hasSearched && (
            <div className="alert alert-info" role="alert">
              No products found. Please revise your filters.
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default SearchPage;
