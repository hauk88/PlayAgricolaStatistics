import { useState } from 'react';
import data from './data.json'


import { DataGrid } from '@material-ui/data-grid';

const columns = [
  { field: 'name', headerName: 'Name', width: 140 },
  { field: 'Deck', headerName: 'Deck', width: 140 },
  { field: 'ADP', headerName: 'ADP', width: 140 },
  { field: 'PWR', headerName: 'PWR', width: 140 },
  { field: 'dealt', headerName: 'Dealt', width: 140 },
  { field: 'drafted', headerName: 'Drafted', width: 140 },
  { field: 'played', headerName: 'Played', width: 140 },
  { field: 'won', headerName: 'Won', width: 140 },
  { field: 'play_ratio', headerName: 'Play ratio', width: 140 },
  { field: 'win_ratio', headerName: 'Win ratio', width: 140 },
];

function App() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const imgUrl = process.env.PUBLIC_URL + '/img/' + data[selectedIdx].img_name + '.jpg';
  return (
<div className="grid-container">
  <div className="grid-item" id='inner_remaining'>
    {/* @ts-ignore */}
    <DataGrid rows={data} columns={columns} onSelectionModelChange={(v) => setSelectedIdx(v[0])} />
  </div>
  <div className="grid-item">
    <img src={imgUrl} alt="Cant find image" />
  </div>
</div>
    // <div id="outer">
    //   <div id="inner_remaining">
    //     {/* @ts-ignore */}
    //     <DataGrid rows={data} columns={columns} onSelectionModelChange={(v) => setSelectedIdx(v[0])} />
    //   </div>

    //   <div id="inner_fixed">
    //     <img src={imgUrl} alt="Cant find image" />
    //   </div>
    // </div>
  );
}

export default App;
