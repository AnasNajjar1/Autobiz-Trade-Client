import React from "react";
import { excludedEquipments } from "../../helper/Vehicle";
import { t } from "../common/Translate";
const EquipmentList = ({ items }) => {
  return (
    <div className="list-equipment">
      {items.map(
        (item, index) =>
          !excludedEquipments.includes(item) && (
            <div className="cell" key={index}>
              <div className="item">
                <div className={`ico ico-${item}`} />
                {t(item)}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default EquipmentList;
