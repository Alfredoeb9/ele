export default function GameTabs({ id, label, isActive, setActive, setValue }: any) {
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