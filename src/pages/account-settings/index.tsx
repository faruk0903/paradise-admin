import { Fragment, useState } from "react";

import { Row, Col, TabContent, TabPane } from "reactstrap";

import Tabs from "./Tabs";
import Breadcrumbs from "../../components/breadcrumbs/index";
import AccountTabContent from "./AccountTabContent";
import SecurityTabContent from "./SecurityTabContent";

import "../../assets/scss/react/libs/flatpickr/flatpickr.scss";
import "../../assets/scss/react/pages/page-account-settings.scss";

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <Fragment>
      <Breadcrumbs title="My Profile" data={[{ title: "Profile" }]} />
      <Row>
        <Col xs={12}>
          <Tabs activeTab={activeTab} toggleTab={setActiveTab} />
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <AccountTabContent />
            </TabPane>
            <TabPane tabId="2">
              <SecurityTabContent />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AccountSettings;
