import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import intersection from "lodash/intersection";
import slice from "lodash/slice";

import { logout } from "@/services/user";
import { trackEvent } from "@/utils/analytics";

import AoICard from "@/components/aoi-card";
import LoginForm from "@/components/forms/login";
import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import Icon from "@/components/ui/icon";
import Pill from "@/components/ui/pill";
import Loader from "@/components/ui/loader";
import Paginate from "@/components/paginate";

import editIcon from "@/assets/icons/edit.svg?sprite";
import shareIcon from "@/assets/icons/share.svg?sprite";
import logoutIcon from "@/assets/icons/logout.svg?sprite";
import screenImg1x from "@/assets/images/aois/aoi-dashboard.png";
import screenImg2x from "@/assets/images/aois/aoi-dashboard@2x.png";

import SubnavMenu from "@/components/subnav-menu";

import "./styles.scss";

const isServer = typeof window === "undefined";

class MapMenuMyAccount extends PureComponent {
  static propTypes = {
    isDesktop: PropTypes.bool,
    loggedIn: PropTypes.bool,
    areas: PropTypes.array,
    activeArea: PropTypes.object,
    viewArea: PropTypes.func,
    onEditClick: PropTypes.func,
    clearArea: PropTypes.func,
    location: PropTypes.object,
    tags: PropTypes.array,
    loading: PropTypes.bool,
    userData: PropTypes.object,
    setMapPromptsSettings: PropTypes.func,
    setShareModal: PropTypes.func,
    setProfileModalOpen: PropTypes.func,
  };

  state = {
    activeTags: [],
    areas: [],
    selectedTags: [],
    unselectedTags: [],
    pageSize: 6,
    pageNum: 0,
  };

  static getDerivedStateFromProps(prevProps, prevState) {
    const { areas, tags } = prevProps;
    const { activeTags, pageSize, pageNum } = prevState;

    const selectedTags =
      tags && tags.filter((t) => activeTags.includes(t.value));
    const unselectedTags =
      tags && tags.filter((t) => !activeTags.includes(t.value));

    const filteredAreas =
      selectedTags && selectedTags.length && areas && areas.length
        ? areas.filter((a) => !!intersection(a.tags, activeTags).length)
        : areas;

    const areasTrimmed = slice(
      filteredAreas,
      pageSize * pageNum,
      pageSize * (pageNum + 1)
    );

    return {
      selectedTags,
      unselectedTags,
      areas: areasTrimmed,
    };
  }

  renderLoginWindow(section) {
    const { isDesktop } = this.props;

    const sectionsMessages = {
      myAOI: (
        <>
          <p>Log in to manage your account</p>
        </>
      ),
    };

    return (
      <div className="aoi-header">
        {isDesktop && <h3 className="title-login">Please log in</h3>}

        {section && sectionsMessages[section] && sectionsMessages[section]}

        <LoginForm className="my-account-login" simple narrow />
      </div>
    );
  }

  renderNoAreas() {
    const { isDesktop, setMapPromptsSettings } = this.props;
    return (
      <div className="aoi-header">
        {isDesktop && (
          <h2 className="title-no-aois">
            You haven&apos;t created any Areas of Interest yet
          </h2>
        )}
        <p>
          Creating an Area of Interest lets you customize and perform an
          in-depth analysis of the area, as well as receiving email
          notifications when new alerts are available.
        </p>
        <Button
          theme="theme-button-small"
          onClick={() =>
            setMapPromptsSettings({
              open: true,
              stepsKey: "areaOfInterestTour",
              stepIndex: 0,
              force: true,
            })
          }
        >
          Learn how
        </Button>
      </div>
    );
  }

