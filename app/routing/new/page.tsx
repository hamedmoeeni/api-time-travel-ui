'use client';

import {Button, Form} from "antd";
import {redirect} from "next/navigation";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {RoutingDto} from "@/src/lib/RoutingRestApi";
import {RoutingView} from "@/app/routing/_form/RoutingView";
import {RoutingViewModel} from "@/app/routing/_form/RoutingViewModel";
import {RoutingMapper} from "@/app/routing/_form/RoutingMapper";
import {useContext} from "react";
import {LayoutPropsContext} from "@/app/context";


export default function NewRouting() {
    const {notificationService,routingRestApi} = useContext(LayoutPropsContext);

    function handleSave(value: RoutingViewModel) {
        const routing: RoutingDto = RoutingMapper.mapToDto(value);
        routingRestApi.saveRoutes([routing], notificationService)
            .then(() => {
                redirect("/routing/browse");
            }).catch(error => {
            if (isRedirectError(error)) { // Redirect error handle here
                throw error // You have to throw the redirect error
            }
        });
    }

    return (
        <>
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 600}}
                initialValues={{remember: true}}
                onFinish={(value) => handleSave(value)}
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