"use client";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

export function ReactCountUpWrapper({ value }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "0";
  return <CountUp duration={0.5} preserveValue end={value} decimal={0} />;
}
