import {ReactElement} from "react";
import {Flex, Input, InputNumber, Select, Tag} from "antd";
import {FormField} from "@/src/lib/form/FormField";

export class AntdFormField {
    static EMPTY: FormField = new AntdFormField('', '', 'text', {}, []);

    label: string;
    name: string;
    inputType: 'number' | 'text' | 'select' | 'tags';
    props: object;
    rules: object[];


    constructor(label: string, name: string, inputType: "number" | "text" | "select" | "tags", props: object, rules: object[]) {
        this.label = label;
        this.name = name;
        this.inputType = inputType;
        this.props = props;
        this.rules = rules;
    }

    renderForm(): [formItemProps: object, inputElement: ReactElement] {
        let input;
        if (this.inputType === "number") {
            input = <InputNumber mode="spinner" {...this.props}/>;
        } else if (this.inputType === "select") {
            input = <Select mode="multiple" {...this.props}/>;
        } else if (this.inputType === "tags") {
            input = <Select mode="tags" maxTagCount="responsive" {...this.props}/>;
        } else {
            input = <Input {...this.props}/>;
        }

        return [{label: this.label, name: this.name, rules: this.rules}, input];
    }

    renderReadOnly(value: unknown): ReactElement {
        if (this.inputType === "select" || this.inputType === "tags") {
            if (value instanceof Array) {
                return <Flex gap="small" align="center" wrap>
                    {value.map((value, index) => <Tag key={index}>{value}</Tag>)}
                </Flex>;
            }
        }
        return <>{value}</>;
    }
}