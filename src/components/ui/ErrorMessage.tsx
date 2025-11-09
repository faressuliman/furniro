import { Info } from "lucide-react";

interface IProps {
  msg?: string;
}

const ErrorMessage = ({ msg }: IProps) => {
  return msg ? (
    <>
      <div className="flex justify-items-center items-center space-x-1">
        <Info className="text-red-700 w-3 h-3"/>
        <span className="block text-red-700 font-semibold text-xs tracking-wide"> {msg}</span>
      </div>
    </>
  ) : null;
};

export default ErrorMessage;