import { cn } from "@/components/utils";
import { forwardRef, useState } from "react";
import { RxChevronDown, RxChevronUp } from "react-icons/rx";
import { useInterval, useDebounce, useLockBodyScroll } from "react-use";

const Base = forwardRef(({ className, ...props }, ref) => (
  <input
    className={cn(
      `form-input w-full border border-slate-300 outline-none bg-slate-100 focus:ring-blue-400 focus:ring-2 focus:ring-opacity-50 focus:border-blue-400 dark:bg-slate-800 dark:border-slate-900`,
      className,
    )}
    ref={ref}
    {...props}
  />
));

const TextInput = forwardRef((props, ref) => {
  return <Base type="text" ref={ref} {...props} />;
});

const NumberInput = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);
  const [increasing, setIncreasing] = useState(false);
  const [increaseStarted, setIncreaseStarted] = useState(false);
  const [decreasing, setDecreasing] = useState(false);
  const [decreaseStarted, setDecreaseStarted] = useState(false);
  const [lockScroll, setLockScroll] = useState(false);

  const [increasingReady, increasingCancel] = useDebounce(
    () => {
      if (!increaseStarted) return;
      setIncreasing(true);
    },
    300,
    [increaseStarted],
  );

  const [decreasingReady, decreasingCancel] = useDebounce(
    () => {
      if (!decreaseStarted) return;
      setDecreasing(true);
    },
    300,
    [decreaseStarted],
  );

  useInterval(increase, increasing ? 50 : null);
  useInterval(decrease, decreasing ? 50 : null);
  useLockBodyScroll(lockScroll);

  function increase() {
    if (props.max && Number(props.max) <= count) {
      return setCount(Number(props.max));
    }
    setCount(count + 1);
  }

  function decrease() {
    if (props.min && Number(props.min) >= count) {
      return setCount(Number(props.min));
    }
    setCount(count - 1);
  }

  function handleStartDecreasing() {
    setDecreaseStarted(true);
  }

  function handleStopDecreasing() {
    if (decreasingReady() === false) {
      decreasingCancel();
    }
    setDecreaseStarted(false);
    setDecreasing(false);
  }

  function handleStartIncreasing() {
    setIncreaseStarted(true);
  }

  function handleStopIncreasing() {
    if (increasingReady() === false) {
      increasingCancel();
    }
    setIncreaseStarted(false);
    setIncreasing(false);
  }

  function handleInput(e) {
    if (isNaN(e.target.value)) return;
    setCount(Number(e.target.value));
  }

  return (
    <div ref={ref} className="relative">
      <Base
        aria-roledescription="numberfield"
        inputMode="decimal"
        pattern="[0-9]*(.[0-9]+)?"
        aria-valuemin={props.min}
        aria-valuemax={props.max}
        aria-valuenow={count}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        {...props}
        type="text"
        className="pr-12"
        value={count}
        onChange={handleInput}
        onInput={handleInput}
        onKeyDown={(e) => {
          if (e.key === "Up" || e.key === "ArrowUp") {
            increase();
            handleStartIncreasing();
          }
          if (e.key === "Down" || e.key === "ArrowDown") {
            decrease();
            handleStartDecreasing();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === "Up" || e.key === "ArrowUp") {
            handleStopIncreasing();
          }
          if (e.key === "Down" || e.key === "ArrowDown") {
            handleStopDecreasing();
          }
        }}
        onWheel={(e) => {
          const dir = Math.sign(e.deltaY) * -1;
          if (dir === 1) {
            increase();
          } else if (dir === -1) {
            decrease();
          }
        }}
        onMouseEnter={() => setLockScroll(true)}
        onMouseLeave={() => setLockScroll(false)}
      />
      <div className="flex flex-col items-center justify-center z-5 absolute right-0 top-0 h-full p-3">
        <button
          type="button"
          aria-label="increase value"
          className="focus:ring-2"
          onClick={increase}
          onMouseDown={handleStartIncreasing}
          onMouseUp={handleStopIncreasing}
          onTouchStart={handleStartIncreasing}
          onTouchEnd={handleStopIncreasing}
        >
          <RxChevronUp />
        </button>
        <button
          type="button"
          aria-label="decrease value"
          className="focus:ring-2"
          onClick={decrease}
          onMouseDown={handleStartDecreasing}
          onMouseUp={handleStopDecreasing}
          onTouchStart={handleStartDecreasing}
          onTouchEnd={handleStopDecreasing}
        >
          <RxChevronDown />
        </button>
      </div>
    </div>
  );
});

const Input = forwardRef((props, ref) => {
  if (props.type === "number") {
    return <NumberInput ref={ref} {...props} />;
  }
  return <TextInput ref={ref} {...props} />;
});

export default Input;
