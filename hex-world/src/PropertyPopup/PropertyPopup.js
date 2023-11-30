// import React, { useState } from "react";
// import Select from 'react-select';
// import './PropertyPopup.css';

// export const PropertyPopup = ({hex, onSave, onCancel}) => {
//     const [localHex, setLocalHex] = useState({
//         ...hex,
//         river: Array.isArray(hex.river) ? hex.river : []
//       });
//     const tileTypeOptions = ['plains', 'desert', 'tundra', 'grassland', 'ocean']
//     const terrainOptions = ['', 'hills', 'mountains']
//     const featureOptions = ['', 'woods', 'rainforest', 'marsh', 'floodplains', 'geothermal', 'reef', 'volcano']
//     const riverOptions = ['', 'TR', 'TL', 'R', 'L', 'BR', 'BL']


//     const handleChange = (property, value) => {
//         setLocalHex({...localHex, [property]: value
//         });
//     };

//     const handleMultipleChange = (property, selectedOptions) => {
//         const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
//         setLocalHex({...localHex, [property]: selectedValues});
//     };

//     const inputField = (property, value) => {
//         const optionsMap = {
//           'tileType': tileTypeOptions,
//           'terrain': terrainOptions,
//           'feature': featureOptions,
//           'river': riverOptions
//         };
      
//         if (['tileType', 'terrain', 'feature'].includes(property)) {
//           return (
//             <Select
//                 name={property}
//                 value={optionsMap[property].map(option => ({ value: option, label: option })).find(option => option.value === value)}
//                 options={optionsMap[property].map(option => ({ value: option, label: option }))}
//                 onChange={(selectedOption) => handleChange(property, selectedOption ? selectedOption.value : '')}
//             />
//           );
//         } else if (property === 'river') {
//           return (
//             <Select
//                 isMulti
//                 name={property}
//                 value={optionsMap[property]
//                     .filter(option => localHex.river.includes(option))
//                     .map(option => ({ value: option, label: option }))}
//                 options={optionsMap[property].map(option => ({ value: option, label: option }))}
//                 className="basic-multi-select"
//                 classNamePrefix="select"
//                 onChange={(selectedOptions) => handleMultipleChange(property, selectedOptions)}
//             />
//           );
//         } else {
//           return (
//             <input
//                 type="text"
//                 value={value}
//                 placeholder={`Enter ${property}`}
//                 onChange={(e) => handleChange(property, e.target.value)}
//             />
//           );
//         }
//       };      

//     return (
//             <div className="popup">
//                 {Object.entries(localHex).map(([property, value]) => {

//                     if (property === 'color') return null;

//                     return (
//                     <div key={property}>
//                         <label>{property}: </label>
//                         {inputField(property, value)}
//                     </div>
//                     )
//                 })}
//                 <button onClick={() => onSave(localHex)}>Save</button>
//                 <button onClick={onCancel}>Cancel</button>
//             </div>
//     )
// };

// export default PropertyPopup;












import React, { useState, useMemo } from "react";
import Select from 'react-select';
import './PropertyPopup.css';

const tileTypeOptions = ['plains', 'desert', 'tundra', 'grassland', 'ocean'];
const terrainOptions = ['', 'hills', 'mountains'];
const featureOptions = ['', 'woods', 'rainforest', 'marsh', 'floodplains', 'geothermal', 'reef', 'volcano'];
const riverOptions = ['', 'TR', 'TL', 'R', 'L', 'BR', 'BL'];

export const PropertyPopup = ({ hex, onSave, onCancel }) => {
    const [localHex, setLocalHex] = useState({
        ...hex,
        river: Array.isArray(hex.river) ? hex.river : []
    });
    
    const optionsMap = useMemo(() => ({
        'tileType': tileTypeOptions,
        'terrain': terrainOptions,
        'feature': featureOptions,
        'river': riverOptions
    }), []);

    const handleChange = (property, event) => {
        if (Array.isArray(event)) {
          const value = event.map((option) => option.value);
          setLocalHex((prev) => ({
            ...prev,
            [property]: value,
          }));
        } else if (event && event.hasOwnProperty('value')) {
          const value = event.value || '';
          setLocalHex((prev) => ({
            ...prev,
            [property]: value,
          }));
        } else {
          const value = event.target.value;
          setLocalHex((prev) => ({
            ...prev,
            [property]: value,
          }));
        }
      };

    const inputField = (property, value) => {
        if (property in optionsMap) {
            return (
                <Select
                    isMulti={property === 'river'}
                    name={property}
                    value={optionsMap[property].filter(option => property === 'river' ? value.includes(option) : option === value).map(option => ({ value: option, label: option }))}
                    options={optionsMap[property].map(option => ({ value: option, label: option }))}
                    classNamePrefix={property === 'river' ? "select" : undefined}
                    onChange={(newValue) => handleChange(property, newValue || [])}
                />
            );
        } else {
            return (
                <input
                    type="text"
                    value={value}
                    placeholder={`Enter ${property}`}
                    onChange={(e) => handleChange(property, e)}
                />
            );
        }
    };

    return (
        <div className="popup">
            {Object.entries(localHex).map(([property, value]) => {
                if (property === 'color') return null;

                return (
                    <div key={property}>
                        <label>{property}: </label>
                        {inputField(property, value)}
                    </div>
                )
            })}
            <div className="button-container">
                <button onClick={() => onSave(localHex)}>Save</button>
                <button className='cancel-button' onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default PropertyPopup;
