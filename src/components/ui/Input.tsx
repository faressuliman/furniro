import { forwardRef, type InputHTMLAttributes, type Ref } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

const Input = forwardRef(({ label, ...rest }: IProps, ref: Ref<HTMLInputElement>) => {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-xs font-bold">{label}</label>
            )}
            <input type="text" ref={ref} {...rest} className="border border-gray-300 rounded-md px-3 py-2 mb-1 placeholder:text-sm focus:transition-all focus:duration-400" />
        </div>
    );
});

Input.displayName = "Input";

export default Input;