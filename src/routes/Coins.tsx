import { useQueries, useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components"
import { fetchCoinHistory, fetchCoins } from "../api";
import ApexCharts from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
import { useState } from "react";

const Container = styled.div`
    width: 100%;
`;

const Header = styled.div`
    padding: 12px 10px 15px;
    background-color: ${(props) => props.theme.bgColor};
    margin-bottom: 5px;
    border-radius: 10px;
`;

const Title = styled.h1`
    font-size: 21px;
    color: ${(props) => props.theme.textColor};
`;

const Loading = styled.span`
    display: block;
    text-align: center;
`;

const CoinTop3 = styled.ul`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 5px 0;
    margin-bottom: 10px;
`;

const TopCoin = styled.li`
    width: calc(100% / 3 - 3px);
    padding: 20px 10px;
    background-color: ${(props) => props.theme.bgColor};
    border-radius: 10px;
    .hashBox{
        display: flex;
        gap: 5px;
        margin-bottom: 10px;
        > span{
            padding: 3px 7px;
            background-color: ${(props) => props.theme.textColor};
            border-radius: 5px;
            color: ${(props) => props.theme.bgColor};
            opacity: 0.5;
        }
    }
    .TopBox{
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: ${(props) => props.theme.textColor};
        margin-bottom: 10px;
        > span{
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            font-weight: 600;
        }
        img{
            width: 35px;
        }
    }
    @media screen and (max-width: 1024px) {
        width: 100%;
    }
`;

const CoinsList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
`;

const Coin = styled.li`
    width: calc(25% - 3px);
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
    border-radius: 10px;
    a{
        display: block;
        padding: 20px 10px;
        border-radius: 15px;
        transition: color 0.2s ease-in;
        .LinkTop{
            display: flex;
            justify-content: space-between;
            align-items: center;
            > span{
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 18px;
                font-weight: 600;
            }
            img{
                width: 35px;
            }
            svg{
                width: 22px;
            }
        }
        .LinkBottom{
            display: flex;
            gap: 5px;
            margin-top: 40px;
            > span{
                padding: 3px 7px;
                background-color: ${(props) => props.theme.textColor};
                border-radius: 5px;
                color: ${(props) => props.theme.bgColor};
                opacity: 0.5;
            }
        }
    }
    &:hover{
        a{
            color: ${(props) => props.theme.accentColor};
        }
    }
    @media screen and (max-width: 1200px) {
        width: calc(100% / 3 - 4px);
    }
    @media screen and (max-width: 1024px) {
        width: calc(50% - 2.5px);
    }
    @media screen and (max-width: 560px) {
        a{
            .LinkTop{
                > span{
                    font-size: 16px;
                }
                img{
                    width: 30px;
                }
                svg{
                    width: 20px;
                }
            }
            .LinkBottom{
                margin-top: 30px;
                > span{
                    padding: 3px;
                    font-size: 14px;
                }
            }
        }
    }
`;

const CoinAddButton = styled.button`
    width: 100%;
    padding: 30px 10px;
    background-color: ${(props) => props.theme.bgColor};
    border-radius: 10px;
    border: none;
    text-align: center;
    font-size: 23px;
    font-weight: 400;
    margin-top: 10px;
    color: ${(props) => props.theme.textColor};
    &:hover{
        color: ${(props) => props.theme.accentColor};
    }
`;

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

interface CoinData {
    time_close: number[];
    close: number[];
}

export default function Coins() {
    const isDark = useRecoilValue(isDarkAtom);
    const [listCount, setListCount] = useState(30);
    const {isLoading, data} = useQuery<IPriceData[]>(["allCoins",listCount], () => fetchCoins(listCount));
    const top3RankId = data?.filter((x) => x.rank < 4).map((x) => x.id);
    const top3CoinQueries = (top3RankId || []).map(id => {
        return {
          queryKey: ['top3Coins', id],
          queryFn: () => fetchCoinHistory(id),
        };
    });
    const top3CoinData = useQueries(top3CoinQueries);
    let top3Data: CoinData[] = [];
    for(let i = 0; i < top3CoinData.length; i++) { 
        let closeArr = [];
        let timeCloseArr = [];
        if (!top3CoinData[i].isLoading) {
            for(let j = 0; j < top3CoinData[i].data.length; j++) {
                closeArr.push(parseFloat(top3CoinData[i].data[j]['close']));
                timeCloseArr.push(top3CoinData[i].data[j]['time_close']);
            }
        }
        top3Data.push({close: closeArr, time_close: timeCloseArr});
    }
    
    /* const [coins, setCoins] = useState<CoinInterface[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async() => {
            const response = (await fetch("https://api.coinpaprika.com/v1/coins"));
            const json = await response.json();
            setCoins(json.slice(0,100))
            setLoading(false);
        })();
    }, []); */

    return (
        <Container>
            <>
                <Header>
                    <Title>Top3 Crypto List</Title>
                </Header>
                {isLoading ? 
                ("Loading...")
                :
                (<CoinTop3>
                    {data?.slice(0,3).map((coin,i) => (
                        <TopCoin key={coin.id}>
                            <div className="hashBox">
                                <span>RANK #{coin.rank}</span>
                                <span>{coin.symbol}</span>
                            </div>
                            <div className="TopBox">
                                <span>
                                    <img src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`} alt={coin.name} />
                                    {coin.name} 
                                </span>
                                <span>${coin.quotes.USD.price.toFixed(3)}</span>
                            </div>
                            <div className="BotmBox">
                                {top3Data ? (
                                <ApexCharts 
                                    type="line"
                                    series={[
                                    {
                                        name: "Price",
                                        data: top3Data[i].close,
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
                                        show: false,
                                    },
                                    xaxis: {
                                        type: "datetime",
                                        categories: top3Data[i].time_close.map((date) => new Date(date * 1000).toUTCString()),
                                        labels: {
                                            style: {
                                                colors: isDark ? "#ffffff" : "#000000"
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
                                />
                                ) : ( 
                                "Loading..."
                                )}
                            </div>
                        </TopCoin>
                    ))}
                </CoinTop3>)
                }
            </>
            <>
                <Header>
                    <Title>Crypto List</Title>
                </Header>
                {isLoading ?
                (<Loading>Loading...</Loading>)
                :
                (
                <>
                    <CoinsList>
                        {data?.map((coin) => (
                            <Coin key={coin.id}>
                                <Link
                                    to={{pathname: `coin/${coin.id}`}}
                                    state={{ name: coin.name }}
                                >
                                    <div className="LinkTop">
                                        <span>
                                            <img src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`} alt={coin.name} />
                                            {coin.name} 
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                        </svg>
                                    </div>
                                    <div className="LinkBottom">
                                        <span>RANK #{coin.rank}</span>
                                        <span>{coin.symbol}</span>
                                    </div>
                                </Link>
                            </Coin>
                        ))}
                    </CoinsList>
                    <CoinAddButton onClick={() => setListCount(listCount + 30)}>+ Added 30 lists</CoinAddButton>
                </>
                )
                }
            </>
        </Container>
    )
}