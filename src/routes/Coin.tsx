import { useEffect } from "react";
import { Link, useLocation, useParams, useMatch, useOutletContext } from "react-router-dom"
import styled from "styled-components";
// import Price from "../components/Price";
// import Chart from "../components/Chart";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

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
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{$isActive : boolean}>`
  padding: 7px 0px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  text-transform: uppercase;
  color: ${(props) => props.$isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
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

interface outletProps {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

export default function Coin() {
    const {coinId} = useParams();
    const {state} = useLocation();
    const priceMatch = useMatch('/:conId/price');
    const chartMatch = useMatch('/:conId/chart');
    const {isLoading : infoLoading, data : inforData} = useQuery<IInfoData>(["info",coinId], () => coinId ? fetchCoinInfo(coinId) : Promise.reject('No coinId'))
    const {isLoading : tickersLoading, data : tickersData} = useQuery<IPriceData>(["tickers",coinId], () => coinId ? fetchCoinTickers(coinId) : Promise.reject('No coinId'))
    const {setTitle,setDescription} = useOutletContext<outletProps>();
    /* const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState<IInfoData>();
    const [priceInfo, setPriceInfo] = useState<IPriceData>();
    useEffect(() => {
        (async () => {
            const inforData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
            ).json();
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
            ).json();
            setInfo(inforData);
            setPriceInfo(priceData);
            setLoading(false);
        })();
    }, [coinId]); */
    const loading = infoLoading || tickersLoading;
    useEffect(() => {
      if (!loading && (inforData?.description !== undefined || inforData?.name !== undefined)) {
        setTitle(inforData?.name);
        setDescription(inforData?.description);
      }
    },[loading, inforData, setDescription, setTitle]);
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
            <Title>
              {state?.name ? state.name : loading ? "Loading..." : inforData?.name}
            </Title>
          </Header>
          {loading ? 
          (<Loader>Loading...</Loader>)
          :
          (
            <>
                <Overview>
                    <OverviewItem>
                        <span>Rank:</span>
                        <span>{inforData?.rank}</span>
                    </OverviewItem>
                    <OverviewItem>
                        <span>Symbol:</span>
                        <span>${inforData?.symbol}</span>
                    </OverviewItem>
                    <OverviewItem>
                        <span>Price:</span>
                        <span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
                    </OverviewItem>
                </Overview>
                <Overview>
                    <OverviewItem>
                        <span>Total Suply:</span>
                        <span>{tickersData?.total_supply}</span>
                    </OverviewItem>
                    <OverviewItem>
                        <span>Max Supply:</span>
                        <span>{tickersData?.max_supply}</span>
                    </OverviewItem>
                </Overview>
                <Tabs>
                    <Tab $isActive={chartMatch !== null}>
                        <Link to={`/${coinId}/chart`}>Chart</Link>
                    </Tab>
                    <Tab $isActive={priceMatch !== null}>
                        <Link to={`/${coinId}/price`}>Price</Link>
                    </Tab>
                </Tabs>
                {/* <Switch>
                    <Route path={`/${coinId}/price`}>
                        <Price />
                    </Route>
                    <Route path={`/${coinId}/chart`}>
                        <Chart coinId={coinId} />
                    </Route>
                </Switch> */}
            </>
          )
          }
        </Container>
    );
}