import {useEffect, useState} from "react";

const width=8
const candyColors=[
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'yellow'
]

const App=()=> {

  const [currentColorArrangement,setCurrentColorArrangement]=useState([])
  const [squareBeingDragged,setsquareBeingDragged]=useState(null)
  const [squareBeingReplaced,setSquareBeingReplaced]=useState(null)
  const checkForColumnFour=()=>{
    for(let i=0; i<=39; i++){
      const columnOfFour=[i,i+width,i+width*2,i+width*3]
      const decidedColor=currentColorArrangement[i]

      if(columnOfFour.every(square=> currentColorArrangement[square]=== decidedColor)){
        columnOfFour.forEach(square => currentColorArrangement[square]='')
        return true
      }
    }
  }
  const checkForColumnThree=()=>{
    for(let i=0; i<=47; i++){
      const columnOfThree=[i,i+width,i+width*2]
      const decidedColor=currentColorArrangement[i]

      if(columnOfThree.every(square=> currentColorArrangement[square]=== decidedColor)){
        columnOfThree.forEach(square => currentColorArrangement[square]='')
        return true
      }
    }
  }

  const checkForRowThree=()=>{
    for(let i=0; i<64; i++){
      const rowOfThree=[i,i+1,i+2]
      const decidedColor=currentColorArrangement[i]
      const notValid=[6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]
      if(notValid.includes(i)) continue
      if(rowOfThree.every(square=> currentColorArrangement[square]=== decidedColor)){
        rowOfThree.forEach(square => currentColorArrangement[square]='')
        return true
      }
    }
  }
  const checkForRowFour=()=>{
    for(let i=0; i<64; i++){
      const rowOfFour=[i,i+1,i+2,i+3]
      const decidedColor=currentColorArrangement[i]
      const notValid=[5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64]
      if(notValid.includes(i)) continue
      if(rowOfFour.every(square=> currentColorArrangement[square]=== decidedColor)){
        rowOfFour.forEach(square => currentColorArrangement[square]='')
        return true
      }
    }
  }
  const moveIntoSquare=()=>{
    for(let i=0; i<=55; i++){
      const firstRow=[0,1,2,3,4,5,6,7]
      const isFirstRow=firstRow.includes(i)

      if(isFirstRow&&currentColorArrangement[i]===''){
        let randomNumber=Math.floor(Math.random()*candyColors.length)
        currentColorArrangement[i]=candyColors[randomNumber]
      }
      if((currentColorArrangement[i+width])=== ''){
        currentColorArrangement[i+width]=currentColorArrangement[i]
        currentColorArrangement[i]=''
      }
    }
  }

  const dragStart=(e)=>{
    setsquareBeingDragged(e.target)
    console.log("e.target",e.target)

  }
  const dragDrop=(e)=>{
    setSquareBeingReplaced(e.target)
    console.log("e.target",e.target)

  }

  const dragEnd = () => {
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))
    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.style.backgroundColor
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.style.backgroundColor


    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedId)


    const isAColumnOfFour=checkForColumnFour()
    const isACRowOfFour=checkForRowFour()
    const isAColumnOfThree=checkForColumnThree()
    const isARowOfThree=checkForRowThree()

    if (squareBeingReplacedId &&
        validMove &&
        (isARowOfThree || isACRowOfFour || isAColumnOfFour || isAColumnOfThree)) {
      setSquareBeingReplaced(null)
      setSquareBeingReplaced(null)
    } else {
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
      setCurrentColorArrangement([...currentColorArrangement])
    }
  }
  const createBoard=()=>{
    const randomColorArrangement=[]
    for(let i=0; i<width*width; i++){
      const randomColor=candyColors[Math.floor(Math.random()*candyColors.length)]
      randomColorArrangement.push(randomColor)
    }
    setCurrentColorArrangement(randomColorArrangement)
  }
  useEffect(()=>{
    createBoard()
  },[])


  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnFour()
      checkForRowFour()
      checkForColumnThree()
      checkForRowThree()
      moveIntoSquare()

      setCurrentColorArrangement([...currentColorArrangement])
    }, 100)
    return () => clearInterval(timer)
  },[checkForColumnFour,checkForRowFour,checkForColumnThree ,checkForRowThree,moveIntoSquare,currentColorArrangement])


  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor,index)=>(
            <img
                key={index}
                style={{backgroundColor:candyColor}}

                data-id={index}
                draggable={"true"}
                onDragStart={dragStart}
                onDragOver={(e)=>e.preventDefault()}
                onDragEnter={(e)=>e.preventDefault()}
                onDragLeave={(e)=>e.preventDefault()}
                onDrop={dragDrop}
                onDragEnd={dragEnd}
            />
          )
        )}
      </div>
    </div>
  );
}

export default App;
