import { useEffect, useRef, useState } from "react";
import "./App.css";
import confetti from "canvas-confetti";

const introText = `
[ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ...]

[ЗАГРУЗКА КАНДИДАТОВ...]

████████████████████ 100%

[АНАЛИЗ КОМПЕТЕНТНОСТИ...]

████████████████████ 100%

[АНАЛИЗ ХАРИЗМЫ...]

████████████████████ 100%

[АНАЛИЗ УРОВНЯ SWAGа...]

!ОШИБКА! - ПОДСЧЕТ НЕВОЗМОЖЕН 

[ПОИСК ИДЕАЛЬНОГО АДМИНА...]

КАНДИДАТ НАЙДЕН.

ИМЯ: ДА ВЫ И САМИ ЗНАЕТЕ 

СТАТУС: ЛУЧШИЙ ВАРИАНТ

УРОВЕНЬ КРУТОСТИ: 999/10
`;

export default function App() {

  function beep() {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new AudioContext();
  }

  const ctx = audioCtxRef.current;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = 800;
  gain.gain.setValueAtTime(0.02, ctx.currentTime);

  osc.start();
  osc.stop(ctx.currentTime + 0.03);
}

  const [displayedText, setDisplayedText] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [showVote, setShowVote] = useState(false);
  const [winner, setWinner] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const audioCtxRef = useRef(null);

  const noTexts = [
  "Нет",
  "Ты уверен?",
  "Подумай ещё раз",
  "Очень уверен?",
  "Это плохая идея",
  "Система не рекомендует",
  "Неверный ответ",
  "Ошибка выбора",
  "Попробуй «Да»",
  "Зачем тебе это?",
  "Сопротивление бесполезно", 
  "Все равно будет по моему",
  "..."
];

function celebrate() {
  confetti({
    particleCount: 150,
    angle: 60,
    spread: 70,
    origin: { x: 0 },
  });

  confetti({
    particleCount: 150,
    angle: 120,
    spread: 70,
    origin: { x: 1 },
  });

  setWinner(true);
}

const [noPos, setNoPos] = useState({
    x: window.innerWidth / 2 + 100,
    y: window.innerHeight / 2,
  });

  const audioRef = useRef(null);

useEffect(() => {
  let i = 0;

  function type() {
    if (i >= introText.length) {
      setTimeout(() => {
        setShowVideo(true);
      }, 1500);
      return;
    }

    setDisplayedText(introText.slice(0, i + 1));

    if (/[А-Яа-яA-Za-z0-9]/.test(introText[i])) {
      beep();
      }

    let delay = 50;

    if (introText[i] === ".") delay = 500;
    if (introText[i] === "\n") delay = 300;

    i++;

    setTimeout(type, delay);
  }

  type();
}, []);

  const moveNoButton = () => {
    setAttempts(prev => prev + 1);
    setNoPos({
      x: Math.random() * (window.innerWidth - 150),
      y: Math.random() * (window.innerHeight - 80),
    });
  };

  useEffect(() => {
  if (attempts >= 20) {
    setTimeout(() => {
      setWinner(true);
    }, 1000);
  }
}, [attempts]);


  useEffect(() => {
  if (attempts < 12) return;

  const interval = setInterval(() => {
    moveNoButton();
  }, 700);

  return () => clearInterval(interval);
}, [attempts]);

  const startAudio = () => {
    audioRef.current?.play();
  };

  if (winner) {
    return (

      <div className="winner-screen">
        <h1>🎉 ГОЛОС ЗАСЧИТАН 🎉</h1>

        <h2>Точность выбора 100%</h2>

        <p>
          Система подтверждает:
          <br />
          Вы сделали правильный выбор.
        </p>
        <h3>Проверка IQ успешно пройдена.</h3>
      </div>
    );
  }

  if (showVote) {
    return (
      <div className="vote-screen">
        <h1>Разве не очевидно, что я лучший?</h1>

    <div className={attempts >= 8 ? "vote-screen shake" : "vote-screen"}>      
    </div>

    <div className={attempts >= 10 ? "no-btn panic" : "no-btn"}>
    </div>
    
    {attempts >= 4 && (
        <p className="warning">
          Система фиксирует подозрительное поведение...
        </p>
        )}

        <button
          className="yes-btn"
          onClick={celebrate}
        >
          Да
        </button>

        <button
          className="no-btn"
          style={{
            left: noPos.x,
            top: noPos.y,
          }}
          onMouseEnter={moveNoButton}
        >
          {attempts >= 17
          ? "СОСИТЕ" 
          : noTexts[Math.min(attempts, noTexts.length - 1)]}
        </button>
      </div>
    );
  }


  if (showVideo) {
    return (
      <div className="video-screen">
        <video
          controls
          autoPlay
          onEnded={() => setShowVote(true)}
        >
          <source src="/DaunVIdeo.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div className="intro" onClick={startAudio}>
      <audio ref={audioRef} src="/Queen.mp3" />
      <pre>{displayedText}
        <span className="cursor">█</span>
      </pre>

      <div className="hint">
        Нажми куда-нибудь для запуска озвучки
      </div>
    </div>
  );
}