import React from 'react';
import './imagelinkform.css';
const ImageLinkForm = ({onInputChange, onSubmit})=>{
  return (
    <center>
    <div>
  
      <p className='f2 white'>
      {'Detect faces in your picture! Try it !!'}
      </p><br></br>
      <div className="form w-50 br3 bw0 shadow-5">
  <input className='f4 pa2 w-50' type="text" onChange={onInputChange}/><br></br>
  <button className="w-20 grow f4 link ph3 pv2 dib white br3 bw1" onClick={onSubmit}>Detect</button>
      </div>
    
      </div>
      </center>  
  );
}

export default ImageLinkForm;