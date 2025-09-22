import { useState } from 'react'
import { clsx } from 'clsx'
import { languages } from '../data/language'
import { getFarewellText, getRandomWord } from '../data/utils'
import ReactConfetti from 'react-confetti'
import './App.css'

export default function App() {
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessLetters, setGuessLetters] = useState([])

    const wrongGuessCount = guessLetters.filter(letter => !currentWord.includes(letter)).length
    const isGameWon  = currentWord.split("").every(letter => guessLetters.includes(letter))
    
    const isGameLost = wrongGuessCount >= languages.length - 1

    const isGameOver = isGameWon || isGameLost

    const lastGuessLetter = guessLetters[guessLetters.length - 1]

    const isLastGuessIncorrect = lastGuessLetter && !currentWord.includes(lastGuessLetter)
    
    const alphabets = "qwertyuiopasdfghjklzxcvbnm"

    function addGuessLetter(letter) {
      setGuessLetters(prevLetters => 
        prevLetters.includes(letter) ?
        prevLetters :
        [...prevLetters, letter]
      )
    }

    function startNewGame() {
      setCurrentWord(getRandomWord())
      setGuessLetters([])
    }

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        return (
            <span
              className={clsx(
                  'relative inline-block rounded p-2',
                  { 'lost': isLanguageLost }
              )}
              style={styles}
              key={lang.name}
            >
              {lang.name}
              {isLanguageLost && (
                  <span className="absolute inset-0 flex items-center justify-center text-sm bg-black/70">
                      💀
                  </span>
              )}
            </span>
        )
    })

    const letterElements = currentWord.split("").map((letter, index) => {
      const shouldRevealLetter = isGameLost || guessLetters.includes(letter)
      const letterClassName = clsx (
        isGameLost && !guessLetters.includes(letter) && "text-red-600"
      )
      return(
      <span 
      className={`h-[40px] w-[40px] bg-[#323232] flex items-center justify-center text-xl border-b-3 border-gray-400 ${letterClassName}`}
      key={index}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
      )
    })

    const keyboardElements = alphabets.split("").map((letter, index) => {
      const isGuessed = guessLetters.includes(letter)
      const isCorrect = isGuessed && currentWord.includes(letter)
      const isWrong = isGuessed && !currentWord.includes(letter)
      const className = clsx(
        'sm:py-3 sm:px-5 px-4 py-2 rounded-xl text-lg sm:text-xl font-bold cursor-pointer',
        {
          'bg-yellow-300': !isGuessed, // Yellow for unguessed letters
          'bg-green-500 text-white': isCorrect, // Green for correct letters
          'bg-red-500 text-white': isWrong // Red for incorrect letters
        }
      );
        
      return(
        <button 
        key={index}
        className={`${className}  disabled:cursor-default disabled:opacity-20 `}
        disabled = {isGameOver}
        aria-disabled = {guessLetters.includes(letter)}
        onClick={() => addGuessLetter(letter)}>
          {letter.toUpperCase()}
        </button>
      )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus(){
      if (!isGameOver && isLastGuessIncorrect){
        return(
          <p className='text-[#F9F4DA] text-center text-xl bg-purple-800 rounded w-100 py-4 font-bold'>
            {getFarewellText(languages[wrongGuessCount - 1].name)}
          </p>
        )
      }

      if (isGameWon){
        return(
          <p className='text-[#F9F4DA] text-center text-xl bg-green-700 rounded w-100 py-1 font-bold'>You win!  <br />
          <span className='text-[16px] font-semibold'>Well done!</span>
          </p>
        )
      }
      if(isGameLost){
        return(
          <p className='text-[#F9F4DA] text-center text-xl bg-red-500 rounded w-100 py-1 font-bold'>You lost ! 💀  <br />
          <span className='text-[16px] font-semibold'>You lose! Better start learning Assembly !</span>
          </p>
        )
      }

      return null
    }

    return(
      <main className='flex flex-col items-center justify-center px-2'>
        {
          isGameWon && 
            <ReactConfetti recycle = {false} numberOfPieces={1000} />
        }
        <header className='flex flex-col justify-center items-center mt-8 '>
          <div className='flex flex-row gap-2 items-center mb-4'>
            <img src="https://cdn3.iconfinder.com/data/icons/brain-games/1042/Hangman-Game.png" alt="logo" className='size-9' />
            <h1 className='text-4xl font-bold text-[#F9F4DA]'>Hang<span className='text-[#27AAE1]'>man</span></h1>
          </div>
          <p className='text-md text-gray-400 text-center'>Guess the word in under 8 attemps to keep the <br /> programming world safe from Assembly!</p>
        </header>
        
        <section className={`flex items-center justify-center w-full h-[120px] sm:h-[150px] ${gameStatusClass}`}>
          {renderGameStatus()}
        </section>
        
        <section className="flex flex-wrap gap-1 justify-center items-center max-w-[450px]">
          {languageElements}
        </section>
        
        <section className='flex justify-center sm:mt-10 mt-8 text-white gap-1 '>
          {letterElements}
        </section>
        
        <section className='flex flex-wrap text-black justify-center gap-2 text-2xl sm:mt-10 mt-8 w-full sm:max-w-[570px]'>
          {keyboardElements}
        </section>
        
        {isGameOver && <button 
        onClick={startNewGame}
        className='bg-green-700 px-6 py-3 rounded w-50 mt-8 font-bold cursor-pointer text-[#F9F4DA]'>New game</button>}
      </main>
    )
}

