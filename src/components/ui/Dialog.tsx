"use client";

import * as React from "react";
import { X } from "lucide-react";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative z-50 w-full max-w-lg p-4">
                {children}
            </div>
            <div
                className="absolute inset-0 z-40"
                onClick={() => onOpenChange(false)}
            />
        </div>
    );
}

export function DialogContent({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950 ${className}`}
        >
            {children}
        </div>
    );
}

export function DialogHeader({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
            {children}
        </div>
    );
}

export function DialogTitle({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
            {children}
        </h3>
    );
}

export function DialogFooter({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 ${className}`}>
            {children}
        </div>
    );
}
