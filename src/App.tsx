import { useState } from 'react'
import './App.css'
import { IlluminatedLetter } from './illuminated'
import { Doodles } from './doodles';
import { Doodles as Doodles2 } from './components/doodles-2';
import { DoodleMorphs } from './components/doodleMorph';

type DoodleFunction = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => void;

// TODO: Implement "next" button that looks like a page turn in the upper-right corner

const dummyText = `Sed maximum est in amicitia parem esse inferiori. Saepe enim excellentiae quaedam sunt, qualis erat Scipionis in nostro, ut ita dicam, grege. Numquam se ille Philo, numquam Rupilio, numquam Mummio anteposuit, numquam inferioris ordinis amicis, Q. vero Maximum fratrem, egregium virum omnino, sibi nequaquam parem, quod is anteibat aetate, tamquam superiorem colebat suosque omnes per se posse esse ampliores volebat.

Et prima post Osdroenam quam, ut dictum est, ab hac descriptione discrevimus, Commagena, nunc Euphratensis, clementer adsurgit, Hierapoli, vetere Nino et Samosata civitatibus amplis inlustris.

Atque, ut Tullius ait, ut etiam ferae fame monitae plerumque ad eum locum ubi aliquando pastae sunt revertuntur, ita homines instar turbinis degressi montibus impeditis et arduis loca petivere mari confinia, per quae viis latebrosis sese convallibusque occultantes cum appeterent noctes luna etiam tum cornuta ideoque nondum solido splendore fulgente nauticos observabant quos cum in somnum sentirent effusos per ancoralia, quadrupedo gradu repentes seseque suspensis passibus iniectantes in scaphas eisdem sensim nihil opinantibus adsistebant et incendente aviditate saevitiam ne cedentium quidem ulli parcendo obtruncatis omnibus merces opimas velut viles nullis repugnantibus avertebant. haecque non diu sunt perpetrata.
Sed maximum est in amicitia parem esse inferiori. Saepe enim excellentiae quaedam sunt, qualis erat Scipionis in nostro, ut ita dicam, grege. Numquam se ille Philo, numquam Rupilio, numquam Mummio anteposuit, numquam inferioris ordinis amicis, Q. vero Maximum fratrem, egregium virum omnino, sibi nequaquam parem, quod is anteibat aetate, tamquam superiorem colebat suosque omnes per se posse esse ampliores volebat.

Et prima post Osdroenam quam, ut dictum est, ab hac descriptione discrevimus, Commagena, nunc Euphratensis, clementer adsurgit, Hierapoli, vetere Nino et Samosata civitatibus amplis inlustris.

Atque, ut Tullius ait, ut etiam ferae fame monitae plerumque ad eum locum ubi aliquando pastae sunt revertuntur, ita homines instar turbinis degressi montibus impeditis et arduis loca petivere mari confinia, per quae viis latebrosis sese convallibusque occultantes cum appeterent noctes luna etiam tum cornuta ideoque nondum solido splendore fulgente nauticos observabant quos cum in somnum sentirent effusos per ancoralia, quadrupedo gradu repentes seseque suspensis passibus iniectantes in scaphas eisdem sensim nihil opinantibus adsistebant et incendente aviditate saevitiam ne cedentium quidem ulli parcendo obtruncatis omnibus merces opimas velut viles nullis repugnantibus avertebant. haecque non diu sunt perpetrata.

Sed maximum est in amicitia parem esse inferiori. Saepe enim excellentiae quaedam sunt, qualis erat Scipionis in nostro, ut ita dicam, grege. Numquam se ille Philo, numquam Rupilio, numquam Mummio anteposuit, numquam inferioris ordinis amicis, Q. vero Maximum fratrem, egregium virum omnino, sibi nequaquam parem, quod is anteibat aetate, tamquam superiorem colebat suosque omnes per se posse esse ampliores volebat.

Et prima post Osdroenam quam, ut dictum est, ab hac descriptione discrevimus, Commagena, nunc Euphratensis, clementer adsurgit, Hierapoli, vetere Nino et Samosata civitatibus amplis inlustris.

Atque, ut Tullius ait, ut etiam ferae fame monitae plerumque ad eum locum ubi aliquando pastae sunt revertuntur, ita homines instar turbinis degressi montibus impeditis et arduis loca petivere mari confinia, per quae viis latebrosis sese convallibusque occultantes cum appeterent noctes luna etiam tum cornuta ideoque nondum solido splendore fulgente nauticos observabant quos cum in somnum sentirent effusos per ancoralia, quadrupedo gradu repentes seseque suspensis passibus iniectantes in scaphas eisdem sensim nihil opinantibus adsistebant et incendente aviditate saevitiam ne cedentium quidem ulli parcendo obtruncatis omnibus merces opimas velut viles nullis repugnantibus avertebant. haecque non diu sunt perpetrata.
`

;

const starShape = [
  { x: 0, y: -20 },
  { x: 5, y: -5 },
  { x: 20, y: 0 },
  { x: 5, y: 5 },
  { x: 0, y: 20 },
  { x: -5, y: 5 },
  { x: -20, y: 0 },
  { x: -5, y: -5 },
];

const flowerShape = [
  { x: 0, y: -15 },
  { x: 10, y: -10 },
  { x: 15, y: 0 },
  { x: 10, y: 10 },
  { x: 0, y: 15 },
  { x: -10, y: 10 },
  { x: -15, y: 0 },
  { x: -10, y: -10 },
];

const squiggleShape = Array.from({ length: 16 }).map(() => {
    const x = Math.random() * 100 /5;
    const y = Math.random() * 100/5;
    const size = Math.random() * 20 + 10;
    return {
    x,
    y,
    size,
    }
});

const whatShape = [
  { x: 0, y: -20 },
  { x: 5, y: -50 },
  { x: 200, y: 0 },
  { x: 50, y: 50 },
  { x: 0, y: 10 },
  { x: -45, y: 15 },
  { x: -20, y: 0 },
  { x: -5, y: -5 },
  { x: 0, y: -20 },
  { x: 5, y: -5 },
  { x: 10, y: 4 },
  { x: -25, y: 5 },
  { x: 12, y: 20 },
  { x: -5, y: 5 },
  { x: -50, y: 10 },
  { x: 0, y: -20 },
];


const spikeShape = Array.from({ length: 16 }).map((i: number) => {
  const x = Math.random() * 100 /5;
  const y = Math.random() * 100/5;
  const size = Math.random() * 20 + 10;
  const angle = (i * Math.PI) / 3;
  const petalX = x + Math.cos(angle) * size;
  const petalY = y + Math.sin(angle) * size;
  return {
  x: petalX,
  y: petalY,
  size,
  }
});



// Example doodle functions
const flowerDoodle: DoodleFunction = (ctx, x, y, size) => {
  ctx.strokeStyle = 'pink';
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const petalX = x + Math.cos(angle) * size;
    const petalY = y + Math.sin(angle) * size;
    ctx.moveTo(x, y);
    ctx.lineTo(petalX, petalY);
  }
  ctx.stroke();
};

const starDoodle: DoodleFunction = (ctx, x, y, size) => {
  ctx.strokeStyle = 'gold';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    ctx.lineTo(
      x + Math.cos(angle) * size,
      y + Math.sin(angle) * size
    );
  }
  ctx.closePath();
  ctx.stroke();
};


function App() {
  

  return (
    <> 
    <DoodleMorphs doodles={[starShape, flowerShape, squiggleShape, spikeShape]} />
      <main>
        <article>
          <IlluminatedLetter text={dummyText} />
        </article>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
      </main>
     
    </>
  )
}

export default App
