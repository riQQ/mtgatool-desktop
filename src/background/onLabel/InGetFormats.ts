import LogEntry from "../../types/logDecoder";

interface Format {
  name: string;
  sets: string[];
  bannedTitleIds: number[];
  suspendedTitleIds: number[];
  allowedTitleIds: number[];
  cardCountRestriction: "None" | "Singleton" | "Limited";
  mainDeckQuota: {
    min: number;
    max: number;
  };
  sideBoardQuota: {
    min: number;
    max: number;
  };
  commandZoneQuota: {
    min: number;
    max: number;
  };
}

interface FormatsEvent {
  Formats: Format[];
}

interface Entry extends LogEntry {
  json: FormatsEvent;
}

export default function InGetFormats(entry: Entry): void {
  const _json = entry.json;
}
