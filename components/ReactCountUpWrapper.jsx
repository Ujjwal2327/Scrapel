"use client";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

export function ReactCountUpWrapper({ value, duration = 0.5 }) {
  value = parseFloat(value);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isNaN(value)) return "0";

  return <CountUp duration={duration} preserveValue end={value} decimal={0} />;
}
