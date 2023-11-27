import styled from "styled-components"
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const Warpper = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100vh;
`;

const Infor = styled.div`
    width: 400px;
`;

const Content = styled.div`
    width: calc(100% - 400px);
    height: 100%;
    padding: 30px;
    background-color: ${(props) => props.theme.bgColor2};
    overflow-y: auto;
`;

export default function Layout() {
    const [title, setTitle] = useState("Crypto-tracker");
    const [description, setDescription] = useState("");
    return (
        <Warpper>
            <Infor>
                <Header title={title} description={description} />
            </Infor>
            <Content>
                <Outlet context={{setTitle, setDescription}} />
            </Content>
        </Warpper>
    )
};