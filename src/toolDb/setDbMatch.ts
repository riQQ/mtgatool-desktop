import _ from "lodash";
import { Deck, InternalMatch } from "mtgatool-shared";
import reduxAction from "../redux/reduxAction";

import store from "../redux/stores/rendererStore";
import { DbDeck, DbMatch } from "../types/dbTypes";
import getLocalSetting from "../utils/getLocalSetting";

export default async function setDbMatch(match: InternalMatch) {
  console.log("> Set match", match);
  const { dispatch, getState } = store;

  const newDbMatch: DbMatch = {
    matchId: match.id,
    playerId: getLocalSetting("playerId"),
    playerDeckId: match.playerDeck.id,
    playerDeckHash: match.playerDeckHash,
    playerDeckColors: new Deck(match.playerDeck).colors.getBits(),
    oppDeckColors: new Deck(match.oppDeck).colors.getBits(),
    playerName: match.player.name,
    playerWins: match.player.wins,
    playerLosses: match.opponent.wins,
    eventId: match.eventId,
    duration: match.duration,
    internalMatch: match,
    timestamp: new Date().getTime(),
    // actionLog: match.actionLog,
  };

  const hasWon = match.player.wins > match.opponent.wins;

  window.toolDb.putData<DbMatch>(`matches-${match.id}`, newDbMatch, true);

  reduxAction(dispatch, {
    type: "SET_MATCH",
    arg: newDbMatch,
  });

  window.toolDb
    .getData<string[]>("matchesIndex", true)
    .then((oldMatchesIndex) => {
      const newMatchesIndex = _.uniq([...(oldMatchesIndex || []), match.id]);

      reduxAction(dispatch, {
        type: "SET_MATCHES_INDEX",
        arg: newMatchesIndex,
      });

      window.toolDb.putData<string[]>("matchesIndex", newMatchesIndex, true);
    });

  const { decks, decksIndex } = getState().mainData;

  const deckDbKey = `${match.playerDeck.id}-v${
    decksIndex[match.playerDeck.id] || 0
  }`;

  const oldDeck = decks[deckDbKey];
  console.log("oldDeck", oldDeck);
  if (oldDeck) {
    const newDeck: DbDeck = JSON.parse(JSON.stringify(oldDeck));
    if (!Object.keys(newDeck.matches).includes(match.id)) {
      newDeck.stats.gameWins += match.player.wins;
      newDeck.stats.gameLosses += match.opponent.wins;
      newDeck.stats.matchWins += hasWon ? 1 : 0;
      newDeck.stats.matchLosses += hasWon ? 0 : 1;
      console.log("Deck's match new stats: ", newDeck.stats);

      window.toolDb.putData<DbDeck>(`decks-${deckDbKey}`, newDeck, true);

      reduxAction(dispatch, {
        type: "SET_DECK",
        arg: newDeck,
      });
    }
  }
}
