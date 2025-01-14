"use client"
import { useEffect, useState } from "react";

function Header() {
    const [date, setDate] = useState<Date | null>(null);
    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Date());
        }, 1000)
        return () => clearInterval(interval)
    }, []);
  return (
    <>
    <div className="pt-5 px-5">
        <div className="flex flex-col md:justify-between gap-3 md:gap-0">
        <h1 className="text-2xl font-semibold font-mono">Easy Task Manager</h1>
        <p className="font-semibold text-lg ">{date ? date.toLocaleString() : "Loading..."}</p>
        </div>
    </div>
    </>
  )
}

export default Header