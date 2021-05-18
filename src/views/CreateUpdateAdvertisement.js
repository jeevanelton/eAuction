import * as yup from "yup";
import { useHistory, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import classnames from "classnames";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { useEffect, useState } from "react";
import { API_URL } from "../configs/constants";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import useJwt from "@src/auth/jwt/useJwt";
import { isEmptyObject } from "jquery";

const CreateAdvertisement = () => {
  const params = useParams();

  const history = useHistory();

  const [status, setStatus] = useState("submit");

  //-----schema type for validation--------
  const SignupSchema = yup.object().shape({
    propertyType: yup.string().required("Please enter a Property Type"),
    propertyAddress: yup.string().required("Please enter Property Address"),
    propertyOwnedBy: yup.string().required("Please enter a Property Owned By"),
    biddingDate: yup
      .mixed()
      .test("Required", "Please enter your Bidding Date", (value) => {
        return value.length > 0 ? true : false;
      }),
    bidAmount: yup.string().required("Please enter a Bidding Amount"),
    biddingStartTime: yup
      .mixed()
      .test("Required", "Please enter your Bidding Start Time", (value) => {
        return value.length > 0 ? true : false;
      }),
    biddingEndTime: yup
      .mixed()
      .test("Required", "Please enter your Bidding End Time", (value) => {
        return value.length > 0 ? true : false;
      }),
  });

  const { register, errors, handleSubmit, control, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(SignupSchema),
  });

  useEffect(() => {
    if (!isEmptyObject(params)) {
      async function fetchData() {
        try {
          const result = await useJwt.get(
            `${API_URL}/advertisements/${params.id}`
          );
          setStatus("update");
          const values = result.data;

          reset({
            propertyType: values.propertyType,
            propertyAddress: values.propertyAddress,
            propertyOwnedBy: values.propertyOwnedBy,
            bidAmount: values.bidAmount,
            biddingDate: [values.biddingDate],
            biddingStartTime: [values.biddingStartTime],
            biddingEndTime: [values.biddingEndTime],
          });
        } catch (error) {
          if (error.response && error.response.status === 404) {
            history.goBack();
          }
        }
      }

      fetchData();
    }
  }, []);

  //---block invalid Char in Number------
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  //--onsubmit handler-----
  const onSubmit = async (data) => {
    const values = {
      ...data,
      biddingDate: data.biddingDate[0],
      biddingStartTime: data.biddingStartTime[0],
      biddingEndTime: data.biddingEndTime[0],
    };
    if (status === "submit") {
      try {
        await useJwt.post(`${API_URL}/advertisements`, values);
        history.push("/advertisement");
      } catch (error) {
        console.log(error.response.data);
      }
    }

    if (status === "update") {
      try {
        await useJwt.put(`${API_URL}/advertisements/${params.id}`, values);
        history.push("/advertisement");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFormReset = () => {
    reset({
      propertyType: "",
      propertyAddress: "",
      propertyOwnedBy: "",
      bidAmount: "",
      biddingDate: [],
      biddingStartTime: [],
      biddingEndTime: [],
    });
  };

  return (
    <div className="auth-wrapper auth-v1 px-2">
      <div className="py-2">
        <Card>
          <CardHeader>
            <CardTitle tag="h4">
              {status === "update"
                ? "Update Advertisement"
                : "Add Advertisement"}
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="propertyType">Property Type</Label>
                    <Input
                      id="propertyType"
                      name="propertyType"
                      innerRef={register({ required: true })}
                      invalid={errors.propertyType && true}
                    />
                    {errors && errors.propertyType && (
                      <FormFeedback>{errors.propertyType.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="propertyAddress">Property Address</Label>
                    <Input
                      id="propertyAddress"
                      name="propertyAddress"
                      innerRef={register({ required: true })}
                      invalid={errors.propertyAddress && true}
                    />
                    {errors && errors.propertyAddress && (
                      <FormFeedback>
                        {errors.propertyAddress.message}
                      </FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="propertyOwnedBy">Property Owned By</Label>
                    <Input
                      id="propertyOwnedBy"
                      name="propertyOwnedBy"
                      innerRef={register({ required: true })}
                      invalid={errors.propertyOwnedBy && true}
                    />
                    {errors && errors.propertyOwnedBy && (
                      <FormFeedback>
                        {errors.propertyOwnedBy.message}
                      </FormFeedback>
                    )}
                  </FormGroup>
                </Col>

                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="bidAmount">Bid Amount</Label>
                    <Input
                      id="bidAmount"
                      name="bidAmount"
                      type="number"
                      innerRef={register({ required: true })}
                      invalid={errors.bidAmount && true}
                      onKeyDown={blockInvalidChar}
                      min={0}
                    />
                    {errors && errors.bidAmount && (
                      <FormFeedback>{errors.bidAmount.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="biddingDate">Bidding Date</Label>
                    <Controller
                      render={(props) => {
                        return (
                          <Flatpickr
                            onChange={props.onChange}
                            className={classnames("form-control", {
                              "is-invalid": errors.biddingDate ? true : false,
                            })}
                            value={props.value}
                          />
                        );
                      }}
                      control={control}
                      id="biddingDate"
                      name="biddingDate"
                      defaultValue=""
                      rules={{ required: true }}
                    />
                    {errors && errors.biddingDate && (
                      <FormFeedback>{errors.biddingDate.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="biddingStartTime">Bidding Start Time</Label>
                    <Controller
                      render={(props) => {
                        return (
                          <Flatpickr
                            onChange={props.onChange}
                            className={classnames("form-control", {
                              "is-invalid": errors.biddingStartTime
                                ? true
                                : false,
                            })}
                            value={props.value}
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              dateFormat: "H:i",
                            }}
                          />
                        );
                      }}
                      control={control}
                      id="biddingStartTime"
                      name="biddingStartTime"
                      defaultValue=""
                      rules={{ required: true }}
                    />
                    {errors && errors.biddingStartTime && (
                      <FormFeedback>
                        {errors.biddingStartTime.message}
                      </FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="biddingEndTime">Bidding End Time</Label>
                    <Controller
                      render={(props) => {
                        return (
                          <Flatpickr
                            onChange={props.onChange}
                            className={classnames("form-control", {
                              "is-invalid": errors.biddingEndTime
                                ? true
                                : false,
                            })}
                            value={props.value}
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              dateFormat: "H:i",
                            }}
                          />
                        );
                      }}
                      control={control}
                      id="biddingEndTime"
                      name="biddingEndTime"
                      defaultValue=""
                      rules={{ required: true }}
                    />
                    {errors && errors.biddingEndTime && (
                      <FormFeedback>
                        {errors.biddingEndTime.message}
                      </FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <FormGroup className="d-flex mb-0">
                    <Button.Ripple
                      className="mr-1"
                      color="primary"
                      type="submit"
                    >
                      {status === "update" ? "Update" : "Submit"}
                    </Button.Ripple>
                    <Button.Ripple
                      outline
                      color="secondary"
                      onClick={handleFormReset}
                    >
                      Reset
                    </Button.Ripple>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CreateAdvertisement;
