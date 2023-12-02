import { useState } from "react";
import data from "./data.json";

import { DataGrid } from "@material-ui/data-grid";
import CardView from "./CardView";
import { useSearchParams } from "react-router-dom";

const columns = [
  { field: "name", headerName: "Name", width: 140 },
  { field: "Deck", headerName: "Deck", width: 140 },
  { field: "banned", headerName: "Banned", width: 140 },
  { field: "ADP", headerName: "ADP", width: 140 },
  { field: "PWR", headerName: "PWR", width: 140 },
  { field: "dealt", headerName: "Dealt", width: 140 },
  { field: "drafted", headerName: "Drafted", width: 140 },
  { field: "played", headerName: "Played", width: 140 },
  { field: "won", headerName: "Won", width: 140 },
  { field: "play_ratio", headerName: "Play ratio", width: 140 },
  { field: "win_ratio", headerName: "Win ratio", width: 140 },
];

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedIdx = parseInt(searchParams.get("card") ?? "0", 0);
  const useAlt = searchParams.get("alt") !== "false";
  const selectedCard = data[selectedIdx];
  return (
    <div className="grid-container">
      <div className="grid-item" id="inner_remaining">
        <DataGrid
          rows={data}
          columns={columns}
          /* @ts-ignore */
          onSelectionModelChange={(v) =>
            setSearchParams((params) => {
              params.set("card", `${v[0]}`);
              return params;
            })
          }
        />
      </div>
      <div className="grid-item">
        <div>
          <label>Show globus card if available</label>
          <input
            type="checkbox"
            checked={useAlt}
            onChange={() =>
              setSearchParams((params) => {
                params.set("alt", `${!useAlt}`);
                return params;
              })
            }
          />
        </div>
        <CardView card={selectedCard} preferAlt={useAlt} />
      </div>
    </div>
  );
}

export default App;
