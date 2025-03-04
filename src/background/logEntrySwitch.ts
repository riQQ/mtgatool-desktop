import LogEntry from "../types/logDecoder";
import * as Labels from "./onLabel";

// eslint-disable-next-line complexity
export default function logEntrySwitch(entry: LogEntry): void {
  if (typeof entry.json.Payload === "string") {
    try {
      const newJson = JSON.parse(entry.json.Payload);
      // eslint-disable-next-line no-param-reassign
      entry.json = newJson;
    } catch (e) {
      console.warn(e);
    }
  }
  console.log("logEntrySwitch", entry.arrow, entry.label, entry.json);
  switch (entry.label) {
    case "GreToClientEvent":
      Labels.GreToClient(entry);
      break;

    case "ClientToMatchServiceMessageType_ClientToGREMessage":
      Labels.ClientToMatchServiceMessageTypeClientToGREMessage(entry);
      break;

    case "Event.GetPlayerCourseV2":
      if (entry.arrow == "<==") {
        Labels.InEventGetPlayerCourseV2(entry);
      }
      break;

    case "Rank_GetCombinedRankInfo":
      if (entry.arrow == "<==") {
        Labels.InEventGetCombinedRankInfo(entry);
      }
      break;

    case "Draft.Notify":
      Labels.InDraftNotify(entry);
      break;

    case "Draft.MakeHumanDraftPick":
      if (entry.arrow == "==>") {
        Labels.outMakeHumanDraftPick(entry);
      } else if (entry.arrow == "<==") {
        Labels.InMakeHumanDraftPick(entry);
      }
      break;

    case "Client.SceneChange":
      Labels.onClientSceneChange(entry);
      break;

    case "AuthenticateResponse":
      Labels.onAuthenticateResponse(entry);
      break;

    case "Event.JoinPodmaking":
      if (entry.arrow == "==>") {
        Labels.InEventJoinPodMaking(entry);
      }
      break;

    case "Event.GetPlayerCoursesV2":
      if (entry.arrow == "<==") {
        Labels.InEventGetPlayerCoursesV2(entry);
      }
      break;

    case "Deck.GetDeckListsV3":
      if (entry.arrow == "<==") {
        Labels.InDeckGetDeckListsV3(entry);
      }
      break;

    case "Deck.GetPreconDecks":
      if (entry.arrow == "<==") {
        Labels.InDeckGetPreconDecks(entry);
      }
      break;

    case "Deck.UpdateDeckV3":
      if (entry.arrow == "<==") {
        Labels.InDeckUpdateDeckV3(entry);
      }
      break;

    case "Inventory.Updated":
      // handler works for both out and in arrows
      Labels.InventoryUpdated(entry);
      break;

    case "PostMatch.Update":
      if (entry.arrow == "<==") {
        Labels.PostMatchUpdate(entry);
      }
      break;

    case "PlayerInventory.GetPlayerInventory":
      if (entry.arrow == "<==") {
        Labels.InPlayerInventoryGetPlayerInventory(entry);
      }
      break;

    case "PlayerInventory.GetPlayerCardsV3":
      if (entry.arrow == "<==") {
        Labels.InPlayerInventoryGetPlayerCardsV3(entry);
      }
      break;

    case "Progression.GetPlayerProgress":
      if (entry.arrow == "<==") {
        Labels.InProgressionGetPlayerProgress(entry);
      }
      break;

    case "Event.DeckSubmitV3":
      if (entry.arrow == "<==") {
        Labels.InEventDeckSubmitV3(entry);
      }
      break;

    case "Event.AIPractice":
      if (entry.arrow == "==>") {
        Labels.OutEventAIPractice(entry);
      }
      break;

    case "DirectGame.Challenge":
      if (entry.arrow == "==>") {
        Labels.OutDirectGameChallenge(entry);
      }
      break;

    case "BotDraft_DraftStatus":
      if (entry.arrow == "==>") {
        Labels.outBotDraftDraftStatus(entry);
      }
      if (entry.arrow == "<==") {
        Labels.InBotDraftDraftStatus(entry);
      }
      break;

    case "BotDraft_DraftPick":
      if (entry.arrow == "<==") {
        Labels.InDraftMakePick(entry);
      } else {
        Labels.OutDraftMakePick(entry);
      }
      break;

    case "Event.CompleteDraft":
      if (entry.arrow == "<==") {
        Labels.InEventCompleteDraft(entry);
      }
      break;

    case "Event.GetActiveEventsV2":
      if (entry.arrow == "<==") {
        Labels.InEventGetActiveEventsV2(entry);
      }
      break;

    case "Event.GetActiveEventsV3":
      if (entry.arrow == "<==") {
        Labels.InEventGetActiveEventsV3(entry);
      }
      break;

    case "MatchGameRoomStateChangedEvent":
      Labels.MatchGameRoomStateChangedEvent(entry);
      break;

    case "Event.GetSeasonAndRankDetail":
      if (entry.arrow == "<==") {
        Labels.InEventGetSeasonAndRankDetail(entry);
      }
      break;

    case "PlayerInventory.GetRewardSchedule":
      if (entry.arrow == "<==") {
        Labels.GetPlayerInventoryGetRewardSchedule(entry);
      }
      break;

    case "PlayerInventory.GetFormats":
      if (entry.arrow == "<==") {
        Labels.GetPlayerInventoryGetFormats(entry);
      }
      break;

    case "Event_GetCourses":
      if (entry.arrow == "<==") {
        Labels.InEventGetCourses(entry);
      }
      break;

    default:
      break;
  }
}
