import {Flex, Input, InputNumber, Select, Tag} from "antd";
import React, {ReactElement} from "react";

export class FormField {
    static EMPTY: FormField = new FormField('', '', 'text', {}, []);

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

export class RoutingView {
    static formFields: FormField[] = [
        new FormField("Priority", "priority", "number",
            {placeholder: "1, 2, ...", min: 1, style: {"width":"10rem"}},
            [{required: true, message: 'Please input priority'}]
        ),
        new FormField('Source host', "sourceHost", 'tags',
            {
                placeholder: "*.example.com, ...",
                tokenSeparators: [","],
                maxTagCount: "responsive",
                notFoundContent: null
            }, []),
        new FormField('Paths', "sourcePath", 'tags',
            {
                placeholder: "/myPath, ...",
                tokenSeparators: [","],
                maxTagCount: "responsive",
                notFoundContent: null
            },
            [{required: true, message: 'Please input paths'}]),
        new FormField('Http method', "method", 'select',
            {
                placeholder: "Select a http method",
                options: [
                    {label: 'GET', value: 'GET'},
                    {label: 'POST', value: 'POST'},
                    {label: 'PATCH', value: 'PATCH'},
                ]
            }, []),
        new FormField('Destination host', "destinationHostUri", 'text',
            {
                placeholder: "http://myhost..."
            },
            [{required: true, message: 'Please input destination host'}])
    ]
}