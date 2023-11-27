import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexCharts from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface IHistorical {
    time_open: string;
    time_close: string;
    open: number;
    high:number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}

interface IChartProps {
    coinId : string;
}

export default function Chart({coinId} : IChartProps) {
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv",coinId],() => fetchCoinHistory(coinId));
  const isDark = useRecoilValue(isDarkAtom);
  const exceptData = data ?? [];
  const candleData = exceptData?.map((i) => {
    return {
      x: new Date(+i.time_close * 1000).toUTCString(),
      y: [i.open, i.high, i.low, i.close],
    }
  });
  return (
    <div>
      {isLoading ?
      ("Loading Chart...")
      :
      (
        <>
          <ApexCharts 
            type="candlestick"
            series={[
              {
                name: "Price",
                data: candleData,
              },
            ]}
            options={{
              theme: {
                mode: isDark ? "dark" : "light",
              },
              chart: {
                height: 300,
                width: 500,
                toolbar: {
                  show: false,
                },
                background: "transparent",
              },
              grid: { show: false },
              stroke: {
                curve: "smooth",
                width: 4,
              },
              yaxis: {
                show: false,
              },
              xaxis: {
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: { show: false },
                type: "datetime",
              },
              tooltip: {
                y: {
                  formatter: (value) => `$${value.toFixed(3)}`,
                }
              }
            }}
          />
          <ApexCharts 
            type="line"
            series={[
              {
                name: "Price",
                data: data?.map((price) => price.close) ?? [],
              },
            ]}
            options={{
              theme: {
                mode: isDark ? "dark" : "light",
              },
              chart: {
                height: 300,
                width: 500,
                toolbar: {
                  show: false,
                },
                background: "transparent",
              },
              grid: { show: false },
              stroke: {
                curve: "smooth",
                width: 4,
              },
              yaxis: {
                show: false,
              },
              xaxis: {
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: { show: false },
                type: "datetime",
                categories: data?.map((price) => new Date(+price.time_close * 1000).toUTCString()),
              },
              fill: {
                type: "gradient",
                gradient: {gradientToColors: ["#0be881"], stops: [0, 100]},
              },
              colors: ["#0fbcf9"],
              tooltip: {
                y: {
                  formatter: (value) => `$${value.toFixed(3)}`,
                }
              }
            }}
          />
        </>
      )
      }
    </div>
  )
};