'use client';

import {
    Flex,
    Form,
    FormInstance,
    Input,
    notification,
    Popconfirm,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Typography
} from "antd";
import {NotificationInstance} from "antd/es/notification/interface";
import {deleteRoutes, RoutingDto, saveRoutes, useGetRouteSwr} from "@/src/lib/routingApi";
import {createStyles} from "antd-style";
import React, {useState} from "react";
import {ColumnGroupType, ColumnType} from "antd/es/table";
import {CloseOutlined, DeleteFilled, EditFilled, LoadingOutlined, SaveOutlined} from "@ant-design/icons";


interface Routing {
    id: string,
    priority: number,
    sourceHost: string[],
    sourcePath: string[],
    method: string[],
    destinationHostUri: string
}

function mapFromDto(dto: RoutingDto): Routing {
    return {
        ...dto,
        sourceHost: dto.sourceHost?.split(","),
        sourcePath: dto.sourcePath?.split(","),
        method: dto.method?.split(",")
    };
}

function mapToDto(record: Routing): RoutingDto {
    return {
        ...record,
        sourceHost: record.sourceHost?.join(","),
        sourcePath: record.sourcePath?.join(","),
        method: record.method?.join(",")
    }
}

function save(recordId: string, form: FormInstance, setEditingKey: React.Dispatch<React.SetStateAction<string>>, notificationApi: NotificationInstance) {
    form.validateFields()
        .then(record => {
            const dto = mapToDto(record as Routing);
            return saveRoutes([{...dto, id: recordId}], notificationApi);
        })
        .then(() => setEditingKey(''));
}

const useStyles = createStyles((props) => {
    const {css, prefixCls, cssVar} = props;
    return {
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
    dataIndex: string;
    title: string;
    inputType: 'input' | 'select';
    inputProps: object,
    required: boolean;
    record: Routing;
    index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = (props) => {
    const {editing, dataIndex, title, inputType, inputProps, required, record, index, children, ...restProps} = props;

    let inputNode = <></>;
    if (inputType === 'input') {
        inputNode = <Input {...inputProps}/>;
    } else if (inputType === 'select') {
        inputNode = <Select {...inputProps}/>;
    }

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                    rules={[{required: required, message: `Please Input ${title}!`}]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


function getTagsList(values: string[]) {
    return <Flex gap="small" align="center" wrap>
        {values?.map((value, index) => <Tag key={index}>{value}</Tag>)}
    </Flex>;
}

function getColumns(form: FormInstance,
                    isEditing: (record: Routing) => boolean,
                    setEditingKey: React.Dispatch<React.SetStateAction<string>>,
                    notificationApi: NotificationInstance) {
    return [
        {
            title: "Priority",
            dataIndex: "priority",
            sorter: (a: Routing, b: Routing) => a.priority - b.priority,
            defaultSortOrder: 'ascend',
            editable: true,
            inputType: 'input',
            inputProps: {mode: "spinner", min: "1"}
        },
        {
            title: "Incoming host",
            dataIndex: "sourceHost",
            ellipsis: true,
            editable: true,
            inputType: 'select',
            inputProps: {
                placeholder: "example.com, ...",
                mode: "tags",
                tokenSeparators: [","],
                maxTagCount: "responsive",
                notFoundContent: null
            },
            render: (_, record: Routing) => getTagsList(record.sourceHost)
        },
        {
            title: "Incoming path",
            dataIndex: "sourcePath",
            ellipsis: true,
            editable: true,
            inputType: 'select',
            inputProps: {
                placeholder: "/mypah...",
                mode: "tags",
                tokenSeparators: [","],
                maxTagCount: "responsive",
                notFoundContent: null
            },
            render: (_, record: Routing) => getTagsList(record.sourcePath)
        },
        {
            title: "Http method",
            dataIndex: "method",
            ellipsis: true,
            editable: true,
            inputType: 'select',
            inputProps: {
                placeholder: "Select a http method",
                mode: "multiple",
                tokenSeparators: [","],
                options: [
                    {label: 'GET', value: 'GET'},
                    {label: 'POST', value: 'POST'},
                    {label: 'PATCH', value: 'PATCH'}
                ]
            },
            render: (_, record: Routing) => getTagsList(record.method)
        },
        {
            title: "Outgoing URL",
            dataIndex: "destinationHostUri",
            ellipsis: true,
            editable: true,
            inputType: 'input',
            inputProps: {}
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: unknown, record: Routing) => {
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
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id, notificationApi)}>
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
            },
        },
    ];
}

function getMergedColumns(form: FormInstance,
                          isEditing: (record: Routing) => boolean,
                          setEditingKey: React.Dispatch<React.SetStateAction<string>>,
                          notificationApi: NotificationInstance): (ColumnType<Routing> | ColumnGroupType<Routing>)[] {
    return getColumns(form, isEditing, setEditingKey, notificationApi).map(col => {
        if (!col.editable) {
            return col as unknown as ColumnType<Routing>;
        }
        return {
            ...col,
            onCell: (record: Routing) => ({
                record,
                dataIndex: col.dataIndex,
                inputType: col.inputType,
                inputProps: col.inputProps,
                title: col.title,
                required: false,
                editing: isEditing(record),
            }),
        } as unknown as ColumnGroupType<Routing>;
    })
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

    const isEditing = (record: Routing) => record.id === editingKey;

    return isLoading ? (
        <Flex className={"mt-5"} align="center" justify="center" gap="medium">
            <Spin indicator={<LoadingOutlined spin/>} size="large"/>
        </Flex>
    ) : (
        <>
            {contextHolder}
            <Form form={form} component={false}>
                <Table<Routing>
                    bordered
                    components={{body: {cell: EditableCell}}}
                    dataSource={data?.data.map(value => mapFromDto(value))}
                    rowKey={record => record.id}
                    columns={getMergedColumns(form, isEditing, setEditingKey, notificationApi)}
                    rowClassName={() => styles.editableRow}
                    pagination={{onChange: () => setEditingKey('')}}
                    className={"m-4"}
                />
            </Form>
        </>
    );
}