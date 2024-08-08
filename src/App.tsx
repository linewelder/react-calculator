import { useEffect, useState } from 'react';
import './App.css';
import '@fontsource-variable/rubik';

const buttons = [
    'C', '←', '⚠', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '=',
];

const operatorMap: { [key: string]: string } = {
    '×': '*',
    '÷': '/',
};

const keyboardMap: { [key: string]: string } = {
    'Enter': '=',
    '*': '×',
    '/': '÷',
    'Backspace': '←',
    'Delete': 'C',
};

const roundTo = 10000000;

const calculateAnswer = (text: string): string => {
    try {
        let expression = '';
        for (const char of text) {
            expression += operatorMap[char] ?? char;
        }
        
        let answer = eval(expression);
        if (typeof answer === 'number') {
            answer = Math.round(answer * roundTo) / roundTo;
        }

        return '' + (answer ?? '');
    } catch (exception) {
        return 'Error!';
    }
};

export default function App() {
    const [text, setText] = useState("");

    const getActionForButton = (button: string) => {
        if (button === 'C') {
            return () => setText('');
        } else if (button === '=') {
            return () => setText(calculateAnswer);
        } else if (button === '←') {
            return () => setText(text => text.substring(0, text.length - 1));
        } else if (button === ' ') {
            return () => {};
        } else if (button === '⚠') {
            return () => setText('alert(1)');
        } else {
            return () => setText(text => text + button);
        }
    };

    const onKeyDown = (e: KeyboardEvent) => {
        const button = keyboardMap[e.key] ?? e.key;
        if (buttons.includes(button)) {
            getActionForButton(button)();
            e.stopPropagation();
            e.preventDefault();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <>
            <div className="calculator">    
                <input className="output-display" disabled value={text} placeholder="0"/>
                <div className="buttons">
                    {buttons.map(value =>
                        <button onClick={getActionForButton(value)} key={value} data-value={value}>
                            {value}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
