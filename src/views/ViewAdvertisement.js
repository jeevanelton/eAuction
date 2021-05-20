import { MoreVertical, Edit, Trash } from "react-feather";
import {
  Table,
  Badge,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
} from "reactstrap";
import { useEffect, useState } from "react";
import useJwt from "@src/auth/jwt/useJwt";
import { API_URL } from "../configs/constants";
import moment from "moment";
import { useHistory } from "react-router";
import { Fragment } from "react";
import { Link } from "react-router-dom";

const ViewAdvertisement = () => {
  const history = useHistory();

  const [advertisement, setAdvertisement] = useState([]);

  const fetchData = async () => {
    try {
      const result = await useJwt.get(`${API_URL}/advertisements`);
      setAdvertisement(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await useJwt.delete(`${API_URL}/advertisements/${id}`);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (id) => {
    history.push(`/advertisement/update-advertisement/${id}`);
  };

  return (
    <Fragment>
      <Button.Ripple
        tag={Link}
        to="/advertisement/add-advertisement"
        className="mr-1 mb-2"
        color="primary"
      >
        Add
      </Button.Ripple>
      <Table className="table-hover-animation" responsive>
        <thead>
          <tr>
            <th>Property type</th>
            <th>Property Address</th>
            <th>Property Owned By</th>
            <th>Bid Amount</th>
            <th>Bidding Date</th>
            <th>Bidding Start Time</th>
            <th>Bidding End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {advertisement.length > 0 ? (
            advertisement.map((ad) => (
              <tr key={ad._id}>
                <td>{ad.propertyType}</td>
                <td>{ad.propertyAddress}</td>
                <td>{ad.propertyOwnedBy}</td>
                <td>{ad.bidAmount}</td>
                <td>{moment(ad.biddingDate).format("DD-MM-YYYY")}</td>
                <td>{moment(ad.biddingStartTime).format("hh:mm a")}</td>
                <td>{moment(ad.biddingEndTime).format("hh:mm a")}</td>
                <td>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      className="icon-btn hide-arrow"
                      color="transparent"
                      size="sm"
                      caret
                    >
                      <MoreVertical size={15} />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem onClick={(e) => handleEdit(ad._id)}>
                        <Edit className="mr-50" size={15} />{" "}
                        <span className="align-middle">Edit</span>
                      </DropdownItem>
                      <DropdownItem onClick={(e) => handleDelete(ad._id)}>
                        <Trash className="mr-50" size={15} />{" "}
                        <span className="align-middle">Delete</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center">
              <td colSpan="10">No Record Found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Fragment>
  );
};

export default ViewAdvertisement;
