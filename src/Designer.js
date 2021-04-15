import React from "react";
import { Designer as ReportDesigner } from "@grapecity/activereports/reportdesigner";

const checkProp = (definition, reportItemName, propName, propValue) => {
  let result = true;
  const search = (obj) => {
    if (obj.Name === reportItemName) {
      result = obj[propName] === propValue;
    }
    for (const prop in obj) {
      if (typeof obj[prop] === "object") {
        search(obj[prop]);
      }
    }
  };
  search(definition);
  return result;
};

const reportConfig = [
  {
    reportItem: "ProductsTable",
    property: "DataSetName",
    value: "Products",
  },
  {
    reportItem: "ProductName",
    property: "Value",
    value: "=Fields!productName.Value",
  },
  {
    reportItem: "UnitPrice",
    property: "Value",
    value: "=Fields!unitPrice.Value",
  },
  {
    reportItem: "UnitsInStock",
    property: "Value",
    value: "=Fields!unitsInStock.Value",
  },
  {
    reportItem: "UnitsOnOrder",
    property: "Value",
    value: "=Fields!unitsOnOrder.Value",
  },
];

export const DesignerHost = () => {
  React.useEffect(() => {
    const designer = new ReportDesigner("#designer-host");
    designer.setActionHandlers({
      onSave: function (info) {
        const errors = [];
        for (let config of reportConfig) {
          if (
            !checkProp(
              info.definition,
              config.reportItem,
              config.property,
              config.value
            )
          ) {
            errors.push(
              `property ${config.property} of ${config.reportItem} has been changed which is not allowed`
            );
          }
        }

        if (errors.length > 0) return Promise.reject(errors.join(";"));

        return Promise.resolve({ displayName: info.displayName });
      },
    });
    designer.setReport({ id: "/Report.rdlx-json", displayName: "My Report" });
  }, []);
  return <div id="designer-host"></div>;
};
