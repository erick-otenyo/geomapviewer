import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { Form } from "react-final-form";

import request from "@/utils/request";

import ModalSource from "@/components/modals/sources";
import Input from "@/components/forms/components/input";
import InputTags from "@/components/forms/components/input-tags";
import Checkbox from "@/components/forms/components/checkbox";
import Error from "@/components/forms/components/error";
import Submit from "@/components/forms/components/submit";
import ConfirmationMessage from "@/components/confirmation-message";
import Button from "@/components/ui/button";
import MapGeostore from "@/components/map-geostore";
import Icon from "@/components/ui/icon";

import screenImg1x from "@/assets/images/aois/alert-email.png";
import screenImg2x from "@/assets/images/aois/alert-email@2x.png";
import deleteIcon from "@/assets/icons/delete.svg?sprite";

import {
  email as validateEmail,
  validateURL,
} from "@/components/forms/validations";

import "./styles.scss";

const confirmations = {
  saved: {
    title: "Your area has been saved",
    description: "You can view all your areas in My Account",
  },
  savedWithSub: {
    title: "Your area has been saved",
    description: "",
  },
  deleted: {
    title: "This area has been deleted from your account",
    error: true,
  },
};

class AreaOfInterestForm extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    initialValues: PropTypes.object,
    saveAreaOfInterest: PropTypes.func,
    setModalSources: PropTypes.func,
    canDelete: PropTypes.bool,
    clearAfterDelete: PropTypes.bool,
    deleteAreaOfInterest: PropTypes.func,
    viewAfterSave: PropTypes.bool,
    closeForm: PropTypes.func,
  };

  state = {
    webhookError: false,
    webhookSuccess: false,
    testingWebhook: false,
    deleted: false,
    mapStyle: null,
  };

  testWebhook = (url) => {
    this.setState({
      webhookError: false,
      webhookSuccess: false,
      testingWebhook: true,
    });
    request({
      method: "POST",
      url,
    })
      .then(() => {
        setTimeout(() => {
          this.setState({
            webhookError: false,
            webhookSuccess: true,
            testingWebhook: false,
          });
        }, 300);
        setTimeout(() => {
          this.setState({
            webhookError: false,
            webhookSuccess: false,
            testingWebhook: false,
          });
        }, 2500);
      })
      .catch(() => {
        setTimeout(() => {
          this.setState({
            webhookError: true,
            webhookSuccess: false,
            testingWebhook: false,
          });
        }, 300);
        setTimeout(() => {
          this.setState({
            webhookError: false,
            webhookSuccess: false,
            testingWebhook: false,
          });
        }, 2500);
      });
  };

  handleOnMapLoad = (map) => {
    map.on("idle", () => {
      const { geostore } = this.props.initialValues || {};

      const mapStyle = map.getStyle();

      if (
        geostore &&
        !this.state.mapStyle &&
        mapStyle.sources &&
        mapStyle.sources[geostore]
      ) {
        const mbglPayload = {
          height: 150,
          width: 150,
          token: process.env.MapboxAccessToken,
          style: mapStyle,
        };

        this.setState({ mapStyle: mbglPayload });
      }
    });
  };

  render() {
    const {
      initialValues,
      saveAreaOfInterest,
      deleteAreaOfInterest,
      clearAfterDelete,
      setModalSources,
      canDelete,
      viewAfterSave,
      title,
      closeForm,
    } = this.props;

    const { deleted, mapStyle } = this.state;

    return (
      <Fragment>
        <Form
          onSubmit={(values) => {
            return saveAreaOfInterest({
              ...initialValues,
              ...values,
              viewAfterSave,
              mapStyle,
            });
          }}
          initialValues={initialValues}
          render={({
            handleSubmit,
            valid,
            submitting,
            submitFailed,
            submitError,
            submitSucceeded,
            values: { updates },
          }) => {
            let metaKey = "saved";
            if (updates && !!updates.length) metaKey = "savedWithSub";
            if (deleted && initialValues && !initialValues.id) {
              metaKey = "deleted";
            }
            const confirmationMeta = confirmations[metaKey];

            return (
              <form className="c-area-of-interest-form" onSubmit={handleSubmit}>
                {submitSucceeded || deleted ? (
                  <Fragment>
                    <ConfirmationMessage {...confirmationMeta} />
                    <Button
                      className="reset-form-btn"
                      onClick={(e) => {
                        // stops button click triggering another submission of the form
                        e.preventDefault();
                        e.stopPropagation();
                        closeForm();
                      }}
                    >
                      Back to my areas
                    </Button>
                  </Fragment>
                ) : (
                  <Fragment>
                    <h1>{title}</h1>
                    <MapGeostore
                      className="aoi-map"
                      location={initialValues && initialValues.location}
                      padding={50}
                      height={300}
                      width={600}
                      onMapLoad={this.handleOnMapLoad}
                    />
                    <Input
                      name="name"
                      label="Name this area for later reference"
                      required
                    />
                    <InputTags
                      name="tags"
                      label="Assign tags to organize and group areas"
                    />
                    <div className="alerts-image">
                      <img
                        src={screenImg1x}
                        srcSet={`${screenImg1x} 1x, ${screenImg2x} 2x`}
                        alt="area of interest alerts"
                      />
                      <p>
                        We will send you updates in your selected area, based on
                        your user profile.
                      </p>
                    </div>
                    <Input
                      name="email"
                      type="email"
                      label="email"
                      validate={[validateEmail]}
                      required
                      disabled
                    />
                    {/* 
                    <Checkbox
                      name="updates"
                      label="What updates would you like to receive ?"
                      options={UPDATES_OPTIONS}
                    /> */}
                    <Error
                      valid={valid}
                      submitFailed={submitFailed}
                      submitError={submitError}
                    />
                    <div className="submit-actions">
                      <Submit
                        className="area-submit"
                        submitting={submitting}
                        disabled={!mapStyle}
                      >
                        save
                      </Submit>
                      {canDelete && initialValues && initialValues.id && (
                        <Button
                          className="delete-area"
                          theme="theme-button-clear"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteAreaOfInterest({
                              id: initialValues.id,
                              clearAfterDelete,
                              callBack: () => this.setState({ deleted: true }),
                            });
                          }}
                        >
                          <Icon icon={deleteIcon} className="delete-icon" />
                          Delete Area
                        </Button>
                      )}
                    </div>
                  </Fragment>
                )}
              </form>
            );
          }}
        />
        <ModalSource />
      </Fragment>
    );
  }
}

export default AreaOfInterestForm;
