import { database } from "mtgatool-shared";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as DataIcon } from "../assets/images/svg/data.svg";
import { AppState } from "../redux/stores/rendererStore";
import vodiFn from "../utils/voidfn";
import Alt from "./Alt";
import SvgButton from "./SvgButton";

interface StatusLineProps {
  title: string;
  status: "OK" | "LOADING" | "ERROR";
}

function StatusLine(props: StatusLineProps) {
  const { title, status } = props;
  return (
    <div className="data-status-line">
      {status === "OK" && <div className="status-ok" />}
      {status === "ERROR" && <div className="status-err" />}
      {status === "LOADING" && <div className="status-loading" />}
      <div>{title}</div>
    </div>
  );
}

export default function DataStatus() {
  const closeAltRef = useRef<() => void>(vodiFn);
  const openAltRef = useRef<() => void>(vodiFn);
  const positionRef = useRef<HTMLDivElement>(null);

  const { cards, uuidData, matchesIndex, decksIndex, currentUUID } =
    useSelector((state: AppState) => state.mainData);

  return (
    <>
      <Alt
        defaultOpen={false}
        width={200}
        height={160}
        yOffset={-67}
        direction="LEFT"
        doOpen={openAltRef}
        doHide={closeAltRef}
        positionRef={positionRef}
      >
        <div className="data-status-container">
          <StatusLine
            title={`Matches (${matchesIndex.length})`}
            status={matchesIndex.length > 0 ? "OK" : "LOADING"}
          />
          <StatusLine
            title={`Decks (${Object.keys(decksIndex).length})`}
            status={Object.keys(decksIndex).length > 0 ? "OK" : "LOADING"}
          />
          <StatusLine
            title={`Cards database (${Object.keys(database.cards).length})`}
            status={database.cards ? "OK" : "LOADING"}
          />
          <StatusLine
            title={`Owned cards (${Object.keys(cards).length})`}
            status={Object.keys(cards).length > 0 ? "OK" : "LOADING"}
          />
          <StatusLine
            title="User data"
            status={
              uuidData[currentUUID]?.inventory.WildCardCommons !== undefined &&
              uuidData[currentUUID]?.inventory.Gems !== undefined
                ? "OK"
                : "LOADING"
            }
          />
        </div>
      </Alt>
      <div
        className="data-status"
        onMouseEnter={openAltRef.current}
        onMouseLeave={closeAltRef.current}
        ref={positionRef}
      >
        <SvgButton
          svg={DataIcon}
          style={{ height: "20px", width: "20px", margin: "auto" }}
          onClick={() => {
            //
          }}
        />
      </div>
    </>
  );
}
