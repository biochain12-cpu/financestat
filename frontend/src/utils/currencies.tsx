import adaSvg from "../assets/icons/ada.svg";
import alfabankPng from "../assets/icons/alfabank.png";
import alipayPng from "../assets/icons/alipay.png";
import bnbSvg from "../assets/icons/bnb.svg";
import btcSvg from "../assets/icons/btc.svg";
import capitalistPng from "../assets/icons/capitalist.png";
import daiSvg from "../assets/icons/dai.svg";
import dogeSvg from "../assets/icons/doge.svg";
import ethSvg from "../assets/icons/eth.svg";
import jusanPng from "../assets/icons/jusan.png";
import kaspiPng from "../assets/icons/kaspi.png";
import ltcSvg from "../assets/icons/ltc.svg";
import mirPng from "../assets/icons/mir.png";
import moneygoPng from "../assets/icons/moneygo.png";
import ozonPng from "../assets/icons/ozon.png";
import payeerPng from "../assets/icons/payeer.png";
import sberPng from "../assets/icons/sber.png";
import sbpPng from "../assets/icons/sbp.png";
import solSvg from "../assets/icons/sol.svg";
import tinkoffPng from "../assets/icons/tinkoff.png";
import tonSvg from "../assets/icons/ton.svg";
import trxSvg from "../assets/icons/trx.svg";
import usdcSvg from "../assets/icons/usdc.svg";
import usdtSvg from "../assets/icons/usdt.svg";
import visaPng from "../assets/icons/visa.png";
import voletPng from "../assets/icons/volet.png";
import vtbPng from "../assets/icons/vtb.png";
import wechatPng from "../assets/icons/wechat.png";
import xmrSvg from "../assets/icons/xmr.svg";
import xrpSvg from "../assets/icons/xrp.svg";
import yoomoneyPng from "../assets/icons/yoomoney.png";

export const currencies = [
  // RUB и банки/кошельки RUB
  { code: "RUB", icon: <span style={{ fontWeight: 700 }}>RUB</span> },
  { code: "SBER", icon: <img src={sberPng} alt="Sber" width={20} height={20} /> },
  { code: "Tinkoff", icon: <img src={tinkoffPng} alt="Tinkoff" width={20} height={20} /> },
  { code: "SBP", icon: <img src={sbpPng} alt="SBP" width={20} height={20} /> },
  { code: "ЮMoney", icon: <img src={yoomoneyPng} alt="ЮMoney" width={20} height={20} /> },
  { code: "AlfaBank", icon: <img src={alfabankPng} alt="AlfaBank" width={20} height={20} /> },
  { code: "Mir", icon: <img src={mirPng} alt="Mir" width={20} height={20} /> },
  { code: "Ozon", icon: <img src={ozonPng} alt="Ozon" width={20} height={20} /> },
  { code: "VTB", icon: <img src={vtbPng} alt="VTB" width={20} height={20} /> },
  { code: "VoletRUB", icon: <img src={voletPng} alt="VoletRUB" width={20} height={20} /> },
  { code: "PayeerRUB", icon: <img src={payeerPng} alt="PayeerRUB" width={20} height={20} /> },
  { code: "CapitalistRUB", icon: <img src={capitalistPng} alt="CapitalistRUB" width={20} height={20} /> },
  { code: "VisaRUB", icon: <img src={visaPng} alt="VisaRUB" width={20} height={20} /> },

  // USD и кошельки USD
  { code: "USD", icon: <span style={{ fontWeight: 700 }}>USD</span> },
  { code: "VoletUSD", icon: <img src={voletPng} alt="VoletUSD" width={20} height={20} /> },
  { code: "PayeerUSD", icon: <img src={payeerPng} alt="PayeerUSD" width={20} height={20} /> },
  { code: "CapitalistUSD", icon: <img src={capitalistPng} alt="CapitalistUSD" width={20} height={20} /> },
  { code: "MoneyGoUSD", icon: <img src={moneygoPng} alt="MoneyGoUSD" width={20} height={20} /> },
  { code: "USDT", icon: <img src={usdtSvg} alt="USDT" width={20} height={20} /> },
  { code: "VisaUSD", icon: <img src={visaPng} alt="VisaUSD" width={20} height={20} /> },

  // EUR и кошельки EUR
  { code: "EUR", icon: <span style={{ fontWeight: 700 }}>EUR</span> },
  { code: "VoletEUR", icon: <img src={voletPng} alt="VoletEUR" width={20} height={20} /> },
  { code: "PayeerEUR", icon: <img src={payeerPng} alt="PayeerEUR" width={20} height={20} /> },
  { code: "CapitalistEUR", icon: <img src={capitalistPng} alt="CapitalistEUR" width={20} height={20} /> },

  // KZT и банки
  { code: "KZT", icon: <img src={kaspiPng} alt="KZT" width={20} height={20} /> },
  { code: "Kaspi", icon: <img src={kaspiPng} alt="Kaspi" width={20} height={20} /> },
  { code: "Jusan", icon: <img src={jusanPng} alt="Jusan" width={20} height={20} /> },
  { code: "VisaKZT", icon: <img src={visaPng} alt="VisaKZT" width={20} height={20} /> },

  // CNY и платёжки
  { code: "CNY", icon: <img src={alipayPng} alt="CNY" width={20} height={20} /> },
  { code: "AlipayCNY", icon: <img src={alipayPng} alt="AlipayCNY" width={20} height={20} /> },
  { code: "WeChatCNY", icon: <img src={wechatPng} alt="WeChatCNY" width={20} height={20} /> },

  // TRY и платёжки
  { code: "TRY", icon: <span style={{ fontWeight: 700 }}>TRY</span> },
  { code: "VisaTRY", icon: <img src={visaPng} alt="VisaTRY" width={20} height={20} /> },

  // Криптовалюты
  { code: "BTC", icon: <img src={btcSvg} alt="BTC" width={20} height={20} /> },
  { code: "ETH", icon: <img src={ethSvg} alt="ETH" width={20} height={20} /> },
  { code: "LTC", icon: <img src={ltcSvg} alt="LTC" width={20} height={20} /> },
  { code: "BNB", icon: <img src={bnbSvg} alt="BNB" width={20} height={20} /> },
  { code: "XMR", icon: <img src={xmrSvg} alt="XMR" width={20} height={20} /> },
  { code: "SOL", icon: <img src={solSvg} alt="SOL" width={20} height={20} /> },
  { code: "TON", icon: <img src={tonSvg} alt="TON" width={20} height={20} /> },
  { code: "TRX", icon: <img src={trxSvg} alt="TRX" width={20} height={20} /> },
  { code: "XRP", icon: <img src={xrpSvg} alt="XRP" width={20} height={20} /> },
  { code: "DOGE", icon: <img src={dogeSvg} alt="DOGE" width={20} height={20} /> },
  { code: "ADA", icon: <img src={adaSvg} alt="ADA" width={20} height={20} /> },
  { code: "USDC", icon: <img src={usdcSvg} alt="USDC" width={20} height={20} /> },
  { code: "DAI", icon: <img src={daiSvg} alt="DAI" width={20} height={20} /> },

  // Если нет картинки — заглушка
  { code: "Unknown", icon: <span style={{ fontWeight: 700, color: "#bbb" }}>?</span> }
];

