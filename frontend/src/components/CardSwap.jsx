import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef
} from "react";
import gsap from "gsap";
import "./CardSwap.css";

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`card ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
  />
));
Card.displayName = "Card";

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX - ((total - 1) * distX) / 2, // center horizontally
  y: -i * distY,
  z: -i * 10, // smaller z-offset
  zIndex: total - i
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = ({
  width = 800,
  height = 450,
  cardDistance = 50,
  verticalDistance = 20,
  delay = 800, // faster swap
  pauseOnHover = true,
  skewAmount = 6,
  easing = "power1.inOut",
  children
}) => {
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr.length]);
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) =>
      placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
    );

    const swap = () => {
      if (order.current.length < 2) return;
      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      // move front card down
      tl.to(elFront, {
        y: "+=100",
        duration: 0.3,
        ease: easing
      });

      // move other cards forward
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex });
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: 0.4, ease: easing }, 0);
      });

      // return front card to back
      const backSlot = makeSlot(rest.length, cardDistance, verticalDistance, refs.length);
      tl.set(elFront, { zIndex: backSlot.zIndex });
      tl.to(elFront, { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: 0.4, ease: easing }, 0);

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = setInterval(swap, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
      };
    }

    return () => clearInterval(intervalRef.current);
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width: 220, height: 350, ...(child.props.style ?? {}) } // smaller size for overlap
        })
      : child
  );

  return (
    <div
      ref={container}
      className="card-swap-container relative flex justify-center items-center"
      style={{ width: "100%", height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
