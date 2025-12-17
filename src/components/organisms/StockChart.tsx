import * as React from "react";
import type { FC } from "react";
import Highcharts from "highcharts/highstock";
import Boost from "highcharts/modules/boost";
import HighchartsReact from "highcharts-react-official";
import { IStockData } from "../../types";
import { buildSeriesData } from "../../lib/stockChart";

Boost(Highcharts);

interface IChartProps {
  stockData: IStockData;
}

const ChartScreen: FC<IChartProps> = ({ stockData }) => {
  const symbol = stockData.meta.symbol;

  const chartOptions = React.useMemo(() => {
    const MAX_POINTS = 5000;
    const seriesData = buildSeriesData(stockData.values, MAX_POINTS);

    return {
      title: {
        text: symbol,
      },
      rangeSelector: {
        enabled: false,
      },
      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      xAxis: {
        type: "datetime",
      },
      yAxis: {
        title: {
          text: "Price",
        },
      },
      boost: {
        useGPUTranslations: true,
        usePreAllocated: true,
      },
      time: {
        useUTC: false,
      },
      series: [
        {
          name: "Interval",
          boostThreshold: 1,
          type: "line",
          data: seriesData,
          dataGrouping: {
            enabled: true,
            approximation: "average",
            groupPixelWidth: 10,
          },
        },
      ],
    };
  }, [stockData.values, symbol]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType="stockChart"
      options={chartOptions}
    />
  );
};

export default React.memo(ChartScreen);
