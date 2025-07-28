import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function LandingPage() {
  const style = {
    body: {
      margin: 0,
      padding: 0,
      fontFamily: 'Arial, sans-serif',
      backgroundImage: "url('https://source.unsplash.com/1600x900/?nature')",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      color: 'white',
      height: '100vh',
      position: 'relative',
    },
    overlay: {
      position: 'absolute',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      backdropFilter: 'blur(4px)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        <h1>Welcome to Our App</h1>
        <p className="lead">"The journey of a thousand miles begins with a single step."</p>
        <a href="/" className="btn btn-primary btn-lg" style={style.btn}>Get Started</a>
      </div>
    </div>
  );
}

export default LandingPage;
