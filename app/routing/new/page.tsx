'use client';

import {Button, Form, Input, InputNumber, notification, Select} from "antd";
import {Routing, saveRoutes} from "@/src/lib/routingApi";
import {redirect} from "next/navigation";
import {NotificationInstance} from "antd/es/notification/interface";
import {isRedirectError} from "next/dist/client/components/redirect-error";

function handleSave(value: any, notificationApi: NotificationInstance) {
    const routing: Routing = {
        ...value,
        sourceHost: value.sourceHost?.join(","),
        sourcePath: value.sourcePath?.join(","),
        method: value.method?.join(","),
    }
    saveRoutes([routing], notificationApi)
        .then(() => {
            redirect("/routing/browse");
        }).catch(error => {
        if (isRedirectError(error)) { // Redirect error handle here
            throw error // You have to throw the redirect error
        }
    });
}

export default function NewRouting() {
    const [notificationApi, contextHolder] = notification.useNotification();

    return (
        <>
            {contextHolder}
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 600}}
                initialValues={{remember: true}}
                onFinish={(value) => handleSave(value, notificationApi)}
                autoComplete="off"
            >
                <Form.Item<Routing>
                    label="Priority"
                    name="priority"
                    rules={[{required: true, message: 'Please input priority'}]}>
                    <InputNumber mode="spinner" min="1"/>
                </Form.Item>

                <Form.Item<Routing>
                    label="Source host"
                    name="sourceHost">
                    <Select placeholder="example.com, ..."
                            mode="tags"
                            tokenSeparators={[","]}
                            maxTagCount="responsive"
                            notFoundContent={null}
                    />
                </Form.Item>

                <Form.Item<Routing>
                    label="Source path"
                    name="sourcePath"
                    rules={[{required: true, message: 'Please input source path'}]}>
                    <Select placeholder="/mypah..."
                            mode="tags"
                            tokenSeparators={[","]}
                            maxTagCount="responsive"
                            notFoundContent={null}/>
                </Form.Item>

                <Form.Item<Routing>
                    label="Http method"
                    name="method">
                    <Select
                        allowClear
                        mode="multiple"
                        placeholder="Select a http method"
                        options={[
                            {label: 'GET', value: 'GET'},
                            {label: 'POST', value: 'POST'},
                            {label: 'PATCH', value: 'PATCH'},
                        ]}
                    />
                </Form.Item>

                <Form.Item<Routing>
                    label="Destination host"
                    name="destinationHostUri"
                    rules={[{required: true, message: 'Please input destination host'}]}>
                    <Input placeholder="example.com, ..."/>
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>

        </>
    )
}