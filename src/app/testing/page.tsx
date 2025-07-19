"use client";

import AaronTest from "./aaron";
import GianpierTest from "./gianpier";

export function TestingPage() {
  return <div className="w-full flex flex-row max-w-xs">
    <AaronTest />
    <GianpierTest />
  </div>;
}
