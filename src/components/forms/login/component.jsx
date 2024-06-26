import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { Form } from "react-final-form";
import cx from "classnames";
import ReactHtmlParser from "react-html-parser";
import { Row, Column, Button } from "@erick-otenyo/hw-components";

import Input from "@/components/forms/components/input";
import Submit from "@/components/forms/components/submit";
import ConfirmationMessage from "@/components/confirmation-message";
import Error from "@/components/forms/components/error";

import { email } from "@/components/forms/validations";

import "./styles.scss";

const isServer = typeof window === "undefined";

class LoginForm extends PureComponent {
  static propTypes = {
    loginUser: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
    resetUserPassword: PropTypes.func.isRequired,
    simple: PropTypes.bool,
    narrow: PropTypes.bool,
    initialValues: PropTypes.object,
    className: PropTypes.string,
  };

  state = {
    showForm: "login",
    url: null,
  };

  componentDidMount() {
    this.setState({ url: !isServer && window.location.href });
  }

  render() {
    const {
      registerUser,
      resetUserPassword,
      loginUser,
      initialValues,
      simple,
      narrow,
      className,
      allowSignups,
    } = this.props;

    const { showForm } = this.state;

    const formMeta = {
      login: {
        submit: "login",
        submitFunc: loginUser,
        altView: "register",
        altLabel: "Not registered? <b>Sign up!</b>",
        altEnabled: allowSignups,
        confirmation: {
          title: "",
          description: "",
        },
      },
      register: {
        submit: "register",
        submitFunc: registerUser,
        altView: "login",
        altEnabled: true,
        altLabel: "Already joined? <b>Sign in!</b>",
        confirmation: {
          title:
            "Thank you for registering, please check your email and confirm your account.",
          description: "<b>If it doesn't appear check your spam folder.</b>",
        },
      },
      reset: {
        submit: "reset",
        submitFunc: resetUserPassword,
        altView: "login",
        altLabel: "Already joined? <b>Sign in!</b>",
        confirmation: {
          title:
            "Thank you. Please, check your inbox and follow instructions to reset your password.",
          description: "<b>If it doesn't appear check your spam folder.</b>",
        },
      },
    };

    const { submit, submitFunc, altView, altLabel, altEnabled, confirmation } =
      formMeta[showForm];

    return (
      <Form onSubmit={submitFunc} initialValues={initialValues}>
        {({
          handleSubmit,
          submitting,
          submitFailed,
          submitError,
          submitSucceeded,
          valid,
          form: { reset },
        }) => (
          <div className={cx("c-login-form", className, { simple })}>
            <Row nested>
              {submitSucceeded && showForm !== "login" ? (
                <Column>
                  <ConfirmationMessage {...confirmation} />
                  <Button
                    className="reset-form-btn"
                    onClick={() => {
                      reset();
                      this.setState({ showForm: "login" });
                    }}
                  >
                    login
                  </Button>
                </Column>
              ) : (
                <Fragment>
                  {!simple && (
                    <Column>
                      <h1>Login</h1>
                      <h3>
                        <p>Log in to manage your account</p>
                      </h3>
                    </Column>
                  )}
                  {!narrow && <Column width={[0, 1 / 12]} />}
                  <Column width={narrow ? [1] : [1, 1 / 2]}>
                    {showForm === "reset" && (
                      <p>
                        To reset your password, enter your email and follow the
                        instructions.
                      </p>
                    )}
                    <form className="c-login-form" onSubmit={handleSubmit}>
                      <Input
                        name="username"
                        type="email"
                        label="email"
                        validate={[email]}
                        required
                      />
                      {showForm === "login" && (
                        <Input
                          name="password"
                          label="password"
                          type="password"
                          placeholder="**********"
                          required
                        />
                      )}
                      {showForm === "login" && (
                        <div
                          className="forgotten-password"
                          onClick={() => {
                            this.setState({ showForm: "reset" });
                            reset();
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          Forgot password
                        </div>
                      )}
                      <Error
                        valid={valid}
                        submitFailed={submitFailed}
                        submitError={submitError}
                      />
                      <div className="submit-actions">
                        <Submit submitting={submitting}>{submit}</Submit>
                        {altEnabled && (
                          <button
                            className="change-form"
                            onClick={(e) => {
                              e.preventDefault();
                              this.setState({ showForm: altView });
                              reset();
                            }}
                          >
                            {ReactHtmlParser(altLabel)}
                          </button>
                        )}
                      </div>
                    </form>
                  </Column>
                </Fragment>
              )}
            </Row>
          </div>
        )}
      </Form>
    );
  }
}

export default LoginForm;
