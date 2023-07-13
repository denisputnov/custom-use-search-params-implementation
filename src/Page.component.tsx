import {FC, useEffect, useState} from 'react';
import {useSearchParam} from "./useSearchParam.hook.ts";

export enum Domain {
  Ip = "ip",
  Optical = "optical",
  Physical = "physical",
  Nfv = "nfv",
  Xpon = "xpon",
}

export enum PlanningMode {
  AsIs = "as-is",
  ToBe = "to-be",
}

enum Query {
  Domain = 'domain',
  PlanningMode = 'mode'
}

export const Page: FC = () => {
  const [domain, setDomain] = useSearchParam<Domain>(Query.Domain);
  const [mode, setMode] = useSearchParam<PlanningMode>(Query.PlanningMode)

  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log(`domain is updated = ${domain}`)
  }, [domain])

  useEffect(() => {
    console.log(`mode is updated = ${mode}`)
  }, [mode])

  return <div>
    <button onClick={() => setCount(prev => prev - 1)}>-</button>
    {count}
    <button onClick={() => setCount(prev => prev + 1)}>+</button>
    <div>
      {domain}
      <button onClick={() => setDomain(Domain.Xpon)}>XPON</button>
      <button onClick={() => setDomain(Domain.Physical)}>PHYSICAL</button>
      <button onClick={() => setDomain(Domain.Ip)}>IP</button>
      <button onClick={() => setDomain(null)}>CLEAR</button>
    </div>
    <div>
      {mode}
      <button onClick={() => setMode(PlanningMode.AsIs)}>AS-IS</button>
      <button onClick={() => setMode(PlanningMode.ToBe)}>TO-BE</button>
      <button onClick={() => setMode(null)}>CLEAR</button>
    </div>
  </div>;
};

