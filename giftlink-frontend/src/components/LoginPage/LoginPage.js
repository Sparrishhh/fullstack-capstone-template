import React, { useState, useEffect } from 'react';
import './LoginPage.css';

// Task 1: Import urlConfig
import { urlConfig } from '../../config';
// Task 2: Import useAppContext
import { useAppContext } from '../../context/AuthContext';
// Task 3: Import useNavigate
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  // email and password states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Task 4: state for incorrect password or errors
  const [incorrect, setIncorrect] = useState('');

  // Task 5: navigate, bearerToken, setIsLoggedIn
  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem('auth-token');
  const { setIsLoggedIn } = useAppContext();

  // Task 6: redirect if already logged in
  useEffect(() => {
    if (bearerToken) {
      navigate('/app');
    }
  }, [bearerToken, navigate]);

  // Updated handleLogin function with full tasks
  const handleLogin = async () => {
    try {
      const response = await fetch(`${urlConfig}/api/auth/login`, {
        method: 'POST', // Task 7
        headers: {      // Task 8
          'Content-Type': 'application/json',
          'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
        },
        body: JSON.stringify({ // Task 9
          email,
          password,
        }),
      });

      const json = await response.json(); // Access JSON response

      if (json.authtoken) {
        // Task 2: Set user details in session storage
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('name', json.userName);
        sessionStorage.setItem('email', json.userEmail);

        // Task 3: Set user logged-in state
        setIsLoggedIn(true);

        // Task 4: Navigate to MainPage
        navigate('/app');
      } else {
        // Task 5: Clear inputs and set error message
        setEmail('');
        setPassword('');
        setIncorrect('Wrong password. Try again.');

        // Optional: Clear error message after 2 seconds
        setTimeout(() => setIncorrect(''), 2000);
      }
    } catch (e) {
      console.log('Error fetching details: ' + e.message);
      setIncorrect('An error occurred during login');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>

            {/* Input elements for email and password */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Show error if incorrect */}
            {incorrect && (
              <span
                style={{
                  color: 'red',
                  height: '.5cm',
                  display: 'block',
                  fontStyle: 'italic',
                  fontSize: '12px',
                  textAlign: 'center',
                  marginTop: '8px',
                }}
              >
                {incorrect}
              </span>
            )}

            {/* Button that performs the handleLogin function on click */}
            <button
              type="button"
              className="btn btn-primary btn-block mt-3"
              onClick={handleLogin}
            >
              Login
            </button>

            <p className="mt-4 text-center">
              New here?{' '}
              <a href="/app/register" className="text-primary">
                Register Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
