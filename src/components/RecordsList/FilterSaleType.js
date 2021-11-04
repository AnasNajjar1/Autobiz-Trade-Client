import React from "react";
import { FormGroup, Input } from "reactstrap";
import { t } from "../common/Translate";
const FilterSaleType = ({ value, updateField }) => {
  const saleTypeList = [
    { key: "acceptImmediatePurchase", value: "acceptImmediatePurchase" },
    { key: "acceptAuction", value: "acceptAuction" },
  ];
  const options = saleTypeList.map(({ key, value }) => (
    <option key={key} value={key}>
      {t(value)}
    </option>
  ));

  return (
    <>
      <FormGroup>
        <Input
          type="select"
          name="saleTypeAccept"
          value={value}
          className="mb-2 rounded"
          onChange={(e) => updateField(e)}
        >
          <option value={""}>---</option>
          {options}
        </Input>
      </FormGroup>
    </>
  );
};

export default FilterSaleType;
