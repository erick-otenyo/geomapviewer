import React, { PureComponent } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import cx from "classnames";
import { format } from "d3-format";
import { Desktop, Mobile } from "@erick-otenyo/hw-components";

import { formatNumber } from "@/utils/format";

import Legend from "@/components/charts/components/chart-legend";

import "./styles.scss";

class LollipopChart extends PureComponent {
  interpolate = (num, dataMin, dataMax) =>
    (Math.abs(num) * 100) / (dataMax + Math.abs(dataMin) || 1);

  customFormat = ({ num, roundTo }) => {
    if (num === 0) return "0";
    let number = format(`.${roundTo || 2}f`)(num);
    if (number.charAt(number.length - 1) === "0") {
      number = number.substring(0, number.length - 1);
    }
    return number;
  };

  renderTicks = (ticks, dataMin, dataMax, allNegative) => {
    ticks.map((tick) => (
      <div
        key={tick}
        style={{
          position: "absolute",
          right:
            tick < 0 &&
            (allNegative
              ? `calc(${this.interpolate(tick, dataMin, dataMax)}% - 12px)`
              : `calc(${this.interpolate(
                  tick - dataMax,
                  dataMin,
                  dataMax
                )}% - 12px)`),
          left:
            tick === 0
              ? `calc(${this.interpolate(dataMin, dataMin, dataMax)}% - 3px)`
              : tick > 0 &&
                `calc(${this.interpolate(
                  tick - dataMin,
                  dataMin,
                  dataMax
                )}% - 8px)`,
        }}
      >
        {Math.round(tick)}
        {this.customFormat({ num: tick, roundTo: 1 })}
      </div>
    ));
  };