  renderAoiActions() {
    const { setShareModal, activeArea, onEditClick } = this.props;

    const btnTheme = cx(
      "theme-button-clear theme-button-clear-underline theme-button-small"
    );

    return (
      <Dropdown
        layout="overflow-menu"
        className="edit-button"
        onChange={this.handleAreaActions}
        theme={cx("theme-button-medium theme-dropdown-no-border small square")}
        options={[
          {
            value: "edit_area",
            component: (
              <Button
                theme={btnTheme}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditClick({ open: true });
                }}
              >
                <Icon icon={editIcon} />
                Edit area
              </Button>
            ),
          },
          {
            value: "share_area",
            component: (
              <Button
                theme={btnTheme}
                onClick={() =>
                  setShareModal({
                    title: "Share this view",
                    shareUrl:
                      !isServer &&
                      (window.location.href.includes("embed")
                        ? window.location.href.replace("/embed", "")
                        : window.location.href),
                  })
                }
              >
                <Icon icon={shareIcon} />
                Share area
              </Button>
            ),
          },
        ]}
      />
    );
  }

  renderAreas() {
    const { isDesktop, activeArea, viewArea, areas: allAreas } = this.props;
    const {
      activeTags,
      areas,
      selectedTags,
      unselectedTags,
      pageSize,
      pageNum,
    } = this.state;

    return (
      <div>
        <div className="aoi-header">
          {isDesktop && (
            <h3 className="title-create-aois">Areas of interest</h3>
          )}
          <div className="aoi-tags">
            {selectedTags &&
              selectedTags.map((tag) => (
                <Pill
                  className="aoi-tag"
                  key={tag.value}
                  active
                  label={tag.label}
                  onRemove={() =>
                    this.setState({
                      activeTags: activeTags.filter((t) => t !== tag.value),
                    })
                  }
                />
              ))}
            {unselectedTags && !!unselectedTags.length && (
              <Dropdown
                alignMenuRight
                className="aoi-tags-dropdown"
                theme="theme-dropdown-button theme-dropdown-button-small"
                placeholder={
                  activeTags && activeTags.length > 0
                    ? "Add more tags"
                    : "Filter by tags"
                }
                noItemsFound="No tags found"
                noSelectedValue={
                  activeTags && activeTags.length > 0
                    ? "Add more tags"
                    : "Filter by tags"
                }
                options={unselectedTags}
                onChange={(tag) => {
                  if (tag.value) {
                    this.setState({
                      activeTags: [...activeTags, tag.value],
                    });
                    trackEvent({
                      category: "User AOIs",
                      action: "User filters areas by a tag",
                      label: tag?.label,
                    });
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className="aoi-items">
          <Fragment>
            {areas &&
              areas.map((area, i) => {
                const active = activeArea && activeArea.id === area.id;

                return (
                  <div
                    className={cx("aoi-item", {
                      "--active": active,
                      "--inactive": activeArea && !active,
                    })}
                    onClick={() => {
                      if (!active) {
                        viewArea({ areaId: area.id });
                        trackEvent({
                          category: "Map menu",
                          action: "Select saved area",
                          label: area?.id,
                        });
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    key={area.id}
                  >
                    <AoICard index={i} {...area} simple />
                    {active && this.renderAoiActions()}
                  </div>
                );
              })}
            {allAreas.length > pageSize && (
              <Paginate
                className="areas-pagination"
                settings={{
                  page: pageNum,
                  pageSize,
                }}
                count={allAreas.length}
                onClickChange={(increment) =>
                  this.setState({ pageNum: pageNum + increment })
                }
              />
            )}
          </Fragment>
        </div>
      </div>
    );
  }

  openProfileModal = () => {
    const { setProfileModalOpen } = this.props;

    setProfileModalOpen(true);
  };

  renderMyAOI() {
    const { areas, userData, loggedIn } = this.props;
    const { email, full_name } = userData || {};

    if (!loggedIn) {
      return this.renderLoginWindow("myAOI");
    }

    return (
      <div className="my-account">
        <div className="my-account-aois">
          {areas && areas.length > 0
            ? this.renderAreas()
            : this.renderNoAreas()}
        </div>
        <div className="my-account-footer">
          <Button
            theme="theme-button-clear"
            className="edit-button"
            onClick={this.openProfileModal}
          >
            {full_name && <span className="name">{full_name}</span>}
            {email && (
              <span className="email">
                <i>{email}</i>
              </span>
            )}
            {!full_name && !email && <span>view profile</span>}
          </Button>

          <Button
            theme="theme-button-clear"
            className="logout-button"
            onClick={logout}
          >
            Log out
            <Icon icon={logoutIcon} className="logout-icon" />
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { loggedIn, areas, isDesktop, loading, section, setMenuSettings } =
      this.props;

    const links = [
      {
        label: "My AOI",
        active: section === "myAOI",
        onClick: () => {
          setMenuSettings({ myHWType: "myAOI" });
          trackEvent({
            category: "Map menu",
            action: "Select myAccount category",
            label: "My AOI",
          });
        },
      },
    ];

    return (
      <div className="c-map-menu-my-account">
        {loading && <Loader />}
        <SubnavMenu
          links={links}
          className="my-account-menu"
          theme="theme-subnav-small-light"
        />
        <div className="content">
          <div className="row">
            <div className="column small-12">
              <div className="description">
                {section === "myAOI" && this.renderMyAOI()}
              </div>
            </div>
          </div>
        </div>

        {/* {!loading && loggedIn && this.renderMyHW()} */}
        {/* {!loading && !loggedIn && this.renderLoginWindow()} */}
        {!loading && loggedIn && !(areas && areas.length > 0) && isDesktop && (
          <img
            className={cx("my-account-login-image", { "--login": !loggedIn })}
            src={screenImg1x}
            srcSet={`${screenImg1x} 1x, ${screenImg2x} 2x`}
            alt="aoi screenshot"
          />
        )}
      </div>
    );
  }
}

export default MapMenuMyAccount;
