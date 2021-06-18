import React, { useEffect } from "react";
import ReactExport from "react-data-export";
import _ from "lodash";
import moment from "moment";

const ExportFile = ({ fileName, datas, mappers, setAllowExport }) => {
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

  useEffect(() => {
    document.getElementById("download").click();
    setAllowExport(false);
  }, []);

  return (
    <ExcelFile
      filename={fileName}
      element={<button id="download" className="d-none" />}
    >
      <ExcelSheet data={datas} name={fileName}>
        {_.map(mappers, (source, label) => (
          <ExcelColumn
            key={label}
            label={label}
            value={(col) => {
              let value = _.get(col, source, "");
              if (source === "createdAt")
                value = moment(value).format("DD/MM/YYYY HH:mm:ss");
              return value;
            }}
          />
        ))}
      </ExcelSheet>
    </ExcelFile>
  );
};
export default ExportFile;
