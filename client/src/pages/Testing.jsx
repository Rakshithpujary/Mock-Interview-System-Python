import React from 'react';
import '../css/HomePage.css';


function Testing({storage, app}) {
  return (
    <div className='Home-div'>
      
      <div className='header-div'>
      <h3>Mock Interview</h3>  
      </div>
      <div className='context-div'>
        <h4>Land your dream job by prepping for interviews from the comfort of your couch.</h4>
        <button>Get Started</button>
      </div>
    </div>
  );
}

export default Testing;