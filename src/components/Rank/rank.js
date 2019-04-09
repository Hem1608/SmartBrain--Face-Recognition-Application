import React from 'react';

const Rank = ({name,entries})=>{
  return (
<div>
  <center>
    <div className="white f3">
    {`${name}, your current rank is..`}<br></br>
          </div>
          <div className="white f3">
            {entries}
          </div>

  
  </center>
  </div>
  )
}
export default Rank;