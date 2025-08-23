import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CardView from "./CardView";
import { useSearchParams } from "react-router-dom";
import { useStats } from "../../hooks";

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 140 },
  { field: "deck", headerName: "Deck", width: 140 },
  { field: "type", headerName: "Type", width: 140 },
  { field: "is_no", headerName: "NO Deck", width: 140 },
  { field: "banned", headerName: "Banned", width: 140 },
  { field: "PWR", headerName: "PWR", width: 140 },
  { field: "up_PWR", headerName: "Updated PWR", width: 140 },
  {
    field: "pwr_diff",
    headerName: "PWR diff",
    width: 140,
    valueGetter: (_, row) =>
      (row.up_PWR === null || row.PWR === null)
        ? null
        : Math.abs(row.up_PWR - row.PWR).toFixed(2),
  },
  { field: "ADP", headerName: "ADP", width: 140 },
  { field: "up_ADP", headerName: "Updated ADP", width: 140 },
  {
    field: "adp_diff",
    headerName: "ADP diff",
    width: 140,
    valueGetter: (_, row) =>
      (row.up_ADP === null || row.ADP === null)
        ? null
        : Math.abs(row.up_ADP - row.ADP).toFixed(2),
  },
  { field: "dealt", headerName: "Dealt", width: 140 },
  { field: "drafted", headerName: "Drafted", width: 140 },
  { field: "played", headerName: "Played", width: 140 },
  { field: "won", headerName: "Won", width: 140 },
  { field: "play_ratio", headerName: "Play ratio", width: 140 },
  { field: "win_ratio", headerName: "Win ratio", width: 140 },
  { field: "up_dealt", headerName: "Updated Dealt", width: 140 },
  { field: "up_drafted", headerName: "Updated Drafted", width: 140 },
  { field: "up_played", headerName: "Updated Played", width: 140 },
  { field: "up_won", headerName: "Updated Won", width: 140 },
];

function Table() {
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useStats();

  const selectedIdx = parseInt(searchParams.get("card") ?? "0", 0);
  const useAlt = searchParams.get("alt") !== "false";
  const selectedCard = data[selectedIdx];
  return (
    <div className="grid h-screen w-screen grid-cols-[1fr_240px]">
      <div className="h-full overflow-auto">
        <DataGrid
          rows={data}
          columns={columns}
          onRowSelectionModelChange={(v) =>
            setSearchParams((params) => {
              const idx = v[0];
              params.set("card", idx.toString());
              return params;
            })
          }
        />
      </div>
      {selectedCard !== undefined && (
        <div className="flex h-full flex-col items-center justify-center">
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
      )}
    </div>
  );
}

export default Table;
