import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useOutletContext } from "react-router-dom"
import styled from "styled-components";
import { useQuery } from "react-query";
import { fetchCoinHistory, fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";
import ApexCharts from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Container = styled.div`
  position: relative;
`;

const HomeMove = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.theme.textColor};
  border-radius: 50%;
  color: ${(props) => props.theme.bgColor};
  svg{
    width: 22px;
  }
`;

const Header = styled.header`
  width: 100%;
  padding: 70px 0 25px;
`;

const Title = styled.h1<{$colorPer : string}>`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${(props) => props.theme.textColor};
  img{
    width: 35px;
  }
  .title{
    font-size: 35px;
    font-weight: 400;
  }
  .price{
    font-size: 24px;
    color: ${(props) => props.$colorPer};
    margin-left: 10px;
  }
  .per{
    display: block;
    padding: 2px 4px;
    background-color: ${(props) => props.$colorPer};
    border-radius: 3px;
    color: #ffffff;
  }
`;

const ChartBox = styled.div`
  padding: 30px 20px;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ChartBtnBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  width: 90px;
`;

const ChartBtn = styled.button<{$isActive : boolean}>`
  width: calc(50% - 2.5px);
  background-color: ${(props) => props.$isActive ? props.theme.accentColor : props.theme.bgColor2};
  color: ${(props) => props.theme.textColor};
  border-radius: 5px;
  border: none;
  text-align: center;
  svg{
    width: 85%;
  }
`;

const PriceUl = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
`;

const PriceLi = styled.ul<{$colorPer? : string}>`
  width: calc(100% / 3 - 4px);
  padding: 15px;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 10px;
  font-size: 18px;
  p{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 42px;
    font-weight: 600;
    color: ${(props) => props.$colorPer};;
    margin-top: 10px;
    &.sTxt{
      padding: 10px 0;
      margin-top: 0;
      span:first-child{
        font-size: 25px;
      }
    }
    svg{
      width: 60px;
    }
  }
`;

interface IInfoData {
  id : string;
  name : string;
  symbol : string;
  rank : number;
  is_new : boolean;
  is_active : boolean;
  type : string;
  logo : string;
  description : string;
  message : string;
  open_source : boolean;
  started_at : string;
  development_status : string;
  hardware_wallet : boolean;
  proof_type : string;
  org_structure : string;
  hash_algorithm : string;
  first_data_at : string;
  last_data_at : string;
}

interface IPriceData {
  id : string;
  name : string;
  symbol : string;
  rank : number;
  circulating_supply : number;
  total_supply : number;
  max_supply : number;
  beta_value : number;
  first_data_at : string;
  last_updated : string;
  quotes : {
    USD : {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    }
  };
}

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

