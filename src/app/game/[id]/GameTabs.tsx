import type { Dispatch, SetStateAction } from "react";

interface GameTabTypes {
    id: string;
    label: string;
    isActive: boolean;
    setActive: Dispatch<SetStateAction<string>>;
    setValue: Dispatch<SetStateAction<string>>;
}

export default function GameTabs({ id, label, isActive, setActive, setValue }: GameTabTypes) {
    return (
        <li key={id} className={`p-5 hover:text-white transition-all ${isActive ? "bg-red-500" : ""}` }>
            <button 
                type="button" 
                onClick={() => {
                    setActive(id)
                    setValue(label)
                }}
            >
                {label}
            </button>
        </li>
    );
};