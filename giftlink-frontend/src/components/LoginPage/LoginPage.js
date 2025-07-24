import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
    // Create useState hook variables for email, password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Create handleLogin function and include console.log
    const handleLogin = () => {
        console.log('Logging in user with:', { email, password });
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

              {/* Button that performs the handleLogin function on click */}
              <button
                type="button"
                className="btn btn-primary btn-block mt-3"
                onClick={handleLogin}
              >
                Login
              </button>

              <p className="mt-4 text-center">
                New here? <a href="/app/register" className="text-primary">Register Here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}

export default LoginPage;
