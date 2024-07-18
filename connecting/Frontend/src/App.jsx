import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [details, setDetails] = useState([]);

  // useEffect(() => {
  //   axios.get('http://localhost:4000/api/details')
  //     .then((res) => {
  //       setDetails(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Halo fellaas</h1>
      <p>Details: {details.length}</p>
      {details.map((element) => (
        <div key={element.id}>
          <h3>{element.name}</h3>
          <p>{element.dept}</p>
        </div>
      ))}
    </>
  )
}

export default App