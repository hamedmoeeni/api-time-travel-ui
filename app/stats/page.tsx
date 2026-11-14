'use client';
import {Line} from "@ant-design/charts";
import {useContext, useEffect, useState} from "react";
import {LayoutPropsContext} from "@/app/context";
import {QueryLabelsDto} from "@/src/lib/rest/stats/StatsApi";
import {Flex, Form, Select, Skeleton, Space} from "antd";
import {DotChartOutlined, FilterFilled} from "@ant-design/icons"
import FormItem from "antd/es/form/FormItem";

interface ChartData {
    time: number,
    value: number,
    category: string
}

export default function Stats() {
    const {statsApi} = useContext(LayoutPropsContext);
    const [isLabelsLoading, setLabelsLoading] = useState(true);
    const [isDataLoading, setDataLoading] = useState(true);
    const [queryLabels, setQueryLabels] = useState<QueryLabelsDto | null>();
    const [data, setData] = useState<ChartData[]>([]);

    function loadLabels() {
        statsApi.getQueryLabels()
            .then(value => {
                setQueryLabels(value ? value : null);
                setLabelsLoading(false);
                loadData();
            });
    }

    function loadData() {
        setDataLoading(true);
        //AVG_RESPONSE_TIME or COUNT
        statsApi.getTimeSeries({outputType: "AVG_RESPONSE_TIME"}).then(timeSeries => {
            const data = [];
            if (timeSeries) {
                for (let i = 0; i < timeSeries.length; i++) {
                    for (let j = 0; j < timeSeries[i].time.length; j++) {
                        data.push({
                            time: timeSeries[i].time[j],
                            value: timeSeries[i].value[j],
                            category: timeSeries[i].label
                        });
                    }
                }
            }
            setData(data);
            setDataLoading(false);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => loadLabels(), []);

    const config = {
        height: 400,
        xField: (d: ChartData) => new Date(d.time),
        yField: 'value',
        colorField: 'category',
        theme: {type: 'dark'}
    };

    return <Flex vertical gap="medium">
        {isLabelsLoading ?

            <Space size="medium">
                <Skeleton.Input active/>
                <Skeleton.Input active/>
                <Skeleton.Input active/>
                <Skeleton.Input active/>
            </Space>
            :
            <Form layout="inline">
                <FormItem><FilterFilled/></FormItem>
                <FormItem label="Methods">
                    <Select mode="multiple" style={{minWidth: "10rem"}}
                            options={queryLabels?.methods.map(m => ({'label': m, 'value': m}))}/>
                </FormItem>
                <FormItem label="Status">
                    <Select mode="multiple" style={{minWidth: "10rem"}}
                            options={queryLabels?.status.map(m => ({'label': m, 'value': m}))}/>
                </FormItem>
                <FormItem label="Route">
                    <Select mode="multiple" style={{minWidth: "10rem"}}
                            options={queryLabels?.routeIds.map(m => ({'label': m, 'value': m}))}/>
                </FormItem>
                <FormItem label="Url">
                    <Select mode="multiple" style={{minWidth: "10rem"}}
                            options={queryLabels?.urls.map(m => ({'label': m, 'value': m}))}/>
                </FormItem>
            </Form>

        }
        <Flex vertical gap="medium">

            {isLabelsLoading || isDataLoading ?

                <Flex justify="center"><Skeleton.Node active><DotChartOutlined
                    style={{fontSize: 40}}/></Skeleton.Node></Flex>
                :
                <Line {...config} data={data}/>
            }

        </Flex>
    </Flex>
        ;

}