import {useState} from "react";

const INITIAL_NAME = ''
const INITIAL_SCORE = 0
const INITIAL_CLICK_COUNT = 0

function App() {
  const [name, setName] = useState(INITIAL_NAME)
  const [score, setScore] = useState(INITIAL_SCORE)
  const [clickCount, setClickCount] = useState(INITIAL_CLICK_COUNT)


  function handleChange(e) {
    setName(e.target.value)
  }

  function handleScore() {
    setScore((score) => score + Math.floor((Math.random() * 200) - 100))
    setClickCount((clickCount) => setClickCount(clickCount + 1))
  }

  async function handleSubmit() {
    try {
      await fetch('https://codesandbox.io/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, score})
    });
    } catch (err) {

    } finally {
      setName(INITIAL_NAME)
      setScore(INITIAL_SCORE)
      setClickCount(INITIAL_CLICK_COUNT)
    }
  }

  return (
    <div className="App">
      <section>
        <div>
          click counter {clickCount}
        </div>
        <div>
          score {score}
        </div>
        <label>
          {'Name '}
         <input value={name} onChange={handleChange}/>
        </label>
        <button type="button" onClick={handleSubmit}>Submit</button>
        <button type="button" onClick={handleScore} disabled={clickCount >= 10}>generate score</button>
      </section>
    </div>
  );
}

export default App;
