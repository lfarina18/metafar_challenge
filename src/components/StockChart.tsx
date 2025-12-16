import * as React from "react";
import type { FC } from "react";
import Highcharts from "highcharts/highstock";
import Boost from "highcharts/modules/boost";
import HighchartsReact from "highcharts-react-official";
import { IStockData, IValuesStockData } from "../types";

Boost(Highcharts);

interface IChartProps {
  stockData: IStockData;
}

const ChartScreen: FC<IChartProps> = ({ stockData }) => {
  const symbol = stockData.meta.symbol;

  const chartOptions = React.useMemo(() => {
    const MAX_POINTS = 5000;
    const values = stockData.values;
    const step =
      values.length > MAX_POINTS ? Math.ceil(values.length / MAX_POINTS) : 1;

    const sampledValues: IValuesStockData[] =
      step === 1
        ? values
        : values.filter(
            (_, idx) => idx % step === 0 || idx === values.length - 1
          );

    const parseDatetimeToMs = (datetime: string): number => {
      const direct = Date.parse(datetime);
      if (!Number.isNaN(direct)) return direct;

      const parts = datetime.trim().split(" ");
      if (parts.length !== 2) return NaN;

      const [datePart, timePart] = parts;
      const [y, m, d] = datePart.split("-").map(Number);
      const [hh, mm, ss] = timePart.split(":").map(Number);

      if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) return NaN;

      return Date.UTC(y, m - 1, d, hh, mm, Number.isNaN(ss) ? 0 : ss);
    };

    const unsortedSeriesData = sampledValues
      .map((item) => {
        const t = parseDatetimeToMs(item.datetime);
        const y = parseFloat(item.close);
        if (Number.isNaN(t) || Number.isNaN(y)) return null;
        return [t, y] as [number, number];
      })
      .filter((p): p is [number, number] => p !== null);

    const seriesData = unsortedSeriesData.sort((a, b) => a[0] - b[0]);

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
