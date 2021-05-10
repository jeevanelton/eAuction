import { Link } from "react-router-dom";
import { ChevronLeft } from "react-feather";
import InputPassword from "@components/input-password-toggle";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Button,
} from "reactstrap";
import "@styles/base/pages/page-auth.scss";

const ResetPassword = () => {
  //-----schema type for validation--------
  const SignupSchema = yup.object().shape({
    newPassword: yup
      .string()
      .required("Please enter your password")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      ),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .when("newPassword", {
        is: (newPassword) =>
          newPassword && newPassword.length > 0 ? true : false,
        then: yup
          .string()
          .oneOf([yup.ref("newPassword")], "Password doesn't match"),
      }),
  });

  const { register, errors, handleSubmit } = useForm({
    mode: "onChange",
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="auth-wrapper auth-v1 px-2">
      <div className="auth-inner py-2">
        <Card className="mb-0">
          <CardBody>
            <CardTitle tag="h4" className="mb-1">
              Reset Password 🔒
            </CardTitle>
            <CardText className="mb-2">
              Your new password must be different from previously used passwords
            </CardText>
            <Form
              className="auth-reset-password-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <Label className="form-label" for="newPassword">
                  New Password
                </Label>
                <InputPassword
                  className="input-group-merge"
                  id="newPassword"
                  name="newPassword"
                  innerRef={register({ required: true })}
                  invalid={errors.newPassword && true}
                  autoFocus
                />

                {errors && errors.newPassword && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "unset" }}
                  >
                    {errors.newPassword.message}
                  </div>
                )}
              </FormGroup>
              <FormGroup>
                <Label className="form-label" for="confirmPassword">
                  Confirm Password
                </Label>
                <InputPassword
                  className="input-group-merge"
                  id="confirmPassword"
                  name="confirmPassword"
                  innerRef={register({ required: true })}
                  invalid={errors.confirmPassword && true}
                />
                {errors && errors.confirmPassword && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "unset" }}
                  >
                    {errors.confirmPassword.message}
                  </div>
                )}
              </FormGroup>
              <Button.Ripple color="primary" block>
                Set New Password
              </Button.Ripple>
            </Form>
            <p className="text-center mt-2">
              <Link to="/login">
                <ChevronLeft className="mr-25" size={14} />
                <span className="align-middle">Back to login</span>
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
