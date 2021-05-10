import { Link } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputPasswordToggle from "@components/input-password-toggle";
import Select from "react-select";
import { selectThemeColors } from "../utility/Utils";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  Button,
  FormFeedback,
} from "reactstrap";
import "@styles/base/pages/page-auth.scss";
import axios from "axios";

const Login = () => {
  //-----schema type for validation--------
  const SignupSchema = yup.object().shape({
    accountType: yup.string(),
    loginEmail: yup.string().required("Please enter your Email ID"),
    loginPassword: yup.string().required("Please enter your password"),
  });

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  async function success(pos) {
    var crd = pos.coords;
    try {
      const result = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=pk.011ef9c25ec3659bc3886f30b449e804&lat=${crd.latitude}&lon=${crd.longitude}&format=json`
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    // const google = window.google;
    // var latlng = new google.maps.LatLng(crd.latitude, crd.longitude);
    // // This is making the Geocode request
    // var geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ latLng: latlng }, function (results, status) {
    //   if (status !== google.maps.GeocoderStatus.OK) {
    //     alert(status);
    //   }
    //   // This is checking to see if the Geoeode Status is OK before proceeding
    //   if (status == google.maps.GeocoderStatus.OK) {
    //     console.log(results);
    //     var address = results[0].formatted_address;
    //   }
    // });

    // console.log("Your current position is:");
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
  }

  function locationErrors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  // const colourOptions = [
  //   { value: "bidder/all", label: "Bidder/All" },
  //   { value: "bankers/viewers", label: "Bankers/Viewers" },
  // ];

  const { register, errors, handleSubmit } = useForm({
    mode: "onChange",
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = (data) => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            console.log(data);
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success);
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(
              success,
              locationErrors,
              options
            );
          } else if (result.state === "denied") {
            console.log("inside denied");
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    } else {
      alert("Sorry Not available!");
    }
  };

  return (
    <div className="auth-wrapper auth-v1 px-2">
      <div className="auth-inner py-2">
        <Card className="mb-0">
          <CardBody>
            <Link
              className="brand-logo"
              to="/"
              onClick={(e) => e.preventDefault()}
            >
              <svg viewBox="0 0 139 95" version="1.1" height="28">
                <defs>
                  <linearGradient
                    x1="100%"
                    y1="10.5120544%"
                    x2="50%"
                    y2="89.4879456%"
                    id="linearGradient-1"
                  >
                    <stop stopColor="#000000" offset="0%"></stop>
                    <stop stopColor="#FFFFFF" offset="100%"></stop>
                  </linearGradient>
                  <linearGradient
                    x1="64.0437835%"
                    y1="46.3276743%"
                    x2="37.373316%"
                    y2="100%"
                    id="linearGradient-2"
                  >
                    <stop
                      stopColor="#EEEEEE"
                      stopOpacity="0"
                      offset="0%"
                    ></stop>
                    <stop stopColor="#FFFFFF" offset="100%"></stop>
                  </linearGradient>
                </defs>
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Artboard"
                    transform="translate(-400.000000, -178.000000)"
                  >
                    <g id="Group" transform="translate(400.000000, 178.000000)">
                      <path
                        d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                        id="Path"
                        className="text-primary"
                        style={{ fill: "currentColor" }}
                      ></path>
                      <path
                        d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                        id="Path"
                        fill="url(#linearGradient-1)"
                        opacity="0.2"
                      ></path>
                      <polygon
                        id="Path-2"
                        fill="#000000"
                        opacity="0.049999997"
                        points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                      ></polygon>
                      <polygon
                        id="Path-2"
                        fill="#000000"
                        opacity="0.099999994"
                        points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                      ></polygon>
                      <polygon
                        id="Path-3"
                        fill="url(#linearGradient-2)"
                        opacity="0.099999994"
                        points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                      ></polygon>
                    </g>
                  </g>
                </g>
              </svg>
              <h2 className="brand-text text-primary ml-1">Vuexy</h2>
            </Link>
            <CardTitle tag="h2" className="font-weight-bold mb-1">
              Welcome to E-Auction!
            </CardTitle>
            <CardText className="mb-2">
              Please sign-in to your account and start the adventure
            </CardText>
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <FormGroup>
                  <Input
                    type="select"
                    name="accountType"
                    id="accountType"
                    innerRef={register({ required: true })}
                  >
                    <option value="Bidder/All" defaultValue>
                      Bidder/All
                    </option>
                    <option value="Bankers/Viewers">Bankers/Viewers</option>
                  </Input>
                </FormGroup>
              </FormGroup>
              <FormGroup>
                <Label className="form-label" for="loginEmail">
                  Email
                </Label>
                <Input
                  id="loginEmail"
                  name="loginEmail"
                  innerRef={register({ required: true })}
                  invalid={errors.loginEmail && true}
                  placeholder="john@example.com"
                  autoFocus
                />
                {errors && errors.loginEmail && (
                  <FormFeedback>{errors.loginEmail.message}</FormFeedback>
                )}
              </FormGroup>
              <FormGroup>
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="loginPassword">
                    Password
                  </Label>
                  <Link to="/forgot-password">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <InputPasswordToggle
                  className="input-group-merge"
                  id="loginPassword"
                  name="loginPassword"
                  innerRef={register({ required: true })}
                  invalid={errors.loginPassword && true}
                />
                {errors && errors.loginPassword && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "unset" }}
                  >
                    {errors.loginPassword.message}
                  </div>
                )}
              </FormGroup>
              <FormGroup>
                <CustomInput
                  type="checkbox"
                  className="custom-control-Primary"
                  id="remember-me"
                  label="Remember Me"
                />
              </FormGroup>
              <Button.Ripple type="submit" color="primary" block>
                Sign in
              </Button.Ripple>
            </Form>
            <p className="text-center mt-2">
              <span className="mr-25">New on our platform?</span>
              <Link to="/registration">
                <span>Create an account</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Login;
