import { useState } from 'react';

function Customer(){
  const [fontSize, setFontSize] = useState(16);
  const changeFontSize = (action: 'Increase' | 'Decrease' | 'Default')=>{
      setFontSize((prev) => {
        if(action == 'Increase') return Math.min(60, prev + 2);
        if(action == 'Decrease') return Math.max(16, prev - 2);
          return 16;
      });
  };
  return(
    <div style={{ padding: '1rem'}}>
      <div style={{ marginBottom: '1rem'}}>
        <p><u>Change Font Size</u></p>
        <button onClick={() => changeFontSize('Increase')}>Increase</button>
        <button onClick={() => changeFontSize('Decrease')}>Decrease</button>
        <button onClick={() => changeFontSize('Default')}>Default</button>
      </div> 
      <div style={{fontSize: fontSize + 'px'}}>
        <p> This is our Customer UI</p>
      </div>
    </div>
  );
}

export default Customer;