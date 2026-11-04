'use client';

import {Flex, Form, FormInstance, notification, Popconfirm, Space, Spin, Table, Typography, Button} from "antd";
import {NotificationInstance} from "antd/es/notification/interface";
import {deleteRoutes, saveRoutes, useGetRouteSwr} from "@/src/lib/routingApi";
import {createStyles} from "antd-style";
import React, {useState} from "react";
import {
    CloseOutlined,
    DeleteFilled,
    EditFilled,
    LoadingOutlined,
    SaveOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import {RoutingMapper} from "../_form/RoutingMapper";
import {RoutingViewModel} from "../_form/RoutingViewModel";
import {FormField, RoutingView} from "@/app/routing/_form/RoutingView";
import {ColumnGroupType, ColumnType} from "antd/es/table";


function save(recordId: string, form: FormInstance, setEditingKey: React.Dispatch<React.SetStateAction<string>>, notificationApi: NotificationInstance) {
    form.validateFields()
        .then(record => {
            const dto = RoutingMapper.mapToDto(record as RoutingViewModel);
            return saveRoutes([{...dto, id: recordId}], notificationApi);
        })
        .then(() => setEditingKey(''));
}

const useStyles = createStyles((props) => {
    const {css, prefixCls, cssVar} = props;
    return {
        customTable: css`
            ${prefixCls}-table {
                ${prefixCls}-table-container {
                    ${prefixCls}-table-body,
                    ${prefixCls}-table-content {
                        scrollbar-width: thin;
                        scrollbar-color: #eaeaea transparent;
                    }
                }
            }
        `,
        editableRow: css`
            position: relative;

            .${prefixCls}-form-item-explain {
                position: absolute;
                top: 100%;
                font-size: ${cssVar.fontSizeSM};
            }
        `,
    };
});

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    view: FormField;
    value: unknown;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = (props) => {
    const {editing, view, value, children, ...restProps} = props;
    let element;
    if (editing) {
        const [formItemProps, inputElement] = view.renderForm();
        const tableFormItemProps = {...formItemProps, label: null}
        element = <Form.Item {...tableFormItemProps}>{inputElement}</Form.Item>;
    } else {
        if (view) {
            element = view.renderReadOnly(value);
        } else {
            element = children
        }
    }
    return <td {...restProps}>{element}</td>
};

function getColumns(form: FormInstance,
                    isEditing: (record: RoutingViewModel) => boolean,
                    setEditingKey: React.Dispatch<React.SetStateAction<string>>,
                    notificationApi: NotificationInstance): (ColumnType<RoutingViewModel> | ColumnGroupType<RoutingViewModel>)[] {

    const routingViews = RoutingView.formFields.map(field => {
        return {
            title: field.label,
            dataIndex: field.name,
            editable: true,
            view: field,
        };
    });
    routingViews.push({
        title: 'Operation',
        dataIndex: 'operation',
        editable: false,
        view: FormField.EMPTY
    });

    return routingViews.map(col => {
        if (col.dataIndex === "operation") {
            return {
                ...col,
                fixed: "end",
                render: (_: unknown, record: RoutingViewModel) => {
                    const editable = isEditing(record);
                    return editable ? (
                        <Space size="medium">
                            <Typography.Link onClick={() => save(record.id, form, setEditingKey, notificationApi)}
                                             style={{marginInlineEnd: 8}}>
                                <SaveOutlined/>
                            </Typography.Link>
                            <Typography.Link onClick={() => setEditingKey('')}>
                                <CloseOutlined/>
                            </Typography.Link>
                        </Space>
                    ) : (
                        <Space size="medium">
                            <Popconfirm title="Sure to delete?"
                                        onConfirm={() => handleDelete(record.id, notificationApi)}>
                                <a><DeleteFilled/></a>
                            </Popconfirm>
                            <Typography.Link onClick={() => {
                                form.setFieldsValue(record);
                                setEditingKey(record.id);
                            }}>
                                <EditFilled/>
                            </Typography.Link>
                        </Space>
                    );
                }
            } as unknown as ColumnGroupType<RoutingViewModel>
        } else {
            let modifiedCol = {...col};
            if (col.dataIndex === "priority") {
                modifiedCol = {...col, width: "10rem"};
            }
            return {
                ...modifiedCol,
                onCell: (routingViewModel: RoutingViewModel) => ({
                    editing: col.editable && isEditing(routingViewModel),
                    view: col.view,
                    value: new Map(Object.entries(routingViewModel)).get(col.dataIndex)
                })
            } as ColumnType<RoutingViewModel>;
        }
    });
}

const handleDelete = (id: string, notificationApi: NotificationInstance) => {
    deleteRoutes([id], notificationApi);
};

export default function BrowseRouting() {
    const [notificationApi, contextHolder] = notification.useNotification();

    const {styles} = useStyles();
    const [form] = Form.useForm();
    const {data, isLoading} = useGetRouteSwr();
    const [editingKey, setEditingKey] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const isEditing = (record: RoutingViewModel) => record.id === editingKey;

    return isLoading ? (
        <Flex className={"mt-5"} align="center" justify="center" gap="medium">
            <Spin indicator={<LoadingOutlined spin/>} size="large"/>
        </Flex>
    ) : (
        <>
            {contextHolder}
            <Flex vertical gap="medium">
                <div className={"ms-4 mt-4"}>
                    <Flex gap="small">
                        <Popconfirm title="Sure to delete?"
                                    onConfirm={() => deleteRoutes(selectedRowKeys.map(value => value.toString()), notificationApi)}>
                            <Button type="primary" icon={<DeleteOutlined/>}
                                    disabled={selectedRowKeys.length == 0}>
                                Delete
                            </Button>
                        </Popconfirm>

                    </Flex>
                </div>
                <div className={"m-4 mt-0"}>
                    <Form form={form} component={false}>
                        <Table<RoutingViewModel>
                            bordered
                            components={{body: {cell: EditableCell}}}
                            dataSource={data?.data.map(value => RoutingMapper.mapFromDto(value))}
                            rowKey={record => record.id}
                            columns={getColumns(form, isEditing, setEditingKey, notificationApi)}
                            rowClassName={() => styles.editableRow}
                            pagination={{onChange: () => setEditingKey('')}}
                            rowSelection={{selectedRowKeys, onChange: (selected) => setSelectedRowKeys(selected)}}
                            scroll={{x: 'max-content'}}
                        />
                    </Form>
                </div>
            </Flex>
        </>
    );
}