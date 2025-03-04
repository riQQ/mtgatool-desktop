/* eslint-disable radix */
/* eslint-disable no-console */
import _ from "lodash";
import { database, loadDbFromCache as loadDbFromShared } from "mtgatool-shared";
import axios from "axios";
import electron from "./electron/electronWrapper";

// import distributedDb from "../assets/resources/database.json";

let cachePath: string | null = null;
if (electron) {
  // eslint-disable-next-line no-undef
  const path = __non_webpack_require__("path");
  cachePath =
    electron.app || (electron.remote && electron.remote.app)
      ? path.join(
          (electron.app || electron.remote.app).getPath("userData"),
          "database.json"
        )
      : null;
}

/*
 This is cool for debugging the metadata files, so we can
 test and view the output files without copypasta.
*/
/*
const cachePath =
  app || (remote && remote.app)
    ? path.join(
        "C:\\Users\\user\\Documents\\GitHub\\MTG-Arena-Tool-Metadata\\dist",
        "v67-en-database.json"
      )
    : null;

const scryfallDataPath = path.join(
  "C:\\Users\\user\\Documents\\GitHub\\MTG-Arena-Tool-Metadata\\external",
  "scryfall-cards.json"
);
*/

export function updateCache(data: string): void {
  try {
    // eslint-disable-next-line no-undef
    const fs = __non_webpack_require__("fs");
    if (cachePath) {
      console.log(`Saved metadata to ${cachePath}`);
      fs.writeFileSync(cachePath, data);
    }
  } catch (e) {
    console.log(`Error updating cache: ${e}`, "error");
  }
}

export function loadDbFromCache(): void {
  loadDbFromShared();
  if (electron) {
    // eslint-disable-next-line no-undef
    const fs = __non_webpack_require__("fs");
    if (cachePath && fs.existsSync(cachePath)) {
      const dbString = fs.readFileSync(cachePath, "utf8");
      database.setDatabase(dbString);
      console.log(`Loaded metadata from cache (${cachePath})`);
    } else {
      console.log(`Cache not found (${cachePath}), try to generate it.`);
      // database.setDatabaseUnsafely(distributedDb as Metadata);
      updateCache(JSON.stringify(database.metadata));
    }
  }

  axios
    .get("https://mtgatool.com/database/latest/")
    .then((latestRes) => {
      if (parseInt(latestRes.data.latest) > database.version) {
        axios
          .get<any>("https://mtgatool.com/database/")
          .then((res) => {
            console.log("Updated cards database OK");
            console.log("New DB version: ", latestRes.data.latest);
            database.setDatabaseUnsafely(res.data);
            updateCache(JSON.stringify(res.data));
          })
          .catch((e) => {
            console.info(
              "There was a problem updating cards database from https://mtgatool.com/database/"
            );
            console.info(e);
          });
      } else {
        console.log(`Database up to date. (v${latestRes.data.latest})`);
      }
    })
    .catch((e) => {
      console.info(
        "There was a problem updating cards database from https://mtgatool.com/database/latest"
      );
      console.info(e);
    });
}

window.database = database;

export default database;
