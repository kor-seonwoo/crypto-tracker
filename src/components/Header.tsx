import styled from "styled-components"
import { useSetRecoilState,useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

const Headers = styled.header`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 20px;
    @media screen and (max-width: 1200px) {
        padding: 10px;
    }
    @media screen and (max-width: 560px) {
        height: auto;
    }
`;

const TopBox = styled.div`

`;

const Title = styled.h2`
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 20px;
    @media screen and (max-width: 560px) {
        font-size: 24px;
    }
`;

const Description = styled.p`
    font-size: 18px;
    font-weight: 400;
    line-height: 1.4;
    margin-bottom: 10px;
`;

const BotmBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    > button{
        width: calc(50% - 5px);
        padding: 10px 0;
        background-color: ${(props) => props.theme.bgColor2};
        border: 0;
        border-radius: 5px;
        font-size: 20px;
        transition: background-color .4s;
        &.currency{
            font-size: 16px;
            font-weight: 600;
            color: ${(props) => props.theme.textColor};
        }
        &:hover{
            background-color: ${(props) => props.theme.accentColor};
        }
    }
    @media screen and (max-width: 560px) {
        > button{
            padding: 4px 0;
            font-size: 14px;
            &.currency{
                font-size: 14px;
            }
        }
    }
`;

interface IHeaderProps {
    title: string;
    description?: string;
}

export default function Header({title, description} : IHeaderProps) {
    const isDark = useRecoilValue(isDarkAtom);
    const setIsDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setIsDarkAtom((prev) => !prev);
    return (
        <Headers>
            <TopBox>
                <Title>{title}</Title>
                <Description>{description}</Description>
            </TopBox>
            <BotmBox>
                <button className="darkOnOff" onClick={toggleDarkAtom}>{isDark ? "🌕":"🌑"}</button>
                <button className="currency">{isDark ? "USD":"KRW"}</button>
            </BotmBox>
        </Headers>
    )
};