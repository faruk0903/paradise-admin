// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Icons Imports
import { MapPin, Layers, CheckCircle, Clock, XCircle } from "react-feather";

// ** Styles
import "../../assets/scss/react/apps/app-users.scss";
import StatsHorizontal from "./StatsHorizontal";
import { useQuery } from "@tanstack/react-query";
import { GetDashBoardCountApi } from "../../api/dashboard";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const navigate = useNavigate();
  const { data } = useQuery<any>(["GetDashboardCounts"], () =>
    GetDashBoardCountApi()
  );

  const counts = data?.data || {};

  const cards = [
    {
      title: "Total Sites",
      value: counts.totalSites,
      color: "primary",
      icon: <MapPin size={20} />,
      onClick: () => navigate("/siteList"),
    },
    {
      title: "All Bookings",
      value: counts.totalBookings,
      color: "info",
      icon: <Layers size={20} />,
      onClick: () => navigate("/bookingList", { state: { status: "" } }),
    },
    {
      title: "Active Bookings",
      value: counts.activeBookings,
      color: "warning",
      icon: <Clock size={20} />,
      onClick: () => navigate("/bookingList", { state: { status: "active" } }),
    },
    {
      title: "Completed Bookings",
      value: counts.completedBookings,
      color: "success",
      icon: <CheckCircle size={20} />,
      onClick: () =>
        navigate("/bookingList", { state: { status: "completed" } }),
    },
    {
      title: "Cancelled Bookings",
      value: counts.cancelledBookings,
      color: "danger",
      icon: <XCircle size={20} />,
      onClick: () =>
        navigate("/bookingList", { state: { status: "cancelled" } }),
    },
  ];

  return (
    <div className="app-user-list">
      <Row>
        {cards.map((card) => (
          <Col lg="3" sm="6" key={card.title}>
            <div className="cursor-pointer" onClick={card.onClick}>
              <StatsHorizontal
                color={card.color}
                statTitle={card.title}
                icon={card.icon}
                renderStats={
                  <h3 className="fw-bolder mb-75">{card.value ?? 0}</h3>
                }
              />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UsersList;
