// import React, { useEffect, useState } from "react";
// import { PropertyPopup } from '../PropertyPopup/PropertyPopup.js';
// import './HexGrid.css';

// const HexGrid = () => {
//     const gridWidth = 24;
//     const gridHeight = 20;
//     const hexesCount = gridWidth * gridHeight;
//     const initialPropertyValues = {
//         color: '',
//         tileType: '',
//         terrain: '',
//         feature: '',
//         resource: '',
//         improvement: '',
//         wonder: '',
//         river: '',
//     };

//     const initialHexes = Array(hexesCount).fill(null).map(() => ({ 
//         ...initialPropertyValues
//     }));
//     const [hexArray, setHexArray] = useState(initialHexes);
//     const [currentHex, setCurrentHex] = useState(-1);

//     const getLocalStorage = () => {
//         const savedHexArray = localStorage.getItem('hexArray');
//         savedHexArray && setHexArray(JSON.parse(savedHexArray));
//     };

//     const setLocalStorage = () => {
//         localStorage.setItem('hexArray', JSON.stringify(hexArray));
//     };

//     const clickHex = (rowIndex, hexIndex) => {
//         setCurrentHex(rowIndex * gridWidth + hexIndex);
//     };

//     const getUpdatedColor = (tileType) => {
//         switch (tileType) {
//             case 'plains': return '#D8B500';
//             case 'desert': return '#C67D00';
//             case 'tundra': return '#0099cc';
//             case 'grassland': return '#263624';
//             case 'ocean': return '#203f8b';
//             default: return '';
//         }
//     };

//     const saveHexProperties = (hexProperties) => {
//         const updatedColor = getUpdatedColor(hexProperties.tileType);
//         setHexArray(prevHexArray =>
//             prevHexArray.map((prevHex, index) =>{
//                 if (index === currentHex) {
//                     return { ...prevHex, ...hexProperties, color: updatedColor };
//                 }
//                 return prevHex;
//             })
//         );
//         setCurrentHex(-1);
//     };
    
//     return (
//         <div className="hex-grid-container">
//             <button onClick={getLocalStorage}>Get Local Storage</button>
//             <button onClick={setLocalStorage}>Set Local Storage</button>
//             <div className="hex-grid">
//                 {hexArray.reduce((acc, hex, index) => {
//                         const chunkIndex = Math.floor(index / gridWidth)
    
//                         if(!acc[chunkIndex]) {
//                             acc[chunkIndex] = []
//                         }
    
//                         acc[chunkIndex].push(hex)
    
//                         return acc
//                     }, []).map((hexRow, rowIndex) => (
//                         <div key={rowIndex} className="hex-row">
//                             {hexRow.map((hex, hexIndex) => (
//                             <div 
//                                 key={hexIndex} 
//                                 className="hex"
//                                 onClick={() => clickHex(rowIndex, hexIndex)}
//                                 style={{ backgroundColor: hex.color }}>
//                                     <div className="hex-content">
//                                         {Object.entries(hex).map(([property, value]) => {
//                                             if (property === 'color') return null;
//                                             return (
//                                                 <div key={property}>{property}: {value}</div>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ))
//                 }
//                 {currentHex >= 0 && (
//                 <div className="property-popup-container">
//                     <PropertyPopup
//                     hex={hexArray[currentHex]}
//                     onSave={saveHexProperties}
//                     onCancel={() => setCurrentHex(-1)}
//                     />
//                 </div>
//                 )}
//             </div>
//         </div>
//     )
// };

// export default HexGrid;


import React, { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import { PropertyPopup } from '../PropertyPopup/PropertyPopup.js';
import './HexGrid.css';

const gridWidth = 24;
const gridHeight = 20;
const hexesCount = gridWidth * gridHeight;
const initialPropertyValues = {
  color: '',
  tileType: '',
  terrain: '',
  feature: '',
  resource: '',
  improvement: '',
  wonder: '',
  river: '',
};

const initialState = {
  hexArray: Array(hexesCount).fill(null).map(() => ({ ...initialPropertyValues })),
  currentHex: -1,
};

const hexReducer = (state, action) => {
  switch (action.type) {
    case 'SET_HEX_ARRAY':
      return { ...state, hexArray: action.payload };
    case 'SET_CURRENT_HEX':
      return { ...state, currentHex: action.payload };
    case 'UPDATE_HEX_PROPERTY':
      const updatedHexArray = state.hexArray.map((hex, index) =>
        index === state.currentHex ? { ...hex, ...action.payload } : hex
      );
      return { ...state, hexArray: updatedHexArray, currentHex: -1 };
    default:
      return state;
  }
};

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

const HexGrid = () => {
  const [state, dispatch] = useReducer(hexReducer, initialState);
  const [storedValue, setLocalStorage] = useLocalStorage('hexArray', initialState.hexArray);

  useEffect(() => {
    dispatch({ type: 'SET_HEX_ARRAY', payload: storedValue });
  }, [storedValue]);

  const clickHex = useCallback((index) => {
    dispatch({ type: 'SET_CURRENT_HEX', payload: index });
  }, []);

  const saveHexProperties = useCallback((hexProperties) => {
    const updatedColor = getUpdatedColor(hexProperties.tileType);
    const updatedHexProperties = { ...hexProperties, color: updatedColor };

    dispatch({ type: 'UPDATE_HEX_PROPERTY', payload: updatedHexProperties });
  }, []);

  const getUpdatedColor = (tileType) => {
    switch (tileType) {
        case 'plains': return '#D8B500';
        case 'desert': return '#C67D00';
        case 'tundra': return '#0099cc';
        case 'grassland': return '#263624';
        case 'ocean': return '#203f8b';
        default: return '';
    }
};

  const renderHexGrid = useMemo(() => {
    const rows = [];
    for (let rowIndex = 0; rowIndex < gridHeight; rowIndex++) {
      const rowHexes = [];
      for (let hexIndex = 0; hexIndex < gridWidth; hexIndex++) {
        const hex = state.hexArray[rowIndex * gridWidth + hexIndex];
        rowHexes.push(
          <div
            key={hexIndex}
            className="hex"
            onClick={() => clickHex(rowIndex * gridWidth + hexIndex)}
            style={{ backgroundColor: hex.color }}>
            <div className="hex-content">
            {Object.entries(hex).map(([property, value]) => {
                return property === 'color' ? null : (
                    <div key={property}>
                    {property}: {value.toString()}
                    </div>
                );
            })}
            </div>
          </div>
        );
      }
      rows.push(<div key={rowIndex} className="hex-row">{rowHexes}</div>);
    }
    return rows;
  }, [state.hexArray, clickHex]);

  return (
    <div className="hex-grid-container">
      <button onClick={() => setLocalStorage(state.hexArray)}>Set Local Storage</button>
      <div className="hex-grid">
        {renderHexGrid}
      </div>
      {state.currentHex >= 0 && (
        <div className="property-popup-container">
          <PropertyPopup
            hex={state.hexArray[state.currentHex]}
            onSave={saveHexProperties}
            onCancel={() => dispatch({ type: 'SET_CURRENT_HEX', payload: -1 })}
          />
        </div>
      )}
    </div>
  );
};

export default HexGrid;