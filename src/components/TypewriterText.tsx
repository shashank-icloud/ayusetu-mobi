import React, { useEffect, useMemo, useState } from 'react';
import { Text, TextStyle } from 'react-native';

interface Props {
    text: string;
    speedMs?: number; // per character
    style?: TextStyle;
    showCursor?: boolean;
    onDone?: () => void;
}

export default function TypewriterText({ text, speedMs = 80, style, showCursor = true, onDone }: Props) {
    const [index, setIndex] = useState(0);
    const [cursorOn, setCursorOn] = useState(true);

    useEffect(() => {
        setIndex(0);
    }, [text]);

    useEffect(() => {
        if (index >= text.length) {
            onDone && onDone();
            return;
        }
        const id = setTimeout(() => setIndex(i => i + 1), speedMs);
        return () => clearTimeout(id);
    }, [index, text, speedMs, onDone]);

    useEffect(() => {
        if (!showCursor) return;
        const id = setInterval(() => setCursorOn(v => !v), 500);
        return () => clearInterval(id);
    }, [showCursor]);

    const visible = useMemo(() => text.slice(0, index), [text, index]);

    return (
        <Text style={style}>
            {visible}
            {showCursor && (index < text.length ? '\u258F' : cursorOn ? '\u258F' : ' ')}
        </Text>
    );
}
