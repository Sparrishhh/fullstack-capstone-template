import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect, setIncorrect] = useState('');
  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem('auth-token');
  const { setIsLoggedIn } = useAppContext();

  useEffect(() => {
    if (bearerToken) {
      navigate('/app');
    }
  }, [bearerToken, navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${urlConfig}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (json.authtoken) {
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('name', json.userName);
        sessionStorage.setItem('email', json.userEmail);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        setEmail('');
        setPassword('');
        setIncorrect('Wrong password. Try again.');
        setTimeout(() => setIncorrect(''), 2000);
      }
    } catch (e) {
      console.error('Error fetching details:', e.message);
      setIncorrect('An error occurred during login');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>

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

            {incorrect && (
              <span
                style={{
                  color: 'red',
                  fontStyle: 'italic',
                  fontSize: '12px',
                  textAlign: 'center',
                  marginTop: '8px',
                  display: 'block',
                }}
              >
                {incorrect}
              </span>
            )}

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
