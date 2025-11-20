"use client";

import * as React from "react";

interface SliderProps {
    value: number[];
    min: number;
    max: number;
    step: number;
    onValueChange: (value: number[]) => void;
    className?: string;
}

export function Slider({
    value,
    min,
    max,
    step,
    onValueChange,
    className = "",
}: SliderProps) {
    return (
        <div className={`relative flex w-full touch-none select-none items-center ${className}`}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[0]}
                onChange={(e) => onValueChange([parseFloat(e.target.value)])}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600 dark:bg-slate-800"
            />
        </div>
    );
}
