import * as React from "react";
import type { FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { IStockData, IValuesStockData } from "../types";

interface IChartProps {
  stockData: IStockData;
}

const ChartScreen: FC<IChartProps> = ({ stockData }) => {
  const symbol = stockData.meta.symbol;

  const chartOptions = React.useMemo(() => {
    return {
      title: {
        text: symbol,
      },
      xAxis: {
        categories: stockData.values.map(
          (item: IValuesStockData) => item.datetime
        ),
        title: {
          text: "Interval",
        },
      },
      yAxis: {
        title: {
          text: "Price",
        },
      },
      series: [
        {
          name: "Interval",
          data: stockData.values.map((item: IValuesStockData) =>
            parseFloat(item.close)
          ),
        },
      ],
    };
  }, [stockData.values, symbol]);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default React.memo(ChartScreen);
