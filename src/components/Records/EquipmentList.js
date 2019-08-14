import React from "react";

const EquipmentList = ({ items }) => {
  return (
    <div className="list-equipment">
      {items.map((item, index) => (
        <div className="cell" key={index}>
          <div className="item">
            <div className={`ico ico-${item}`} />
            {item}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EquipmentList;