  render() {
    const {
      className,
      data,
      settings,
      settingsConfig,
      config,
      linksDisabled,
      linksExt,
      simple,
    } = this.props;
    const { unit } = settings;
    const { legend, showStickUnit, showLegendUnit } = config || {};

    const unitsConfig = settingsConfig.find((conf) => conf.key === "unit");
    const selectedUnitConfig =
      unitsConfig &&
      unitsConfig.options &&
      unitsConfig.options.find((opt) => opt.value === unit);

    // unit in legend
    let formatUnit = unit;
    if (selectedUnitConfig) {
      formatUnit =
        selectedUnitConfig.unit !== undefined
          ? selectedUnitConfig.unit
          : selectedUnitConfig.value;
    }

    let dataMax =
      data && data.reduce((acc, item) => Math.max(acc, item.value), 0);
    let dataMin =
      data && data.reduce((acc, item) => Math.min(acc, item.value), 0);
    dataMax = dataMax && dataMax > 0 ? dataMax : 0;
    dataMin = dataMin && dataMin < 0 ? dataMin : 0;

    let ticks = [dataMin, dataMin / 2, 0, dataMax / 2, dataMax];
    if (dataMin === 0) ticks = [0, dataMax * 0.33, dataMax * 0.66, dataMax];
    if (dataMax === 0) ticks = [dataMin, dataMin * 0.66, dataMin * 0.33, 0];

    const allNegative = !data.some((item) => item.value > 0);
    const allPositive = !data.some((item) => item.value < 0);
    return (
      <div className={cx("c-lollipop-chart", className)}>
        {!simple && legend && <Legend config={legend} simple={simple} />}
        <div className="unit-legend">
          {`${selectedUnitConfig?.label || ""} ${
            showLegendUnit ? `(${formatUnit.trim()})` : ""
          }`}
        </div>
        <div className="custom-xAxis">
          <div className="axis-wrapper">
            <Desktop>
              <div
                className="custom-xAxis-ticks"
                style={{
                  ...((allNegative || (!allPositive && !allNegative)) && {
                    marginLeft: "67px",
                  }),
                  ...((allPositive || (!allPositive && !allNegative)) && {
                    marginRight: "67px",
                  }),
                }}
              >
                {this.renderTicks(ticks, dataMin, dataMax, allNegative)}
              </div>
            </Desktop>
            <Mobile>
              <div
                className="custom-xAxis-ticks"
                style={{
                  ...((allNegative || (!allPositive && !allNegative)) && {
                    marginLeft: "50px",
                  }),
                  ...((allPositive || (!allPositive && !allNegative)) && {
                    marginRight: "50px",
                  }),
                }}
              >
                {this.renderTicks(ticks, dataMin, dataMax, allNegative)}
              </div>
            </Mobile>
          </div>
        </div>
        <div className="list-wrapper">
          <ul>
            {data.length > 0 &&
              data.map((item, index) => {
                const isNegative = item.value < 0;
                const linkContent = (
                  <div className="list-item" key={item.label}>
                    <div className="item-label">
                      <div className="item-bubble">
                        {item.rank || index + 1}
                      </div>
                      <div className="item-name">{item.label}</div>
                    </div>
                    <div
                      className={cx("item-lollipop-bar", {
                        "space-left":
                          allNegative || (!allPositive && !allNegative),
                        "space-right":
                          allPositive || (!allPositive && !allNegative),
                      })}
                      style={isNegative ? { flexDirection: "row-reverse" } : {}}
                    >
                      <div
                        className="item-spacer"
                        style={{
                          width: `${this.interpolate(
                            isNegative ? dataMax : dataMin,
                            dataMin,
                            dataMax
                          )}%`,
                        }}
                      />
                      <div
                        className="lollipop"
                        style={{
                          width: `calc(${this.interpolate(
                            item.value,
                            dataMin,
                            dataMax
                          )}%)`,
                          // 100% max - 35px (value text) - 32px text margin
                        }}
                      >
                        <div
                          className="item-bar"
                          style={{
                            backgroundColor: item.color,
                          }}
                        />
                        <div
                          className="item-bubble -lollipop"
                          style={{
                            backgroundColor: item.color,
                            transform: `translateX(${
                              isNegative ? "-8px" : "8px"
                            })`,
                            [isNegative ? "left" : "right"]: 0,
                          }}
                        />
                        <div
                          className="item-value"
                          style={
                            isNegative
                              ? {
                                  left: "0",
                                  transform: "translateX(-67px)",
                                }
                              : {
                                  right: "0",
                                  transform: "translateX(67px)",
                                }
                          }
                        >
                          {formatNumber({
                            num: item.value,
                            unit: formatUnit,
                            returnUnit: showStickUnit,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
                return (
                  <li key={`${item.label}-${item.id}`}>
                    {item.path && linksExt && (
                      <a
                        href={`https://${window.location.host}${item.path.href}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {linkContent}
                      </a>
                    )}
                    {item.path && !linksExt && (
                      <Link legacyBehavior {...item.path}>
                        <a className={`${linksDisabled ? "disabled" : ""}`}>
                          {linkContent}
                        </a>
                      </Link>
                    )}
                    {!item.path && (
                      <div className={`${linksDisabled ? "disabled" : ""}`}>
                        {linkContent}
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
        <Desktop>
          <div
            className="cartesian-grid"
            style={{
              ...(allNegative && {
                left: "calc(40% + 67px)",
                right: 0,
                width: "calc(100% - 40% - 67px)",
              }),
              ...(allPositive && {
                left: "40%",
                right: 0,
                width: "calc(100% - 40% - 67px)",
              }),
              ...(!allPositive &&
                !allNegative && {
                  left: "calc(40% + 67px)",
                  right: 0,
                  width: "calc(100% - 40% - 67px - 67px)",
                }),
            }}
          >
            {ticks.map((tick) => (
              <div
                className="grid-line"
                key={tick}
                style={{
                  position: "absolute",
                  right:
                    tick < 0 &&
                    (allNegative
                      ? `${this.interpolate(tick, dataMin, dataMax)}%`
                      : `${this.interpolate(tick - dataMax)}%`),
                  left:
                    tick === 0
                      ? `${this.interpolate(dataMin, dataMin, dataMax)}%`
                      : tick > 0 &&
                        `${this.interpolate(
                          tick - dataMin,
                          dataMin,
                          dataMax
                        )}%`,
                }}
              />
            ))}
          </div>
        </Desktop>
      </div>
    );
  }
}

LollipopChart.propTypes = {
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  settingsConfig: PropTypes.array,
  config: PropTypes.object,
  className: PropTypes.string,
  linksDisabled: PropTypes.bool,
  linksExt: PropTypes.bool,
  simple: PropTypes.bool,
};

export default LollipopChart;
