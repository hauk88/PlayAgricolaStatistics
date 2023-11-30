import { useState } from "react";
import data from "./data.json";

import { DataGrid } from "@material-ui/data-grid";
import CardView from "./CardView";

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
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedCard = data[selectedIdx];
  return (
    <div className="grid-container">
      <div className="grid-item" id="inner_remaining">
        <DataGrid
          rows={data}
          columns={columns}
          /* @ts-ignore */
          onSelectionModelChange={(v) => setSelectedIdx(v[0])}
        />
      </div>
      <CardView card={selectedCard} />
    </div>
  );
}

export default App;
