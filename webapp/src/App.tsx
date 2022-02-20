import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
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
    <div style={{ height: 500, width: '80%' }}>
      <h4>How to use DataGrid Component in ReactJS?</h4>
      {/*@ts-ignore */}
      <DataGrid rows={data} columns={columns} onSelectionModelChange={(v) => setSelectedIdx(v[0])} />
      <h4>Test card {data[selectedIdx].name}</h4>
      <img src={imgUrl} alt="Cant find image" />
    </div>
  );
}

export default App;
