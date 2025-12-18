import { memo, useMemo, type FC } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const chartOptions = useMemo(() => {
    const MAX_POINTS = isMobile ? 2000 : 5000;
    const seriesData = buildSeriesData(stockData.values, MAX_POINTS);

    const enableDataGrouping = isMobile
      ? seriesData.length > 400
      : seriesData.length > 800;
    const groupPixelWidth = isMobile ? 35 : 20;

    return {
      chart: {
        animation: false,
      },
      title: {
        text: symbol,
      },
      credits: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
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
      plotOptions: {
        series: {
          animation: false,
          marker: {
            enabled: false,
          },
          states: {
            hover: {
              enabled: false,
            },
          },
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
          boostThreshold: 1000,
          type: "line",
          data: seriesData,
          dataGrouping: {
            enabled: enableDataGrouping,
            approximation: "average",
            groupPixelWidth,
          },
        },
      ],
    };
  }, [isMobile, stockData.values, symbol]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType="stockChart"
      options={chartOptions}
    />
  );
};

export default memo(ChartScreen);
