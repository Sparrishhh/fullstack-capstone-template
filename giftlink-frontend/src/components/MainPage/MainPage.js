import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import custom CSS for this component
import './MainPage.css';

function MainPage() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const backendUrl = urlConfig.backendUrl || 'http://localhost:3060';
        const url = `${backendUrl}/api/gifts`;
        console.log('🔍 Fetching from:', url);

        const response = await fetch(url);
        console.log('✅ Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('❌ Response was not JSON. HTML received:\n', text);
          throw new Error('Received HTML instead of JSON. Backend may not be running or route is incorrect.');
        }

        const data = await response.json();
        console.log('🎁 Gift data received:', data);

        setGifts(data);
      } catch (error) {
        console.error('❌ Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, []);

  const goToDetailsPage = (productId) => {
    navigate(`/app/product/${productId}`);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getConditionClass = (condition) => {
    return condition === 'New' ? 'list-group-item-success' : 'list-group-item-warning';
  };

  return (
    <div className="container mt-5">
      {loading && <p>Loading gifts...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {!loading && gifts.length === 0 && !error && (
        <p>No gifts found. Please check your backend or add some gifts.</p>
      )}
      <div className="row">
        {gifts.map((gift) => {
          const giftId = gift._id || gift.id;
          const imageUrl = gift.image
            ? gift.image.startsWith('http')
              ? gift.image
              : `/images/${gift.image}`
            : null;

          return (
            <div key={giftId} className="col-md-4 mb-4">
              <div className="card product-card h-100">
                <div className="image-placeholder" style={{ height: '200px', overflow: 'hidden' }}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={gift.name}
                      className="card-img-top"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center h-100 text-muted"
                      style={{ backgroundColor: '#f0f0f0' }}
                    >
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{gift.name}</h5>
                  <p className={`card-text ${getConditionClass(gift.condition)}`}>
                    {gift.condition}
                  </p>
                  <p className="card-text date-added">{formatDate(gift.date_added)}</p>
                </div>
                <div className="card-footer bg-transparent">
                  <button
                    onClick={() => goToDetailsPage(giftId)}
                    className="btn btn-primary w-100"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MainPage;
