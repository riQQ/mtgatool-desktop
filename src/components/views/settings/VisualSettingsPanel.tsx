import { useMemo, useState, useCallback } from "react";
import _ from "lodash";

import { useDispatch, useSelector } from "react-redux";
import { CardQuality } from "mtgatool-shared";

import { AppState } from "../../../redux/stores/rendererStore";
import { getCardImage } from "../../../utils/getCardArtCrop";
import Slider from "../../ui/Slider";
import Select from "../../ui/Select";
import CardTile from "../../CardTile";

import database from "../../../utils/database-wrapper";
import reduxAction from "../../../redux/reduxAction";

export default function VisualSettingsPanel(): JSX.Element {
  const dispatch = useDispatch();
  const settings = useSelector((state: AppState) => state.settings);
  const cardSize = 100 + settings.cardsSize * 15;
  const card = database.card(70344);

  // Hover card size slider
  const [hoverCardSize, setHoverCardSize] = useState(
    settings.cardsSizeHoverCard
  );

  const hoverCardSizeDebouce = useMemo(() => {
    return _.debounce((value: number) => {
      reduxAction(dispatch, {
        type: "SET_SETTINGS",
        arg: { cardsSizeHoverCard: value },
      });
    }, 500);
  }, [dispatch]);

  const hoverCardSizeHandler = (value: number): void => {
    setHoverCardSize(value);
    hoverCardSizeDebouce(value);
  };

  // Collection card size slider
  const [collectionCardSize, setCollectionCardSize] = useState(
    settings.cardsSize
  );

  const collectionCardSizeDebouce = useMemo(() => {
    return _.debounce((value: number) => {
      reduxAction(dispatch, {
        type: "SET_SETTINGS",
        arg: { cardsSize: value },
      });
    }, 500);
  }, [dispatch]);

  const collectionCardSizeHandler = (value: number): void => {
    setCollectionCardSize(value);
    collectionCardSizeDebouce(value);
  };

  const setCardQuality = useCallback(
    (filter: CardQuality) => {
      reduxAction(dispatch, {
        type: "SET_SETTINGS",
        arg: { cardsQuality: filter },
      });
    },
    [dispatch]
  );

  return (
    <>
      <div className="centered-setting-container">
        {!!card && (
          <CardTile
            card={card}
            indent="a"
            isHighlighted={false}
            isSideboard={false}
            quantity={{ type: "NUMBER", quantity: 4 }}
            showWildcards={false}
          />
        )}
      </div>
      <div className="centered-setting-container">
        <label>Cards image quality:</label>
        <Select
          options={["small", "normal", "large"]}
          current={settings.cardsQuality}
          callback={setCardQuality}
        />
      </div>
      <div className="centered-setting-container">
        <label style={{ width: "400px" }}>
          {`Hover card size: ${100 + Math.round(hoverCardSize) * 15}px`}
        </label>
        <Slider
          min={0}
          max={20}
          step={1}
          value={settings.cardsSizeHoverCard}
          onChange={hoverCardSizeHandler}
        />
      </div>

      <div className="centered-setting-container">
        <label style={{ width: "400px" }}>
          {`Collection card size: ${
            100 + Math.round(collectionCardSize) * 15
          }px`}
        </label>
        <Slider
          min={0}
          max={20}
          step={1}
          value={settings.cardsSize}
          onChange={collectionCardSizeHandler}
        />
      </div>

      <label>
        Example collection card:
        <div
          className="inventory-card-settings"
          style={{
            marginTop: "16px",
            width: `${cardSize}px`,
            alignSelf: "flex-start",
          }}
        >
          {card && (
            <img
              className="inventory-card-settings-img"
              style={{ width: `${cardSize}px` }}
              src={getCardImage(card, settings.cardsQuality)}
            />
          )}
        </div>
      </label>
    </>
  );
}
