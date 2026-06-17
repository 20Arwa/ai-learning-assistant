import Link from 'next/link'
import { Button } from './ui/button'
import { LucideIcon } from "lucide-react";

type propsType = {
    title: string,
    description: string,
    icon?: LucideIcon,
    buttonText?: string,
    link?: string,
    className?: string;
}
const EmptyContent = (props : propsType) => {
    return (
        <div className={`flex flex-col gap-1 justify-center items-center mt-36 text-center ${props.className ?? ""}`}>
            
            {props.icon && <props.icon className="main-button-light p-2 rounded-lg shadow-md shadow-primary/ mb-3" size={40}></props.icon>}
            <h3 className="text-xl font-bold">{props.title}</h3>
            <p className="text-secondary-foreground">{props.description}</p>

            {props.link &&
                <Link href={props.link} className="mt-3">
                    <Button>{props.buttonText}</Button>
                </Link>
            }
        </div>
    )
}

export default EmptyContent