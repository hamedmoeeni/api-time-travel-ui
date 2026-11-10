'use client';

import React, {useContext, useEffect, useState} from "react";
import {LayoutPropsContext} from "@/app/context";
import {Button, DatePicker, Input, Space, Table, TablePaginationConfig, TableProps, Tag} from "antd";
import {ColumnGroupType, ColumnType} from "antd/es/table";
import {RecordingDto} from "@/src/lib/rest/recording/RecordingRestApi";
import {FilterConfirmProps, FilterResetProps, FilterValue, SorterResult} from "antd/es/table/interface";
import type {Dayjs} from 'dayjs';

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<unknown>['field'];
    sortOrder?: SorterResult<unknown>['order'];
    filters?: Record<string, FilterValue | null>;
}

export default function BrowseRouting() {
    const {recordingRestApi} = useContext(LayoutPropsContext)
    const [data, setData] = useState<RecordingDto[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        filters: {},
        pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            current: 1,
            pageSize: 10
        }
    });
    const [selectedTimestampRange, setSelectedTimestampRange] = useState<[start: Dayjs | null | undefined, end: Dayjs | null | undefined] | null>();

    const searchFilterDropdown = (
        setSelectedKeys: (selectedKeys: React.Key[]) => void, selectedKeys: React.Key[],
        confirm: (param?: FilterConfirmProps) => void, clearFilters: ((param?: FilterResetProps) => void) | undefined,
        close: () => void, dataIndex: string) => {
        function applyFilter() {
            confirm({closeDropdown: false});
            if (tableParams.filters) {
                tableParams.filters[dataIndex] = selectedKeys;
            }
        }

        function resetFilter() {
            if (tableParams.filters) {
                tableParams.filters[dataIndex] = null;
            }

            setSelectedKeys([]);

            if (clearFilters) {
                clearFilters();
            }

            confirm();
        }

        return <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
            <Input
                placeholder={`Search`}
                value={selectedKeys as string[]}
                onChange={(e) => setSelectedKeys([e.target.value])}
                onPressEnter={() => applyFilter()}
                style={{marginBottom: 8, display: 'block'}}
            />
            <Space>
                <Button
                    color="primary"
                    variant="solid"
                    size="small"
                    onClick={() => applyFilter()}
                >
                    Filter
                </Button>
                <Button
                    color="primary"
                    variant="link"
                    size="small"
                    onClick={() => resetFilter()}>
                    Reset
                </Button>
            </Space>
        </div>
    };

    const timeRangeFilterDropdown = (
        setSelectedKeys: (selectedKeys: React.Key[]) => void, selectedKeys: React.Key[],
        confirm: (param?: FilterConfirmProps) => void, clearFilters: ((param?: FilterResetProps) => void) | undefined,
        close: () => void, dataIndex: string) => {
        function applyFilter() {
            confirm({closeDropdown: false});
            if (tableParams.filters) {
                tableParams.filters[dataIndex] = selectedKeys;
            }
        }

        function resetFilter() {
            if (tableParams.filters) {
                tableParams.filters[dataIndex] = null;
            }

            setSelectedKeys([]);
            setSelectedTimestampRange(null);

            if (clearFilters) {
                clearFilters();
            }

            confirm();
        }

        return <div>
            <div>
                <DatePicker.RangePicker showTime={{format: 'HH:mm:ss'}}
                                        value={selectedTimestampRange}
                                        onChange={(dates, dateStrings) => {
                                            setSelectedKeys(dateStrings);
                                            setSelectedTimestampRange(dates);
                                        }}/>
            </div>
            <div>
                <Space>
                    <Button color="primary" variant="solid" size="small" onClick={() => applyFilter()}>Filter</Button>
                    <Button color="primary" variant="link" size="small" onClick={() => resetFilter()}>Reset</Button>
                </Space>
            </div>
        </div>;
    };

    function getColumns()
        : (ColumnType<RecordingDto> | ColumnGroupType<RecordingDto>)[] {

        return [
            {
                title: "Request Id",
                dataIndex: "requestId",
                filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) =>
                    searchFilterDropdown(setSelectedKeys, selectedKeys, confirm, clearFilters, close, 'requestId')
            },
            {
                title: "Timestamp",
                dataIndex: "timestamp",
                sorter: true,
                render: value => new Date(value).toLocaleString('lookup', {
                    dateStyle: 'medium',
                    timeStyle: 'medium',
                    hour12: false
                }),
                filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) =>
                    timeRangeFilterDropdown(setSelectedKeys, selectedKeys, confirm, clearFilters, close, 'timestamp')
            },
            {
                title: "Http method", dataIndex: "method", render: value => <Tag>{value}</Tag>,
                filters: [{text: 'GET', value: 'get'}, {text: 'POST', value: 'post'}],
                filterSearch: true
            },
            {
                title: "Url",
                dataIndex: "url"
            },
            {
                title: "Response status",
                dataIndex: "responseStatus",
                filters: [{text: "200 OK", value: 200}, {text: "400 Bad request", value: 400}],
                filterSearch: true
            }
        ]
    }


    function fetchData() {

        new Promise((resolve) => {
            setLoading(true);
            resolve(true);
        }).then(() => {
            const timestamp = tableParams.filters?.timestamp?.map(value => new Date(value as string));
            let fromTimestamp: FilterValue | null = null;
            let toTimestamp: FilterValue | null = null;
            if (Array.isArray(timestamp)) {
                if (timestamp.length > 0) {
                    fromTimestamp = [timestamp[0].valueOf()];
                }
                if (timestamp.length > 1) {
                    toTimestamp = [timestamp[1].valueOf()];
                }
            }
            const filters: Record<string, FilterValue | null> = {
                ...tableParams.filters,
                fromTimestamp,
                toTimestamp,
                timestamp: null
            };

            return recordingRestApi.GetRecordings(
                filters,
                tableParams.pagination?.current as number - 1,
                tableParams.pagination?.pageSize,
                tableParams.sortField ? tableParams.sortField as string : undefined,
                tableParams.sortOrder === "ascend" ? "asc" : tableParams.sortOrder === "descend" ? "desc" : undefined);
        }).then((res) => {
            setData(res?.content);
            setLoading(false);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: res?.total
                },
            });
        });
    }

    // eslint-disable-next-line
    useEffect(fetchData, [
        tableParams?.pagination?.current,
        tableParams?.sortOrder,
        tableParams?.sortField,
        tableParams.filters
    ]);

    const handleTableChange: TableProps<RecordingDto>['onChange'] = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    return <>
        <Table<RecordingDto>
            bordered
            loading={loading}
            dataSource={data}
            columns={getColumns()}
            onChange={handleTableChange}
            pagination={tableParams.pagination}
            rowKey={record => record.requestId}
            scroll={{x: 'max-content'}}
            className={"m-4"}
        />
    </>
}