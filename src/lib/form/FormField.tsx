import {ReactElement} from "react";

export interface FormField {

    label: string;
    name: string;
    inputType: 'number' | 'text' | 'select' | 'tags';
    props: object;
    rules: object[];

    renderForm(): [formItemProps: object, inputElement: ReactElement]

    renderReadOnly(value: unknown): ReactElement
}
