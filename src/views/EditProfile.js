import * as yup from "yup";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputPassword from "@components/input-password-toggle";
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
  CustomInput,
} from "reactstrap";
import { useState } from "react";

const EditProfile = () => {
  const [radioButtonValues, setRadioButtonValues] = useState({
    panOrformDetails: "panNo",
  });

  //--setting file size----
  const FILE_SIZE = 1000000;

  //--setting file format----
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/docx",
    "image/doc",
    "image/png",
  ];

  //-----schema type for validation--------
  const SignupSchema = yup.object().shape({
    firstName: yup.string().required("Please enter your First Name").min(3),
    lastName: yup.string().required("Please enter your Last Name").min(3),
    fatherOrHusbandName: yup
      .string()
      .required("Please enter your Father's / Husband Name"),
    address1: yup.string().required("Please enter your Address"),
    address2: yup.string(),
    country: yup.string().required("Please select your Country"),
    state: yup.string().required("Please select your State"),
    city: yup.string().required("Please select your City"),
    registerAs: yup.string().required("Please select Register As"),
    pinOrZip: yup
      .mixed()
      .test("Required", "Please enter your Pin / Zip", (value) => {
        return value ? true : false;
      })
      .test("Number", "Please enter a value in Number", (value) => {
        return !isNaN(value);
      }),

    form16:
      radioButtonValues && radioButtonValues.panOrformDetails === "form16"
        ? yup
            .mixed()
            .test("required", "File requires", (value) => {
              return value[0];
            })
            .test("fileSize", "File Size is too large", (value) => {
              return value[0] && value[0].size <= FILE_SIZE;
            })
            .test("fileType", "Unsupported File Format", (value) => {
              return value[0] && SUPPORTED_FORMATS.includes(value[0].type);
            })
        : "",

    panNo:
      radioButtonValues && radioButtonValues.panOrformDetails == "panNo"
        ? yup.string().required("Please enter your PAN number.")
        : "",
    phoneNumber: yup
      .mixed()
      .test("Number", "Please enter a value in Number", (value) => {
        return !isNaN(value);
      }),
    mobileNumber: yup
      .mixed()
      .test("Required", "Please enter your Mobile Number", (value) => {
        return value ? true : false;
      })
      .test("Number", "Please enter a value in Number", (value) => {
        return !isNaN(value);
      }),
    faxNumber: yup
      .mixed()
      .test("Number", "Please enter a valid Fax number", (value) => {
        return value ? /^\+?[0-9]+$/.test(value) : true;
      }),
  });

  const { register, errors, handleSubmit } = useForm({
    mode: "onChange",
    resolver: yupResolver(SignupSchema),
  });

  //---block invalid Char in Number------
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  //---onChange handler-------
  const onChangeRegistrationHandler = (e) => {
    const { name, value } = e.target;
    const values = radioButtonValues;
    values[name] = value;
    setRadioButtonValues({ ...values });
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4">Edit Profile</CardTitle>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  innerRef={register({ required: true })}
                  invalid={errors.firstName && true}
                  placeholder="Bruce"
                />
                {errors && errors.firstName && (
                  <FormFeedback>{errors.firstName.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  innerRef={register({ required: true })}
                  invalid={errors.lastName && true}
                  placeholder="Wayne"
                />
                {errors && errors.lastName && (
                  <FormFeedback>{errors.lastName.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="fatherOrHusbandName">
                  Father's/Husband's Name{" "}
                </Label>
                <Input
                  id="fatherOrHusbandName"
                  name="fatherOrHusbandName"
                  innerRef={register({ required: true })}
                  invalid={errors.fatherOrHusbandName && true}
                  placeholder="Father's / Husband Name"
                />
                {errors && errors.fatherOrHusbandName && (
                  <FormFeedback>
                    {errors.fatherOrHusbandName.message}
                  </FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="address1">Address 1</Label>
                <Input
                  id="address1"
                  name="address1"
                  innerRef={register({ required: true })}
                  invalid={errors.address1 && true}
                  placeholder="Address 1"
                />
                {errors && errors.address1 && (
                  <FormFeedback>{errors.address1.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="address2">Address 2</Label>
                <Input
                  id="address2"
                  name="address2"
                  innerRef={register({ required: true })}
                  invalid={errors.address2 && true}
                  placeholder="Address 2"
                />
                {errors && errors.address2 && (
                  <FormFeedback>{errors.address2.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="country">Country</Label>
                <Input
                  type="select"
                  name="country"
                  id="country"
                  innerRef={register({ required: true })}
                  invalid={errors.country && true}
                >
                  <option value="">Select</option>
                  <option value="india">India</option>
                </Input>
                {errors && errors.country && (
                  <FormFeedback>{errors.country.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="state">State</Label>
                <Input
                  type="select"
                  name="state"
                  id="state"
                  innerRef={register({ required: true })}
                  invalid={errors.state && true}
                >
                  <option value="">Select</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </Input>
                {errors && errors.state && (
                  <FormFeedback>{errors.state.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="city">City</Label>
                <Input
                  type="select"
                  name="city"
                  id="city"
                  innerRef={register({ required: true })}
                  invalid={errors.city && true}
                >
                  <option value="">Select</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Sivaganga">Sivaganga</option>
                </Input>
                {errors && errors.city && (
                  <FormFeedback>{errors.city.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="registerAs">Register As </Label>
                <Input
                  type="select"
                  name="registerAs"
                  id="registerAs"
                  innerRef={register({ required: true })}
                  invalid={errors.registerAs && true}
                >
                  <option value="">Select</option>
                  <option value="Organization">Organization</option>
                  <option value="Individual">Individual</option>
                </Input>
                {errors && errors.registerAs && (
                  <FormFeedback>{errors.registerAs.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="pinOrZip">Pin/Zip</Label>
                <Input
                  id="pinOrZip"
                  name="pinOrZip"
                  type="number"
                  innerRef={register({ required: true })}
                  invalid={errors.pinOrZip && true}
                  placeholder="Pin / Zip"
                  onKeyDown={blockInvalidChar}
                />
                {errors && errors.pinOrZip && (
                  <FormFeedback>{errors.pinOrZip.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label>PAN/FORM-16 Details</Label>
                <div className="pt-1">
                  <CustomInput
                    type="radio"
                    id="PanNoRadioButton"
                    name="panOrformDetails"
                    inline
                    label="PAN No."
                    defaultChecked
                    value="panNo"
                    onChange={onChangeRegistrationHandler}
                  />
                  <CustomInput
                    type="radio"
                    id="form16RadioButton"
                    name="panOrformDetails"
                    inline
                    label="Form-16"
                    value="form16"
                    onChange={onChangeRegistrationHandler}
                  />
                </div>
              </FormGroup>
            </Col>
            {radioButtonValues &&
              radioButtonValues.panOrformDetails === "form16" && (
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="form16">Form 16</Label>
                    <CustomInput
                      type="file"
                      id="form16"
                      innerRef={register}
                      invalid={errors.form16 && true}
                      name="form16"
                    >
                      {errors && errors.form16 && (
                        <FormFeedback>{errors.form16.message}</FormFeedback>
                      )}
                    </CustomInput>
                  </FormGroup>
                </Col>
              )}
            {radioButtonValues &&
              radioButtonValues.panOrformDetails === "panNo" && (
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="panNo">PAN No</Label>
                    <Input
                      id="panNo"
                      name="panNo"
                      innerRef={register({ required: true })}
                      invalid={errors.panNo && true}
                      placeholder="PAN Number"
                    />
                    {errors && errors.panNo && (
                      <FormFeedback>{errors.panNo.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
              )}
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="number"
                  innerRef={register({ required: true })}
                  invalid={errors.phoneNumber && true}
                  placeholder="Phone Number"
                  onKeyDown={blockInvalidChar}
                />
                {errors && errors.phoneNumber && (
                  <FormFeedback>{errors.phoneNumber.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="number"
                  innerRef={register({ required: true })}
                  invalid={errors.mobileNumber && true}
                  placeholder="Mobile Number"
                  onKeyDown={blockInvalidChar}
                />
                {errors && errors.mobileNumber && (
                  <FormFeedback>{errors.mobileNumber.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="faxNumber">Fax Number</Label>
                <Input
                  id="faxNumber"
                  name="faxNumber"
                  type="number"
                  innerRef={register()}
                  invalid={errors.faxNumber && true}
                  placeholder="Fax Number"
                />
                {errors && errors.faxNumber && (
                  <FormFeedback>{errors.faxNumber.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col sm="12">
              <FormGroup className="d-flex mb-0">
                <Button.Ripple className="mr-1" color="primary" type="submit">
                  Update
                </Button.Ripple>
                <Button.Ripple
                  outline
                  color="secondary"
                  onClick={(e) => e.preventDefault()}
                >
                  Cancel
                </Button.Ripple>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default EditProfile;
