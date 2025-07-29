import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  const style = {
    body: {
      margin: 0,
      padding: 0,
      fontFamily: 'Arial, sans-serif',
      backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      color: 'white',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
    },
    overlay: {
      position: 'absolute',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)', // for Safari support
      zIndex: 1,
    },
    content: {
      position: 'relative',
      zIndex: 2,
      paddingTop: '150px',
      textAlign: 'center',
    },
    btn: {
      marginTop: '30px',
    }
  };

  return (
    <div style={style.body}>
      <div style={style.overlay}></div>
      <div style={style.content}>
        <h1>Welcome to Our Gift App</h1>
        <p className="lead">"The best gift is giving from your heart."</p>
        <a href="/" className="btn btn-primary btn-lg" style={style.btn}>Get Started</a>
      </div>
    </div>
  );
}

export default LandingPage;
