import { MoreVertical, Edit, Trash } from "react-feather";
import {
  Table,
  Badge,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { useEffect, useState } from "react";
import useJwt from "@src/auth/jwt/useJwt";
import { API_URL } from "../../configs/constants";
import moment from "moment";
import { useHistory } from "react-router";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "@components/spinner/Loading-spinner";
import { isObjEmpty } from "../../utility/Utils";

const ViewAdvertisement = () => {
  const history = useHistory();

  const [advertisement, setAdvertisement] = useState([]);
  const [pages, setPages] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [showLoader, setShowLoader] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordId, setRecordId] = useState(null);

  const fetchData = async () => {
    setShowLoader(true);
    try {
      const result = await useJwt.get(`${API_URL}/advertisements`);
      setAdvertisement(result.data.data);
      setPages({
        currentPage: result.data.currentPage,
        totalPages: result.data.totalPages,
      });
    } catch (error) {
      console.log(error);
      setShowLoader(false);
    }
    setShowLoader(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  //-------getting data for the current page------
  useEffect(() => {
    setShowLoader(true);
    const fetchCurrentPageData = async () => {
      try {
        const result = await useJwt.get(
          `${API_URL}/advertisements?page=${pages.currentPage}`
        );
        setAdvertisement(result.data.data);
      } catch (error) {
        console.log(error);
        setShowLoader(false);
      }
      setShowLoader(false);
    };
    fetchCurrentPageData();
  }, [pages.currentPage]);

  const handleDelete = async (id) => {
    try {
      setShowLoader(true);
      await useJwt.delete(`${API_URL}/advertisements/${id}`);
      closeDeleteModalHandler();
      fetchData();
    } catch (error) {
      console.log(error);
      setShowLoader(false);
    }
    setShowLoader(false);
  };

  const handleEdit = async (id) => {
    history.push(`/advertisement/update-advertisement/${id}`);
  };

  const openDeleteModalHandler = (id) => {
    setShowDeleteModal(true);
    setRecordId(id);
  };

  const closeDeleteModalHandler = () => {
    setShowDeleteModal(false);
    setRecordId(null);
  };

  const paginationHandler = (value) => {
    setPages({ ...pages, currentPage: value });
  };

  return (
    <Fragment>
      {showLoader && <LoadingSpinner />}

      <Modal isOpen={showDeleteModal} toggle={closeDeleteModalHandler}>
        <ModalHeader toggle={closeDeleteModalHandler}>
          Delete Confirmation
        </ModalHeader>
        <ModalBody>Are you sure want to Delete?</ModalBody>
        <ModalFooter>
          <Button.Ripple color="secondary" onClick={closeDeleteModalHandler}>
            Cancel
          </Button.Ripple>
          <Button.Ripple color="danger" onClick={() => handleDelete(recordId)}>
            Delete
          </Button.Ripple>
        </ModalFooter>
      </Modal>

      {!showLoader && (
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
                          {/* <DropdownItem onClick={(e) => handleDelete(ad._id)}>
                        <Trash className="mr-50" size={15} />{" "}
                        <span className="align-middle">Delete</span>
                      </DropdownItem> */}
                          <DropdownItem
                            onClick={() => openDeleteModalHandler(ad._id)}
                          >
                            <Trash className="mr-50" size={15} />{" "}
                            <span className="align-middle">Delete</span>
                          </DropdownItem>{" "}
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
          {!isObjEmpty(pages) && pages.totalPages > 1 && (
            <Pagination className="mt-1">
              <PaginationItem disabled={pages.currentPage === 1}>
                <PaginationLink
                  first
                  onClick={() => setPages({ ...pages, currentPage: 1 })}
                />
              </PaginationItem>
              <PaginationItem disabled={pages.currentPage === 1}>
                <PaginationLink
                  previous
                  onClick={() =>
                    setPages({
                      ...pages,
                      currentPage: pages.currentPage - 1,
                    })
                  }
                />
              </PaginationItem>

              {[...Array(pages.totalPages).keys()].map((value) => {
                return (
                  <PaginationItem
                    key={value + 1}
                    active={value + 1 === pages.currentPage}
                  >
                    <PaginationLink
                      onClick={() => paginationHandler(value + 1)}
                    >
                      {value + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem disabled={pages.currentPage === pages.totalPages}>
                <PaginationLink
                  next
                  onClick={() =>
                    setPages({
                      ...pages,
                      currentPage: pages.currentPage + 1,
                    })
                  }
                />
              </PaginationItem>
              <PaginationItem disabled={pages.currentPage === pages.totalPages}>
                <PaginationLink
                  last
                  onClick={() =>
                    setPages({ ...pages, currentPage: pages.totalPages })
                  }
                />
              </PaginationItem>
            </Pagination>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ViewAdvertisement;
