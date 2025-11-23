import * as React from "react";
import { StockPreferenceForm, Chart } from "./index";

import { useParams } from "react-router-dom";
import { IStockData } from "../types";

const Detail: React.FC = () => {
  const { symbol } = useParams<{ symbol?: string }>();
  const [stockData, setStockData] = React.useState<IStockData | null>(null);

  return (
    <>
      <StockPreferenceForm
        symbol={symbol || "MELI"} // if symbol is undefined, use "MELI" as default value
        handleSetStockData={setStockData}
      />
      {stockData && <Chart stockData={stockData} />}
    </>
  );
};

export default Detail;
