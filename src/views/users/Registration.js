import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputPassword from "@components/input-password-toggle";
import Select from "react-select";
import classnames from "classnames";
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
import { useState } from "react";
import { API_URL } from "../../configs/constants";
import useJwt from "@src/auth/jwt/useJwt";
import { Link, useHistory } from "react-router-dom";

const Registration = () => {
  const history = useHistory();

  const [registrationValues, setRegistrationValues] = useState({
    panOrForm16: "Pan",
    registerAs: "Individual",
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
    email: yup
      .string()
      .email("Please enter a valid Email")
      .required("Please enter your Email ID"),
    confirmEmail: yup
      .string()
      .required("Please confirm your Email ID")
      .when("email", {
        is: (email) => (email && email.length > 0 ? true : false),
        then: yup.string().oneOf([yup.ref("email")], "Email ID doesn't match"),
      }),

    password: yup
      .string()
      .required("Please enter your password")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      ),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .when("password", {
        is: (password) => (password && password.length > 0 ? true : false),
        then: yup
          .string()
          .oneOf([yup.ref("password")], "Password doesn't match"),
      }),
    firstName:
      registrationValues &&
      registrationValues.registerAs === "Individual" &&
      yup.string().required("Please enter your First Name").min(3),
    lastName:
      registrationValues &&
      registrationValues.registerAs === "Individual" &&
      yup.string().required("Please enter your Last Name").min(3),
    middleName:
      registrationValues &&
      registrationValues.registerAs === "Individual" &&
      yup.string(),
    orgName:
      registrationValues &&
      registrationValues.registerAs === "Organization" &&
      yup.string().required("Please enter your Organization Name"),
    authorizedPerson:
      registrationValues &&
      registrationValues.registerAs === "Organization" &&
      yup.string().required("Please enter your Please enter Authorized Person"),
    designation:
      registrationValues &&
      registrationValues.registerAs === "Organization" &&
      yup.string().required("Please enter your Please enter your Designation"),
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
      registrationValues && registrationValues.panOrForm16 === "form16"
        ? yup
            .mixed()
            .test("required", "File requires", (value) => {
              return value[0];
            })
            .test("fileType", "Unsupported File Format", (value) => {
              return value[0] && SUPPORTED_FORMATS.includes(value[0].type);
            })
            .test("fileSize", "File Size is too large", (value) => {
              return value[0] && value[0].size <= FILE_SIZE;
            })
        : "",

    panNumber:
      registrationValues && registrationValues.panOrForm16 == "Pan"
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

  const { register, errors, handleSubmit, control, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(SignupSchema),
  });

  //---block invalid Char in Number------
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  //---onChange handler-------
  const onChangeRegistrationHandler = (e) => {
    const { name, value } = e.target;

    const values = registrationValues;
    values[name] = value;
    setRegistrationValues({ ...values });
  };

  //--onsubmit handler-----
  const onSubmit = async (data) => {
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
      const result = await useJwt.post(`${API_URL}/users`, values);
      if (registrationValues.panOrForm16 === "form16") {
        const formdata = new FormData();
        formdata.append("docForm16", data.form16[0]);
        const formResult = await useJwt.post(
          `${API_URL}/users/doc/${result.data._id}`,
          formdata
        );
      }
      console.log(result.data);
      history.push("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  //---------form reset----------
  const handleFormReset = () => {
    setRegistrationValues({ panOrForm16: "Pan", registerAs: "Individual" });
    reset({
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      middleName: "",
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
      panNumber: "",
      phone: "",
      mobile: "",
      faxNumber: "",
    });
  };

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

  return (
    <div className="auth-wrapper auth-v1 px-2">
      <div className="py-2">
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Registration</CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col md="12" lg="12" sm="12">
                  <FormGroup>
                    <Label for="registerAs">Register As </Label>
                    <Controller
                      render={(props) => (
                        <Select
                          id="registerAs"
                          name={props.name}
                          value={props.value}
                          options={registerAsOptions}
                          className={classnames("react-select", {
                            "is-invalid": errors.registerAs && true,
                          })}
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          onChange={(e, { name }) => {
                            props.onChange(e);
                            onChangeRegistrationHandler({
                              target: {
                                name,
                                value: e.value,
                              },
                            });
                          }}
                        />
                      )}
                      control={control}
                      name="registerAs"
                      defaultValue={registerAsOptions[0]}
                    />

                    {errors && errors.registerAs && (
                      <FormFeedback>{errors.registerAs.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="email">Email ID (Login ID)</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      innerRef={register({ required: true })}
                      invalid={errors.email && true}
                      placeholder="bruce.wayne@email.com"
                    />
                    {errors && errors.email && (
                      <FormFeedback>{errors.email.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="confirmEmail">Confirm Email ID</Label>
                    <Input
                      id="confirmEmail"
                      type="email"
                      name="confirmEmail"
                      innerRef={register({ required: true })}
                      invalid={errors.confirmEmail && true}
                      placeholder="bruce.wayne@email.com"
                    />
                    {errors && errors.confirmEmail && (
                      <FormFeedback>{errors.confirmEmail.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <InputPassword
                      className={classnames("input-group-merge", {
                        "is-invalid": errors.password && true,
                      })}
                      id="password"
                      name="password"
                      innerRef={register({ required: true })}
                      invalid={errors.password && true}
                    />

                    {errors && errors.password && (
                      <FormFeedback>{errors.password.message}</FormFeedback>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <InputPassword
                      className={classnames("input-group-merge", {
                        "is-invalid": errors.confirmPassword && true,
                      })}
                      name="confirmPassword"
                      id="confirmPassword"
                      innerRef={register({ required: true })}
                      invalid={errors.confirmPassword && true}
                    />
                    {errors && errors.confirmPassword && (
                      <FormFeedback>
                        {errors.confirmPassword.message}
                      </FormFeedback>
                    )}
                  </FormGroup>
                </Col>

                {registrationValues &&
                  registrationValues.registerAs === "Individual" && (
                    <>
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
                            <FormFeedback>
                              {errors.firstName.message}
                            </FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6" sm="12">
                        <FormGroup>
                          <Label for="middleName">Middle Name</Label>
                          <Input
                            id="middleName"
                            name="middleName"
                            innerRef={register({ required: true })}
                            invalid={errors.middleName && true}
                            placeholder="Middle Name"
                          />
                          {errors && errors.middleName && (
                            <FormFeedback>
                              {errors.middleName.message}
                            </FormFeedback>
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
                            <FormFeedback>
                              {errors.lastName.message}
                            </FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                    </>
                  )}
                {registrationValues &&
                  registrationValues.registerAs === "Organization" && (
                    <>
                      <Col md="6" sm="12">
                        <FormGroup>
                          <Label for="orgName">Organization Name</Label>
                          <Input
                            id="orgName"
                            name="orgName"
                            innerRef={register({ required: true })}
                            invalid={errors.orgName && true}
                            placeholder="Organization Name"
                          />
                          {errors && errors.orgName && (
                            <FormFeedback>
                              {errors.orgName.message}
                            </FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6" sm="12">
                        <FormGroup>
                          <Label for="authorizedPerson">
                            Authorized Person
                          </Label>
                          <Input
                            id="authorizedPerson"
                            name="authorizedPerson"
                            innerRef={register({ required: true })}
                            invalid={errors.authorizedPerson && true}
                            placeholder="Authorized Person"
                          />
                          {errors && errors.authorizedPerson && (
                            <FormFeedback>
                              {errors.authorizedPerson.message}
                            </FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md="6" sm="12">
                        <FormGroup>
                          <Label for="designation">Designation</Label>
                          <Input
                            id="designation"
                            name="designation"
                            innerRef={register({ required: true })}
                            invalid={errors.designation && true}
                            placeholder="Designation"
                          />
                          {errors && errors.designation && (
                            <FormFeedback>
                              {errors.designation.message}
                            </FormFeedback>
                          )}
                        </FormGroup>
                      </Col>
                    </>
                  )}
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
                    {/* <Input
                      type="select"
                      name="country"
                      id="country"
                      innerRef={register({ required: true })}
                      invalid={errors.country && true}
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
                    <Controller
                      as={Select}
                      id="state"
                      control={control}
                      name="state"
                      options={stateOptions}
                      defaultValue={stateOptions[0]}
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
                    <Controller
                      as={Select}
                      id="city"
                      control={control}
                      name="city"
                      options={cityOptions}
                      defaultValue={cityOptions[0]}
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
                    <Label for="pincode">Pin/Zip</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="number"
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
                        label="PAN No."
                        checked={registrationValues.panOrForm16 === "Pan"}
                        value="Pan"
                        innerRef={register}
                        onChange={onChangeRegistrationHandler}
                      />
                      <CustomInput
                        type="radio"
                        id="form16RadioButton"
                        name="panOrForm16"
                        inline
                        checked={registrationValues.panOrForm16 === "form16"}
                        label="Form-16"
                        value="form16"
                        innerRef={register}
                        onChange={onChangeRegistrationHandler}
                      />
                    </div>
                  </FormGroup>
                </Col>
                {registrationValues &&
                  registrationValues.panOrForm16 === "form16" && (
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
                {registrationValues &&
                  registrationValues.panOrForm16 === "Pan" && (
                    <Col md="6" sm="12">
                      <FormGroup>
                        <Label for="panNumber">PAN No</Label>
                        <Input
                          id="panNumber"
                          name="panNumber"
                          innerRef={register({ required: true })}
                          invalid={errors.panNumber && true}
                          placeholder="PAN Number"
                        />
                        {errors && errors.panNumber && (
                          <FormFeedback>
                            {errors.panNumber.message}
                          </FormFeedback>
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
                    <Button.Ripple
                      className="mr-1"
                      color="primary"
                      type="submit"
                    >
                      Submit
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
            <p className="text-left mt-2">
              <span className="mr-25">Already have an account?</span>
              <Link to="/login">
                <span>Sign in instead</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
