import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classnames from "classnames";
import Select from "react-select";
import { selectThemeColors } from "@utils";
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
import { useEffect, useState } from "react";
import { getUserData } from "../utility/Utils";
import { API_URL } from "../configs/constants";
import useJwt from "@src/auth/jwt/useJwt";
import { useHistory } from "react-router";

const initialState = {
  firstName: "",
  lastName: "",
  fatherOrHusbandName: "",
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

const EditProfile = () => {
  const history = useHistory();

  const [userValues, setUserValues] = useState(initialState);
  const [radioButtonValues, setRadioButtonValues] = useState({
    panOrForm16: "Pan",
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
    country: yup
      .mixed()
      .test("Required", "Please select your country", (value) => {
        return value.value ? true : false;
      }),
    state: yup.mixed().test("Required", "Please select your State", (value) => {
      return value.value ? true : false;
    }),
    city: yup
      .mixed()
      .test("Required", "Please select your Country", (value) => {
        return value.value ? true : false;
      }),
    registerAs: yup
      .mixed()
      .test("Required", "Please select your Registered As", (value) => {
        return value.value ? true : false;
      }),
    pincode: yup
      .mixed()
      .test("Required", "Please enter your Pin / Zip", (value) => {
        return value ? true : false;
      })
      .test("Number", "Please enter a value in Number", (value) => {
        return !isNaN(value);
      }),

    form16:
      radioButtonValues && radioButtonValues.panOrForm16 === "form16"
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

    panNumber:
      radioButtonValues && radioButtonValues.panOrForm16 == "Pan"
        ? yup.string().required("Please enter your PAN number.")
        : "",
    phone: yup
      .mixed()
      .test("Number", "Please enter a value in Number", (value) => {
        return !isNaN(value);
      }),
    mobile: yup
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

  //--------country options---------
  const countryOptions = [
    { value: "", label: "Select" },
    { value: "India", label: "India" },
  ];

  //---------state options---------
  const stateOptions = [
    { value: "", label: "Select" },
    { value: "Assam", label: "Assam" },
    { value: "Bhiar", label: "Bhiar" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
  ];

  //-------------city options-----------
  const cityOptions = [
    { value: "", label: "Select" },
    { value: "Chennai", label: "Chennai" },
    { value: "Madurai", label: "Madurai" },
    { value: "Sivaganga", label: "Sivaganga" },
  ];

  //-------------RegisterAs options--------
  const registerAsOptions = [
    { value: "", label: "Select" },
    { value: "Individual", label: "Individual" },
    { value: "Organization", label: "Organization" },
  ];

  //------use form -------------
  const { register, errors, handleSubmit, control, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(SignupSchema),
  });

  useEffect(() => {
    const userId = getUserData().userId;
    async function fetchData() {
      try {
        const result = await useJwt.get(`${API_URL}/users/${userId}`);
        console.log(result.data);
        setRadioButtonValues({ panOrForm16: result.data.panOrForm16 });
        setUserValues({
          ...userValues,
          ...result.data,
        });
        // reset({
        //   country: countryOptions.filter(
        //     (option) => option.value === result.data.country
        //   )[0],
        //   state: stateOptions.filter(
        //     (option) => option.value === result.data.state
        //   )[0],
        //   city: cityOptions.filter(
        //     (option) => option.value === result.data.city
        //   )[0],
        //   registerAs: registerAsOptions.filter(
        //     (option) => option.value === result.data.registerAs
        //   )[0],
        // });
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (userValues) {
      reset({
        country: countryOptions.filter(
          (option) => option.value === userValues.country
        )[0],
        state: stateOptions.filter(
          (option) => option.value === userValues.state
        )[0],
        city: cityOptions.filter(
          (option) => option.value === userValues.city
        )[0],
        registerAs: registerAsOptions.filter(
          (option) => option.value === userValues.registerAs
        )[0],
      });
      // for (let keys in userValues) {
      // if (keys === "country") {
      //   setValue(
      //     keys,
      //     countryOptions.filter(
      //       (option) => option.value === userValues[keys]
      //     )[0]
      //   );
      // }
      //   if (keys === "state") {
      //     setValue(
      //       keys,
      //       stateOptions.filter(
      //         (option) => option.value === userValues[keys]
      //       )[0]
      //     );
      //   }
      //   if (keys === "city") {
      //     setValue(
      //       keys,
      //       cityOptions.filter((option) => option.value === userValues[keys])[0]
      //     );
      //   }
      //   if (keys === "registerAs") {
      //     setValue(
      //       keys,
      //       registerAsOptions.filter(
      //         (option) => option.value === userValues[keys]
      //       )[0]
      //     );
      //   }
      // }
    }
  }, [userValues]);

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

  const onSubmit = async (data) => {
    const userId = getUserData().userId;
    const values = {};
    for (let keys in data) {
      if (!(keys === "form16")) {
        values[keys] = data[keys];
      }
      if (
        keys === "country" ||
        keys === "state" ||
        keys === "city" ||
        keys === "registerAs"
      ) {
        values[keys] = data[keys].value;
      }
    }

    try {
      const result = await useJwt.put(`${API_URL}/users/${userId}`, values);
      if (radioButtonValues.panOrForm16 === "form16") {
        const formdata = new FormData();
        formdata.append("docForm16", data.form16[0]);
        const formResult = await useJwt.post(
          `${API_URL}/users/doc/${result.data._id}`,
          formdata
        );
        console.log(result.data);
        console.log(formResult.data);
        return;
      }
      console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
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
                  defaultValue={userValues.firstName}
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
                  defaultValue={userValues.lastName}
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
                  defaultValue={userValues.fatherOrHusbandName}
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
                  defaultValue={userValues.address1}
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
                  defaultValue={userValues.address2}
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
                {/* <Input
                  type="select"
                  name="country"
                  id="country"
                  value={userValues.country}
                  innerRef={register({ required: true })}
                  invalid={errors.country && true}
                  onChange={(e) => null}
                >
                  <option value="">Select</option>
                  <option value="india">India</option>
                </Input> */}
                <Controller
                  as={Select}
                  id="country"
                  control={control}
                  name="country"
                  options={countryOptions}
                  defaultValue={countryOptions[0]}
                  // value={countryOptions.filter(
                  //   (option) => option.value === userValues.country
                  // )}
                  className={classnames("react-select", {
                    "is-invalid": errors.country && true,
                  })}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                />
                {errors && errors.country && (
                  <FormFeedback>{errors.country.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="state">State</Label>
                {/* <Input
                  type="select"
                  name="state"
                  id="state"
                  value={userValues.state}
                  innerRef={register({ required: true })}
                  invalid={errors.state && true}
                  onChange={(e) => null}
                >
                  <option value="">Select</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </Input> */}
                <Controller
                  as={Select}
                  id="state"
                  control={control}
                  name="state"
                  options={stateOptions}
                  defaultValue={stateOptions[0]}
                  // value={
                  //   countryOptions.filter(
                  //     (option) => option.value === userValues.state
                  //   )[0]
                  // }

                  className={classnames("react-select", {
                    "is-invalid": errors.state && true,
                  })}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                />
                {errors && errors.state && (
                  <FormFeedback>{errors.state.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="city">City</Label>
                {/* <Input
                  type="select"
                  name="city"
                  id="city"
                  value={userValues.city}
                  innerRef={register({ required: true })}
                  invalid={errors.city && true}
                  onChange={(e) => null}
                >
                  <option value="">Select</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Sivaganga">Sivaganga</option>
                </Input> */}
                <Controller
                  as={Select}
                  id="city"
                  control={control}
                  name="city"
                  options={cityOptions}
                  defaultValue={cityOptions[0]}
                  // value={
                  //   countryOptions.filter(
                  //     (option) => option.value === userValues.city
                  //   )[0]
                  // }

                  className={classnames("react-select", {
                    "is-invalid": errors.city && true,
                  })}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                />
                {errors && errors.city && (
                  <FormFeedback>{errors.city.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="registerAs">Register As </Label>
                {/* <Input
                  type="select"
                  name="registerAs"
                  id="registerAs"
                  value={userValues.registerAs}
                  innerRef={register({ required: true })}
                  invalid={errors.registerAs && true}
                  onChange={(e) => null}
                >
                  <option value="">Select</option>
                  <option value="Organization">Organization</option>
                  <option value="Individual">Individual</option>
                </Input> */}
                <Controller
                  as={Select}
                  id="registerAs"
                  control={control}
                  name="registerAs"
                  options={registerAsOptions}
                  defaultValue={registerAsOptions[0]}
                  // value={
                  //   countryOptions.filter(
                  //     (option) => option.value === userValues.registerAs
                  //   )[0]
                  // }

                  className={classnames("react-select", {
                    "is-invalid": errors.registerAs && true,
                  })}
                  classNamePrefix="select"
                  theme={selectThemeColors}
                />
                {errors && errors.registerAs && (
                  <FormFeedback>{errors.registerAs.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="pincode">Pin/Zip</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  type="number"
                  defaultValue={userValues.pincode}
                  innerRef={register({ required: true })}
                  invalid={errors.pincode && true}
                  placeholder="Pin / Zip"
                  onKeyDown={blockInvalidChar}
                />
                {errors && errors.pincode && (
                  <FormFeedback>{errors.pincode.message}</FormFeedback>
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
                    name="panOrForm16"
                    inline
                    checked={
                      radioButtonValues &&
                      radioButtonValues.panOrForm16 === "Pan"
                    }
                    label="PAN No."
                    value="Pan"
                    innerRef={register}
                    onChange={onChangeRegistrationHandler}
                  />
                  <CustomInput
                    type="radio"
                    id="form16RadioButton"
                    name="panOrForm16"
                    inline
                    checked={
                      radioButtonValues &&
                      radioButtonValues.panOrForm16 === "form16"
                    }
                    label="Form-16"
                    value="form16"
                    innerRef={register}
                    onChange={onChangeRegistrationHandler}
                  />
                </div>
              </FormGroup>
            </Col>
            {radioButtonValues && radioButtonValues.panOrForm16 === "form16" && (
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
            {radioButtonValues && radioButtonValues.panOrForm16 === "Pan" && (
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="panNumber">PAN No</Label>
                  <Input
                    id="panNumber"
                    name="panNumber"
                    defaultValue={userValues.panNumber}
                    innerRef={register({ required: true })}
                    invalid={errors.panNumber && true}
                    placeholder="PAN Number"
                  />
                  {errors && errors.panNumber && (
                    <FormFeedback>{errors.panNumber.message}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            )}
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="number"
                  defaultValue={userValues.phone}
                  innerRef={register({ required: true })}
                  invalid={errors.phone && true}
                  placeholder="Phone Number"
                  onKeyDown={blockInvalidChar}
                />
                {errors && errors.phone && (
                  <FormFeedback>{errors.phone.message}</FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="number"
                  defaultValue={userValues.mobile}
                  innerRef={register({ required: true })}
                  invalid={errors.mobile && true}
                  placeholder="Mobile Number"
                  onKeyDown={blockInvalidChar}
                />
                {errors && errors.mobile && (
                  <FormFeedback>{errors.mobile.message}</FormFeedback>
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
                  defaultValue={userValues.faxNumber}
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
                  onClick={(e) => history.push("/my-profile")}
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
