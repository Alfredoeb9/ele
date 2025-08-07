import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, type Dispatch, type SetStateAction } from "react";

interface GameTabTypes {
  id: string;
  label: string;
  isActive: boolean;
  setActive: Dispatch<SetStateAction<string>>;
  setValue: Dispatch<SetStateAction<string>>;
}

export default function GameTabs({
  id,
  label,
  isActive,
  setActive,
  setValue,
}: GameTabTypes) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabClick = () => {
    setActive(id);
    setValue(label);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab === id) {
      setActive(id);
      setValue(label);
    }
  }, [searchParams, id, label, setActive, setValue]);
  
  return (
    <li
      key={id}
      className={`p-5 font-bold transition-all hover:text-white ${isActive ? "bg-red-500" : ""}`}
    >
      <button
        type="button"
        onClick={handleTabClick}
      >
        {label}
      </button>
    </li>
  );
}
