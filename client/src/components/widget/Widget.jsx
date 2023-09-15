import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import GroupIcon from "@mui/icons-material/Group";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import FeaturedVideoIcon from "@mui/icons-material/FeaturedVideo";
const Widget = ({ type }) => {
  let data;

  //temporary
  const amount = 100;
  const diff = 20;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        icon: (
          <GroupIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "#f6e58d",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "Adverticements",
        isMoney: false,
        link: "View all adverticements",
        icon: (
          <FeaturedVideoIcon
            className="icon"
            style={{
              backgroundColor: "#4834d4",
              color: "white",
            }}
          />
        ),
      };
      break;
    case "netural":
      data = {
        title: "Requets",
        isMoney: false,
        link: "View net earnings",
        icon: (
          <SentimentNeutralIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "REQUESTS",
        isMoney: false,
        link: "See requests",
        icon: (
          <ScheduleSendIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
