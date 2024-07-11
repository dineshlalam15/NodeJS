import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    axios.get('localhost:4000/api/details')
    .then((res) => {
      setDetails(res.data)
    }).catch((err) => {
      console.log(err)
    })
  })

  return (
    <>
      <h1>Halo fellaas</h1>
      <p>Details: {details.length}</p>
      {details.map((element) => (
        <div key = {element.id}>
          <h3>{element.name}</h3>
          <p>{element.dept}</p>
        </div>))}
    </>
  )
}

export default App
