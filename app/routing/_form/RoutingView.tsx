import {FormField} from "@/src/lib/infrastructure/form/FormField";
import {AntdFormField} from "@/src/lib/infrastructure/antdimpls/AntdFormField";

export class RoutingView {
    static formFields: FormField[] = [
        new AntdFormField("Priority", "priority", "number",
            {placeholder: "1, 2, ...", min: 1, style: {"width":"10rem"}},
            [{required: true, message: 'Please input priority'}]
        ),
        new AntdFormField('Source host', "sourceHost", 'tags',
            {
                placeholder: "*.example.com, ...",
                tokenSeparators: [","],
                maxTagCount: "responsive",
                notFoundContent: null
            }, []),
        new AntdFormField('Paths', "sourcePath", 'tags',
            {
                placeholder: "/myPath, ...",
                tokenSeparators: [","],
                maxTagCount: "responsive",
                notFoundContent: null
            },
            [{required: true, message: 'Please input paths'}]),
        new AntdFormField('Http method', "method", 'select',
            {
                placeholder: "Select a http method",
                options: [
                    {label: 'GET', value: 'GET'},
                    {label: 'POST', value: 'POST'},
                    {label: 'PATCH', value: 'PATCH'},
                ]
            }, []),
        new AntdFormField('Destination host', "destinationHostUri", 'text',
            {
                placeholder: "http://myhost..."
            },
            [{required: true, message: 'Please input destination host'}])
    ]
}