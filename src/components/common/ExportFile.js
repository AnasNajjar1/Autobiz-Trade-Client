import React, { useEffect } from "react";
import ReactExport from "react-data-export";
import _ from "lodash";
import moment from "moment";
import { t } from "../common/Translate";

const ExportFile = ({ fileName, datas, mappers, setAllowExport }) => {
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

  const multiDataSet = [
    {
      columns: [],
      data: [[]],
    },
  ];

  const buildFileColumns = () => {
    _.map(mappers, (source, label) => {
      multiDataSet[0]["columns"].push({
        title: t(label),
        width: { wpx: 100 },
      });
      multiDataSet[0]["data"][0].push({});
    });
  };

  const buildFileContent = () => {
    if (datas.length !== 0) multiDataSet[0]["data"] = [];
    _.map(datas, (data, index) => {
      multiDataSet[0]["data"].push([]);
      _.map(Object.values(mappers), (source) => {
        multiDataSet[0]["data"][index].push({
          value: customizeValue(_.get(data, source, ""), source),
        });
      });
    });
  };

  const customizeValue = (value, source) => {
    if (source === "createdAt")
      value = moment(value).format("DD/MM/YYYY HH:mm:ss");
    if (source === "sale.vehicle.entryStockDate")
      value = value ? moment(value).format("DD/MM/YYYY") : "-";
    if (["sale.supplyType", "offerType"].includes(source)) value = t(value);
    return value === null ? "" : value;
  };

  useEffect(() => {
    buildFileColumns();
    buildFileContent();
    document.getElementById("download").click();
    setAllowExport(false);
  }, []);

  return (
    <>
      <ExcelFile
        filename={fileName}
        element={<button id="download" className="d-none" />}
      >
        <ExcelSheet dataSet={multiDataSet} name={fileName} />
      </ExcelFile>
    </>
  );
};
export default ExportFile;
