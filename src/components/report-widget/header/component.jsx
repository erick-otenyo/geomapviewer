import Icon from "@/components/ui/icon";
import InfoIcon from "@/assets/icons/info.svg?sprite"

export default function WidgetHeader({ title, onToggleInfo }) {
  return (
    <header className="c-widget-header">
      <div className="header-container">
        <div className="title-container">
          <div className="c-title">{title}</div>
        </div>
        <div className="button-list">
          <ul>
            <li>
              <button
                type="button"
                className="c-btn -clean"
                onClick={onToggleInfo}
              >
                <Icon name={InfoIcon} className="-small" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
