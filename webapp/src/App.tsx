import React from 'react';
import logo from './logo.svg';
import './App.css';
import data from './data.json'

function App() {
  console.log(data)

  return (
    <div className="App">
      <header className="App-header">
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>PWR</th>
            <th>Deck</th>
            <th>Drafted</th>
          </tr>
          </thead>
          <tbody>
          {data.map((d,idx) => (
            <tr key={idx}>
              <td>{d.name}</td>
              <td>{d.PWR}</td>
              <td>{d.Deck}</td>
              <td>{d.drafted}</td>
            </tr>))}
            </tbody>
        </table>
      </header>
    </div>
  );
}

interface ICardProps {
  name: string,
  pwr: number
}

function CardData(props: ICardProps) {
  const name = props.name;
  const pwr = props.pwr;
  return (
    <div>
      <p>{name} - {pwr}</p>
    </div>
  )
}

export default App;
