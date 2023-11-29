# 암호화폐 OPEN API 활용한 tracker 토이프로젝트 제작

## 목표

"coinpaprika"의 OPEN API를 react-query를 사용하여 data를 fetch하여 암호화폐의 리스트 및 상세페이지에서 코인의 가격, 차트등을 제공하는 사이트 구축.

- <code>react-query</code>를 활용한 data fetch
- <code>styled-components ThemeProvider</code>와 <code>recoil</code>을 활용한 다크모드 기능구현
- <code>APEXCHARTS.JS</code>를 활용한 코인 별 차트 그리기

## 사용스펙

- <code>React</code>
- <code>react-router-dom v6</code>
- <code>react-query</code>
- <code>recoil</code>
- <code>TypeScript</code>
- <code>styled-components</code>

## 구동모습

### # Coins 리스트 ↓

![crypto-tracker_01](https://github.com/kor-seonwoo/crypto-tracker/assets/74663731/de053e98-da46-4854-b02e-2c53307b21aa)

---

### # Coin 상세 페이지. ↓

![crypto-tracker_02](https://github.com/kor-seonwoo/crypto-tracker/assets/74663731/ca001c60-a8ad-44f8-a7fb-21030568d5a0)

---

## 추가 및 수정 예정

- ~~Coins 컴포넌트에서 리스트 더보기 버튼 추가~~
- useInfiniteQuery의 페이징을 활용한 더보기 기능 리팩토링
- 화폐 KRW 단위 변환 기능 추가
- 스켈레톤 UI 적용
