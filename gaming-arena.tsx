/** @jsxImportSource https://esm.sh/react@18.2.0 */
import React, { useState, useCallback, useEffect, useMemo } from "https://esm.sh/react@18.2.0?deps=react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0/client?deps=react@18.2.0";

// Rock Paper Scissors Game
function RockPaperScissorsGame({ onBack }: { onBack: () => void }) {
  const CHOICES = ['✊', '✋', '✌️'] as const;
  type Choice = typeof CHOICES[number];

  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 });

  // Sound Effects with Browser-Only Check
  const sounds = useMemo(() => {
    if (typeof window !== 'undefined') {
      return {
        choose: new Audio('https://www.soundjay.com/button/sounds/button-09.mp3'),
        win: new Audio('https://www.soundjay.com/misc/sounds/success-fanfare-trumpets-6185.mp3'),
        draw: new Audio('https://www.soundjay.com/misc/sounds/slide-whistle-downward-01.mp3')
      };
    }
    // Fallback for server-side rendering
    return {
      choose: { play: () => {} },
      win: { play: () => {} },
      draw: { play: () => {} }
    };
  }, []);

  const determineWinner = useCallback((player: Choice, computer: Choice): 'win' | 'lose' | 'draw' => {
    if (player === computer) return 'draw';
    const winConditions: Record<Choice, Choice> = {
      '✊': '✌️',
      '✌️': '✋',
      '✋': '✊'
    };
    return winConditions[player] === computer ? 'win' : 'lose';
  }, []);

  const playRound = useCallback((choice: Choice) => {
    try {
      sounds.choose.play().catch(() => {});
    } catch {}

    const computerPick = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    
    setPlayerChoice(choice);
    setComputerChoice(computerPick);

    const gameResult = determineWinner(choice, computerPick);
    setResult(gameResult);

    try {
      if (gameResult === 'win') {
        sounds.win.play().catch(() => {});
      } else if (gameResult === 'draw') {
        sounds.draw.play().catch(() => {});
      }
    } catch {}

    setScore(prev => ({
      ...prev,
      player: gameResult === 'win' ? prev.player + 1 : prev.player,
      computer: gameResult === 'lose' ? prev.computer + 1 : prev.computer,
      draws: gameResult === 'draw' ? prev.draws + 1 : prev.draws
    }));
  }, [determineWinner, sounds]);

  const resetGame = useCallback(() => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  }, []);

  // Shared Styles
  const gameContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
    padding: '20px',
    boxSizing: 'border-box' as const
  };

  const backButtonStyle = {
    position: 'absolute' as const,
    top: '20px',
    left: '20px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <div style={gameContainerStyle}>
      <button onClick={onBack} style={backButtonStyle}>← Back to Games</button>
      <h1 style={{ 
        marginBottom: '20px', 
        fontSize: '2.5rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Rock Paper Scissors
      </h1>
      
      {/* Scoreboard */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '300px',
        marginBottom: '20px',
        background: 'rgba(255,255,255,0.2)',
        padding: '10px',
        borderRadius: '10px'
      }}>
        <div>Player: {score.player}</div>
        <div>Computer: {score.computer}</div>
        <div>Draws: {score.draws}</div>
      </div>

      {/* Choices */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        {CHOICES.map(choice => (
          <button
            key={choice}
            onClick={() => playRound(choice)}
            style={{
              fontSize: '4rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '10px',
              padding: '20px',
              margin: '10px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              color: 'white'
            }}
          >
            {choice}
          </button>
        ))}
      </div>

      {/* Result Display */}
      {playerChoice && computerChoice && (
        <div style={{
          textAlign: 'center',
          background: 'rgba(255,255,255,0.2)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
            {playerChoice} vs {computerChoice}
          </div>
          <div style={{
            fontSize: '1.5rem',
            color: result === 'win' ? '#4caf50' : 
                   result === 'lose' ? '#f44336' : '#ff9800'
          }}>
            {result === 'win' && 'You Win! 🎉'}
            {result === 'lose' && 'Computer Wins! 😢'}
            {result === 'draw' && 'It\'s a Draw! 🤝'}
          </div>
          <button 
            onClick={resetGame}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              background: '#3f51b5',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// Memory Card Game
function MemoryCardGame({ onBack }: { onBack: () => void }) {
  const CARD_EMOJIS = ['🍎', '🍌', '🍇', '🍉', '🍊', '🍋', '🍍', '🥝'];
  const [cards, setCards] = useState<string[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);

  // Sound Effects with Browser-Only Check
  const sounds = useMemo(() => {
    if (typeof window !== 'undefined') {
      return {
        flip: new Audio('https://www.soundjay.com/button/sounds/button-09.mp3'),
        match: new Audio('https://www.soundjay.com/misc/sounds/success-low-tone-03.mp3'),
        win: new Audio('https://www.soundjay.com/misc/sounds/success-fanfare-trumpets-6185.mp3')
      };
    }
    // Fallback for server-side rendering
    return {
      flip: { play: () => {} },
      match: { play: () => {} },
      win: { play: () => {} }
    };
  }, []);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = useCallback(() => {
    const shuffledCards = [...CARD_EMOJIS, ...CARD_EMOJIS]
      .sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setAttempts(0);
  }, []);

  const handleCardClick = useCallback((index: number) => {
    if (
      flippedIndices.includes(index) || 
      matchedPairs.includes(index)
    ) return;

    try {
      sounds.flip.play().catch(() => {});
    } catch {}

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    setAttempts(prev => prev + 1);

    if (newFlippedIndices.length === 2) {
      const [first, second] = newFlippedIndices;
      if (cards[first] === cards[second]) {
        try {
          sounds.match.play().catch(() => {});
        } catch {}
        
        setMatchedPairs(prev => [...prev, first, second]);
        setFlippedIndices([]);

        if (matchedPairs.length + 2 === cards.length) {
          try {
            sounds.win.play().catch(() => {});
          } catch {}
        }
      } else {
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  }, [cards, flippedIndices, matchedPairs, sounds]);

  // Shared Styles
  const gameContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
    padding: '20px',
    boxSizing: 'border-box' as const
  };

  const backButtonStyle = {
    position: 'absolute' as const,
    top: '20px',
    left: '20px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <div style={gameContainerStyle}>
      <button onClick={onBack} style={backButtonStyle}>← Back to Games</button>
      <h1 style={{ 
        marginBottom: '20px', 
        fontSize: '2.5rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Memory Cards
      </h1>
      
      {/* Attempts Counter */}
      <div style={{
        marginBottom: '20px',
        fontSize: '1.5rem'
      }}>
        Attempts: {attempts}
      </div>
      
      {/* Game Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(index)}
            style={{
              height: '100px',
              fontSize: '3rem',
              background: flippedIndices.includes(index) || matchedPairs.includes(index) 
                ? 'white' 
                : 'rgba(255,255,255,0.2)',
              border: '2px solid white',
              cursor: 'pointer',
              transition: 'transform 0.3s'
            }}
          >
            {(flippedIndices.includes(index) || matchedPairs.includes(index)) ? card : '❓'}
          </button>
        ))}
      </div>

      {/* Win Condition */}
      {matchedPairs.length === cards.length && (
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.2)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <div style={{ 
            fontSize: '2rem', 
            marginBottom: '15px',
            color: '#4caf50'
          }}>
            You Won in {attempts} attempts! 🎉
          </div>
          <button 
            onClick={resetGame}
            style={{
              padding: '10px 20px',
              background: '#3f51b5',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// Tic Tac Toe Game
function TicTacToeGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 });

  // Sound Effects
  const sounds = useMemo(() => {
    if (typeof window !== 'undefined') {
      return {
        place: new Audio('https://www.soundjay.com/button/sounds/button-09.mp3'),
        win: new Audio('https://www.soundjay.com/misc/sounds/success-fanfare-trumpets-6185.mp3'),
        draw: new Audio('https://www.soundjay.com/misc/sounds/slide-whistle-downward-01.mp3')
      };
    }
    return { 
      place: { play: () => {} },
      win: { play: () => {} },
      draw: { play: () => {} }
    };
  }, []);

  const calculateWinner = useCallback((squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
      [0, 4, 8], [2, 4, 6]  // diagonals
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }, []);

  const computerMove = useCallback((currentBoard: (string | null)[]) => {
    const availableMoves = currentBoard.reduce((acc, cell, index) => 
      cell === null ? [...acc, index] : acc, [] as number[]);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }, []);

  const handleClick = useCallback((i: number) => {
    if (winner || board[i]) return;

    sounds.place.play();
    const newBoard = [...board];
    newBoard[i] = xIsNext ? '❌' : '⭕';
    
    const result = calculateWinner(newBoard);
    setBoard(newBoard);
    
    if (result) {
      sounds.win.play();
      setWinner(result);
      setScore(prev => ({
        ...prev,
        [result === '❌' ? 'player' : 'computer']: prev[result === '❌' ? 'player' : 'computer'] + 1
      }));
    } else if (newBoard.every(cell => cell !== null)) {
      sounds.draw.play();
      setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
      setWinner('draw');
    } else {
      // Computer's turn
      setXIsNext(false);
      setTimeout(() => {
        const computerChoice = computerMove(newBoard);
        const computerBoard = [...newBoard];
        computerBoard[computerChoice] = '⭕';
        
        sounds.place.play();
        setBoard(computerBoard);
        
        const computerResult = calculateWinner(computerBoard);
        if (computerResult) {
          sounds.win.play();
          setWinner(computerResult);
          setScore(prev => ({
            ...prev,
            [computerResult === '❌' ? 'player' : 'computer']: 
              prev[computerResult === '❌' ? 'player' : 'computer'] + 1
          }));
        } else if (computerBoard.every(cell => cell !== null)) {
          sounds.draw.play();
          setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
          setWinner('draw');
        }
        
        setXIsNext(true);
      }, 500);
    }
  }, [board, xIsNext, winner, calculateWinner, computerMove, sounds]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  }, []);

  // Shared Styles
  const gameContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
    padding: '20px',
    boxSizing: 'border-box' as const
  };

  const backButtonStyle = {
    position: 'absolute' as const,
    top: '20px',
    left: '20px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <div style={gameContainerStyle}>
      <button onClick={onBack} style={backButtonStyle}>← Back to Games</button>
      <h1 style={{ 
        marginBottom: '20px', 
        fontSize: '2.5rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        Tic Tac Toe
      </h1>
      
      {/* Scoreboard */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '300px',
        marginBottom: '20px',
        background: 'rgba(255,255,255,0.2)',
        padding: '10px',
        borderRadius: '10px'
      }}>
        <div>Player (❌): {score.player}</div>
        <div>Computer (⭕): {score.computer}</div>
        <div>Draws: {score.draws}</div>
      </div>
      
      {/* Game Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        maxWidth: '300px',
        margin: '0 auto'
      }}>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            style={{
              height: '100px',
              fontSize: '3rem',
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid white',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Game Result */}
      {winner && (
        <div style={{
          marginTop: '20px',
          color: 'white',
          fontSize: '2rem',
          textAlign: 'center'
        }}>
          {winner === 'draw' 
            ? "It's a Draw! 🤝" 
            : `Winner: ${winner}! 🎉`}
          <button 
            onClick={resetGame}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              background: '#3f51b5',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// Game Selection Menu
function GameSelectionMenu({ onSelectGame }: { onSelectGame: (game: string) => void }) {
  const games = [
    { name: 'Rock Paper Scissors', emoji: '✋' },
    { name: 'Memory Cards', emoji: '🃏' },
    { name: 'Tic Tac Toe', emoji: '❌' }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '3rem',
        marginBottom: '30px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        🎮 Game Arena 🎮
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        maxWidth: '800px'
      }}>
        {games.map((game) => (
          <button
            key={game.name}
            onClick={() => onSelectGame(game.name)}
            style={{
              fontSize: '4rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '10px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {game.emoji}
            <div style={{ fontSize: '1rem', marginTop: '10px' }}>
              {game.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Main App Component
function OdysseyGameArena() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderGame = () => {
    switch(selectedGame) {
      case 'Rock Paper Scissors':
        return <RockPaperScissorsGame onBack={() => setSelectedGame(null)} />;
      case 'Memory Cards':
        return <MemoryCardGame onBack={() => setSelectedGame(null)} />;
      case 'Tic Tac Toe':
        return <TicTacToeGame onBack={() => setSelectedGame(null)} />;
      default:
        return <GameSelectionMenu onSelectGame={setSelectedGame} />;
    }
  };

  return renderGame();
}

// Client-side Rendering
function client() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<OdysseyGameArena />);
  }
}

// Server Response (Default Export)
export default async function server(request: Request) {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Game Arena 🎮</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://esm.town/v/std/catch"></script>
        <style>
          body { 
            margin: 0; 
            font-family: Arial, sans-serif; 
            overscroll-behavior: none; 
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="${import.meta.url}"></script>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Trigger client-side rendering
if (typeof document !== "undefined") { 
  client(); 
}
