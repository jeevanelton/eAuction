import { Link } from "react-router-dom";
import {
  CardHeader,
  Card,
  CardTitle,
  CardBody,
  Row,
  Col,
  Button,
} from "reactstrap";
import useJwt from "@src/auth/jwt/useJwt";
import { useEffect, useState } from "react";
import { API_URL } from "../configs/constants";
import { getUserData } from "../utility/Utils";

const initialState = {
  email: "",
  firstName: "",
  lastName: "",
  fatherOrHusbandName: "",
  orgName: "",
  authorizedPerson: "",
  designation: "",
  address1: "",
  address2: "",
  country: "",
  state: "",
  city: "",
  registerAs: "",
  pincode: "",
  form16: "",
  panNumber: "",
  phone: "",
  mobile: "",
  faxNumber: "",
};

const ViewProfile = () => {
  const [userValues, setUserValues] = useState(initialState);

  useEffect(() => {
    const userId = getUserData().userId;
    async function fetchData() {
      try {
        const result = await useJwt.get(`${API_URL}/users/${userId}`);
        console.log(result.data);

        setUserValues({
          ...userValues,
          ...result.data,
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">My Profile</CardTitle>
      </CardHeader>

      <CardBody>
        {userValues.email && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>Email ID</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.email}</dd>
              </Col>
            </Row>
          </dl>
        )}
        {userValues.registerAs && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>Registered As</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.registerAs}</dd>
              </Col>
            </Row>
          </dl>
        )}
        {userValues.firstName && userValues.lastName && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>Full Name</dt>
              </Col>
              <Col sm="9">
                <dd>{`${userValues.firstName} ${userValues.lastName}`}</dd>
              </Col>
            </Row>
          </dl>
        )}
        {userValues.fatherOrHusbandName && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>Father's Name / Husband Name</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.fatherOrHusbandName}</dd>
              </Col>
            </Row>
          </dl>
        )}
        {userValues.orgName && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>Orgainzation Name</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.orgName}</dd>
              </Col>
            </Row>
          </dl>
        )}
        {userValues.authorizedPerson && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>Authorized Person</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.authorizedPerson}</dd>
              </Col>
            </Row>
          </dl>
        )}
        {userValues.designation && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>Designation</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.designation}</dd>
              </Col>
            </Row>
          </dl>
        )}

        {userValues.mobile && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>Mobile Number</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.mobile}</dd>
              </Col>
            </Row>
          </dl>
        )}
        {userValues.country && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>Country</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.country}</dd>
              </Col>
            </Row>
          </dl>
        )}
        {userValues.state && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>State</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.state}</dd>
              </Col>
            </Row>
          </dl>
        )}
        {userValues.city && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>City</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.city}</dd>
              </Col>
            </Row>
          </dl>
        )}
        {userValues.address1 && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>Address 1</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.address1}</dd>
              </Col>
            </Row>
          </dl>
        )}
        {userValues.pincode && (
          <dl>
            <Row>
              <Col sm="3">
                <dt>Zip/ Pincode</dt>
              </Col>
              <Col sm="9">
                <dd>{userValues.pincode}</dd>
              </Col>
            </Row>
          </dl>
        )}
        <Button.Ripple
          tag={Link}
          to="/my-profile-edit"
          className="mr-1"
          color="primary"
          onClick={(e) => {
            console.log("clicked");
            return;
          }}
        >
          Edit
        </Button.Ripple>
      </CardBody>
    </Card>
  );
};

export default ViewProfile;
