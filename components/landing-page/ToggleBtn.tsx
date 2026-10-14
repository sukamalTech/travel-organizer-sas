"use client";
import React, { useState } from 'react'

export default function ToggleBtn() {
    const [darkMode, setDarkMode] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedPin, setSelectedPin] = useState(0);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };
    return (
        <div>

        </div>
    )
}
