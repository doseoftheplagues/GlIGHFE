import { useEffect, useState } from 'react'

function Onboarding() {
  const glyphArray: string[] = [
    'Glyph-ee',
    'Gee Life',
    'Glig-hefe',
    'Glyphee-ee',
    'Gli-ephee',
    'Gly-phae'
  ]
  const [ Glyph, setGlyph ] = useState(glyphArray)
  // const Glyph: string = 'Glyph-ee' // make setState to change through different pronounciations!!!

  useEffect(() => {
    // Lock scrolling when component mounts
    document.body.style.overflow = 'hidden'
    // Unlock scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="font-body relative flex h-screen min-h-screen flex-col items-center overflow-hidden bg-gradient-to-b from-green-200 to-green-500 p-4 text-center">
      <h1 className="mb-5 text-xl font-bold underline">What is GlIFGHE</h1>
      <p className="rounded-xl border-2 border-black">
        GlIFGHE (pronounced {`${Glyph}`}) is a social media platform that communicates
        through pure visual signal: icons, symbols, and images designed for
        universal interpretation—no language required.
      </p>
      <br />
      <p className="rounded-xl border-2 border-black">
        Within this system, text does not exist. No words, No captions, No
        written markers of any kind.
      </p>
      <br />
      <p className="rounded-xl border-2 border-black">
        GlIFGHE leverages visual communication to drive authentic user
        engagement. Zero text, zero barriers. See with eyes. Think with heart.
        Your journey begins.
      </p>
      <br />
      <p className="rounded-xl border-2 border-black font-bold">
        THAR BE NO WORDS NOR TEXT BEYOND THIS POINT, ON ME HONOR!
      </p>
      <br />
      <button
        onClick={() => {
          window.location.href = '/feed'
        }}
        className="hover:bg-success-strong focus:ring-success-medium shadow-xs ml-7 box-border rounded-xl border-2 border-black bg-lime-400 p-0.5 px-4 py-2.5 text-sm font-medium leading-5 focus:outline-none focus:ring-4"
      >
        I AGREE I WILL USE NO TEXT
      </button>
      <footer className="right-0 p-4 absolute bottom-0 left-0 text-white"></footer>
    </div>
  )
}
export default Onboarding