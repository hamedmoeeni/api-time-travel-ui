'use client';

import {Button, Form, notification} from "antd";
import {redirect} from "next/navigation";
import {NotificationInstance} from "antd/es/notification/interface";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {RoutingDto, saveRoutes} from "@/src/lib/routingApi";
import {RoutingView} from "@/app/routing/_form/RoutingView";
import {RoutingViewModel} from "@/app/routing/_form/RoutingViewModel";
import {RoutingMapper} from "@/app/routing/_form/RoutingMapper";

function handleSave(value: RoutingViewModel, notificationApi: NotificationInstance) {
    const routing: RoutingDto = RoutingMapper.mapToDto(value);
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
                {RoutingView.formFields.map(value => {
                    const [formItemProps, inputElement] = value.renderForm();
                    return <Form.Item<RoutingViewModel>
                        key={"key-" + value.name}
                        {...formItemProps}>
                        {inputElement}
                    </Form.Item>;
                })}

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>

        </>
    )
}