interface outletProps {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

export default function Coin() {
  const isDark = useRecoilValue(isDarkAtom);
  const {coinId} = useParams();
  const {state} = useLocation();
  const {isLoading : infoLoading, data : inforData} = useQuery<IInfoData>(["info",coinId], () => coinId ? fetchCoinInfo(coinId) : Promise.reject('No coinId'));
  const {isLoading : tickersLoading, data : tickersData} = useQuery<IPriceData>(["tickers",coinId], () => coinId ? fetchCoinTickers(coinId) : Promise.reject('No coinId'));
  const {isLoading : chartLoading, data : chartData} = useQuery<IHistorical[]>(["ohlcv",coinId],() => coinId? fetchCoinHistory(coinId) : Promise.reject('No coinId'));
  const [chartType, setChartType] = useState<number>(0);
  const {setTitle,setDescription} = useOutletContext<outletProps>();
  const loading = infoLoading || tickersLoading;
  useEffect(() => {
    if (!loading && (inforData?.description !== undefined || inforData?.name !== undefined)) {
      setTitle(inforData?.name);
      setDescription(inforData?.description);
    }
  },[loading, inforData, setDescription, setTitle]);
  const exceptData = chartData ?? [];
  const candleData = exceptData?.map((i) => {
    return {
      x: new Date(+i.time_close * 1000).toUTCString(),
      y: [i.open, i.high, i.low, i.close],
    }
  });
  return (
    <Container>
      <Helmet>
        <title>{state?.name ? state.name : loading ? "Loading..." : inforData?.name}</title>
        <link rel="icon" type="image/png" href={`https://coinicons-api.vercel.app/api/icon/${inforData?.symbol.toLowerCase()}`} sizes="16x16" />
      </Helmet>
      <HomeMove>
        <Link to="/" onClick={() => {setTitle("Crypto-tracker"); setDescription("");}}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </Link>
      </HomeMove>
      <Header>
        {inforData && tickersData ? 
        (<Title $colorPer={tickersData?.quotes.USD.percent_change_15m > 0 ? "#c84a31":"#1261c4"}>
          <img src={`https://coinicons-api.vercel.app/api/icon/${inforData?.symbol.toLowerCase()}`} alt={inforData?.name} />
          <span className="title">{state?.name ? state.name : loading ? "Loading..." : inforData?.name}</span>
          <span className="price">${tickersData?.quotes.USD.price.toFixed(3)}</span>
          <span className="per">{tickersData?.quotes.USD.percent_change_15m}%</span>
        </Title>
        ) : (<span>Loading...</span>)}
      </Header>
      {loading ? 
      (<Loader>Loading...</Loader>)
      :
      (
        <>
          {!chartLoading &&
          <ChartBox>
            <ChartBtnBox>
              <ChartBtn $isActive={chartType === 0} onClick={() => setChartType(0)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </ChartBtn>
              <ChartBtn $isActive={chartType === 1} onClick={() => setChartType(1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </ChartBtn>
            </ChartBtnBox>
            {chartData &&
            (chartType === 0 ?
            (<ApexCharts
              type="line"
              series={[
              {
                name: "Price",
                data: chartData?.map((x) => +x.close),
              },
              ]}
              options={{
              theme: {
                mode: isDark ? "dark" : "light",
              },
              chart: {
                height: 100,
                width: 100,
                zoom: {
                  enabled: false
                },
                background: "transparent",
              },
              stroke: {
                curve: "smooth",
                width: 3,
              },
              yaxis: {
                tooltip: {
                  enabled: true
                }
              },
              xaxis: {
                type: "datetime",
                categories: chartData?.map((date) => new Date(+date.time_close * 1000).toUTCString()),
                labels: {
                  style: {
                    colors: isDark ? "#ffffff" : "#000000",
                  }
                }
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
            />) :
            (<ApexCharts 
              type="candlestick"
              series={[
                {
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
                  zoom: {
                    enabled: false
                  },
                  background: "transparent",
                },
                yaxis: {
                  tooltip: {
                    enabled: true
                  }
                },
                xaxis: {
                  type: "datetime",
                  labels: {
                    style: {
                      colors: isDark ? "#ffffff" : "#000000",
                    }
                  }
                },
              }}
            />))
            }
          </ChartBox>
          }
          {tickersData &&
          <PriceUl>
            <PriceLi $colorPer={tickersData?.quotes.USD.percent_change_30m > 0 ? "#c84a31":"#1261c4"}>
              30분 전보다
              <p>
                <span>{tickersData?.quotes.USD.percent_change_30m}%</span>
                {tickersData?.quotes.USD.percent_change_30m > 0 ?
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>)
                :
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                </svg>)
                }
              </p>
            </PriceLi>
            <PriceLi $colorPer={tickersData?.quotes.USD.percent_change_1h > 0 ? "#c84a31":"#1261c4"}>
              1시간 전보다
              <p>
                <span>{tickersData?.quotes.USD.percent_change_1h}%</span>
                {tickersData?.quotes.USD.percent_change_1h > 0 ?
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>)
                :
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                </svg>)
                }
              </p>
            </PriceLi>
            <PriceLi $colorPer={tickersData?.quotes.USD.percent_change_6h > 0 ? "#c84a31":"#1261c4"}>
              6시간 전보다
              <p>
                <span>{tickersData?.quotes.USD.percent_change_6h}%</span>
                {tickersData?.quotes.USD.percent_change_6h > 0 ?
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>)
                :
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                </svg>)
                }
              </p>
            </PriceLi>
            <PriceLi $colorPer={tickersData?.quotes.USD.percent_change_12h > 0 ? "#c84a31":"#1261c4"}>
              12시간 전보다
              <p>
                <span>{tickersData?.quotes.USD.percent_change_12h}%</span>
                {tickersData?.quotes.USD.percent_change_12h > 0 ?
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>)
                :
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                </svg>)
                }
              </p>
            </PriceLi>
            <PriceLi $colorPer={tickersData?.quotes.USD.percent_change_24h > 0 ? "#c84a31":"#1261c4"}>
              하루 전보다
              <p>
                <span>{tickersData?.quotes.USD.percent_change_24h}%</span>
                {tickersData?.quotes.USD.percent_change_24h > 0 ?
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>)
                :
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                </svg>)
                }
              </p>
            </PriceLi>
            <PriceLi $colorPer={tickersData?.quotes.USD.percent_change_7d > 0 ? "#c84a31":"#1261c4"}>
              일주일 전보다
              <p>
                <span>{tickersData?.quotes.USD.percent_change_7d}%</span>
                {tickersData?.quotes.USD.percent_change_7d > 0 ?
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>)
                :
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                </svg>)
                }
              </p>
            </PriceLi>
          </PriceUl>
          }
        </>
      )}
    </Container>
  );
}