import React from 'react';

import {store} from './store.js';
import ReCom from './ReCom.js';

let resultStyle = {
  display: 'inline-block',
  width: 120,
  verticalAlign: 'top',
  marginRight: 20,
  lineHeight: '10px',
  fontSize: 10,
  whiteSpace: 'nowrap',
  overflow:'hidden',
};

export default class Results extends ReCom {

  constructor(props, context) {
    super(props, store);
  }

  result(n) {
    let o = this.get(['results', n / 10 |0, n % 10]);
    return o && <div 
      onMouseEnter={() => this.set('ui.currentResult', n)}
      style={resultStyle}>
      <div><strong>{o.TITLE[0]} &nbsp;</strong></div>
      <div><em>{(o.CREATOR || []).join(' & ')} &nbsp;</em></div>
      <br/>
      <img src={'https:' + o.coverUrlThumbnail} alt=""
           style={{ 
              height: 50,
              width: 35,
              border: '1px solid black',
              float: 'left',
            }}/>
          <img src="" alt="Ny forside (TODO)"
           style={{ 
              height: 100,
              width: 70,
              border: '1px solid black',
              float: 'right',
            }}/>
    </div>
  }
  render() {
    return <div style={{
      //padding: '0px 0px 10px 30px'
    }}>

    {this.get('ui.searchError') && 
        <div style={{
          display: 'inline-block',
          textAlign: 'left'
        }}>
        <h3>Error</h3>
        <pre>{String(this.get('ui.searchError'))}</pre>
      </div>
    }

    <div style={{
      whiteSpace: 'nowrap',
      width: '100%',
      height: 150,
      display: 'inline-block',
      overflowY: 'hidden',
      overflowX: 'auto',
    }}
    onScroll={(e) => console.log('scroll', e.target.scrollLeft)}
  >
      { Array.isArray(this.get(['results', 0])) &&
          [...Array(10).keys()].map(i => this.result(i))
      }
    </div>
  </div>
  }
}

