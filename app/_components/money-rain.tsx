import type { CSSProperties } from "react";

type Coin = {
  x: string;
  y: string;
  size: string;
  delay: number;
  duration: number;
  drift: string;
  rotate: string;
  depth: "back" | "front";
};

const coins: Coin[] = [
  { x: "8%", y: "72%", size: "44px", delay: 0, duration: 12, drift: "12px", rotate: "18deg", depth: "back" },
  { x: "22%", y: "34%", size: "38px", delay: 1.4, duration: 13, drift: "-14px", rotate: "-14deg", depth: "back" },
  { x: "38%", y: "68%", size: "50px", delay: 2.1, duration: 11.6, drift: "16px", rotate: "22deg", depth: "back" },
  { x: "58%", y: "30%", size: "42px", delay: 1.1, duration: 13.5, drift: "-10px", rotate: "-20deg", depth: "back" },
  { x: "74%", y: "64%", size: "48px", delay: 2.8, duration: 12.6, drift: "13px", rotate: "14deg", depth: "back" },
  { x: "88%", y: "38%", size: "36px", delay: 0.8, duration: 12.9, drift: "-12px", rotate: "-16deg", depth: "back" },
  { x: "14%", y: "52%", size: "62px", delay: 0.4, duration: 10.8, drift: "18px", rotate: "19deg", depth: "front" },
  { x: "34%", y: "24%", size: "56px", delay: 1.9, duration: 11.2, drift: "-15px", rotate: "-18deg", depth: "front" },
  { x: "52%", y: "76%", size: "68px", delay: 2.4, duration: 10.5, drift: "20px", rotate: "24deg", depth: "front" },
  { x: "70%", y: "46%", size: "60px", delay: 1.3, duration: 11.7, drift: "-17px", rotate: "-22deg", depth: "front" },
  { x: "86%", y: "70%", size: "54px", delay: 3.2, duration: 12.2, drift: "14px", rotate: "17deg", depth: "front" },
];

export function MoneyRain() {
  return (
    <div className="money-rain" aria-hidden="true">
      {coins.map((coin, index) => (
        <div
          className={`coin coin--${coin.depth}`}
          key={`${coin.depth}-${index}`}
          style={
            {
              "--x": coin.x,
              "--y": coin.y,
              "--size": coin.size,
              "--delay": `${coin.delay}s`,
              "--dur": `${coin.duration}s`,
              "--drift": coin.drift,
              "--spin": coin.rotate,
            } as CSSProperties
          }
        >
          <div className="coin__face">$</div>
          <div className="coin__edge" />
        </div>
      ))}
    </div>
  );
}
