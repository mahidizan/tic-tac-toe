import { useState } from "react";
import "./App.css";

function Square({ value, onSquareClick, winnerSquare }) {
  return (
    <button
      className={winnerSquare ? "square winner-square" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);

  let status;

  if (winnerInfo) {
    status = "Winner: " + winnerInfo.winner;
  } else if (squares.every((square) => square !== null)) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  let boardRows = [];

  for (let row = 0; row < 3; row++) {
    let rowSquares = [];

    for (let col = 0; col < 3; col++) {
      const i = row * 3 + col;

      const winnerSquare = winnerInfo && winnerInfo.line.includes(i);

      rowSquares = [
        ...rowSquares,
        <Square
          key={i}
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
          winnerSquare={winnerSquare}
        />,
      ];
    }

    boardRows = [
      ...boardRows,
      <div className="board-row" key={row}>
        {rowSquares}
      </div>,
    ];
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);

  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      nextSquares.slice(),
    ];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let location = "";

    if (move > 0) {
      const oldSquares = history[move - 1];

      let squareIndex = -1;

      for (let i = 0; i < squares.length; i++) {
        if (squares[i] !== oldSquares[i]) {
          squareIndex = i;
          break;
        }
      }

      const row = Math.floor(squareIndex / 3) + 1;
      const col = (squareIndex % 3) + 1;

      location = " (" + row + ", " + col + ")";
    }

    let description;

    if (move > 0) {
      description = "Go to move #" + move + location;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        {move === currentMove ? (
          <span>
            You are at move #{move}
            {location}
          </span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = ascending ? moves : moves.slice().reverse();

  return (
    <div className="page">
      <h1>Tic-Tac-Toe</h1>

      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>

        <div className="game-info">
          <button
            className="sort-button"
            onClick={() => setAscending(!ascending)}
          >
            Sort {ascending ? "Descending" : "Ascending"}
          </button>

          <ol>{sortedMoves}</ol>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c],
      };
    }
  }

  return null;
}
