import { useEffect, useState } from 'react'


function App() {
  const [count, setCount] = useState(0) // 초기 설정을 숫자로!
  const [list, setList] = useState([])
  // 아무것도 안 쓰는 경우 밑에서 배열인지 아닌지 검사하는 경우가 또 필요함 
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const response = await fetch("https://api.example.com/data")
      const result = await response.json()
      setList(result)
    }
    fetchData()
  }, [])
  return (
    <>
      <button onClick={() => { setCount(prev => prev + 1) }}>
        {count}
      </button>
      <div>
        {list.map((item) =>
          <div>
            {item}
          </div>
        )}
      </div>
    </>
  )
}

export default App
