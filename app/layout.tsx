'use client';

import {AntdRegistry} from '@ant-design/nextjs-registry';
import {Breadcrumb, ConfigProvider, Layout, Menu, Space, theme} from "antd";
import "./globals.css"
import React, {Suspense} from "react";
import {
    HomeOutlined,
    LineChartOutlined,
    MergeFilled,
    PlusOutlined,
    SaveOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import {usePathname} from "next/navigation";
import Link from "next/link";
import {MenuItemType, SubMenuType} from "antd/lib/menu/interface";
import {BreadcrumbItemType} from "antd/lib/breadcrumb/Breadcrumb";
import SkeletonInput from "antd/es/skeleton/Input";
import {LayoutPropsContext} from "./context";
import {getNotificationServiceImpl} from "@/src/lib/infrastructure/antdimpls/AntdNotificationServiceImpl";
import {AxiosRestApiImpl} from "@/src/lib/infrastructure/axiosimpls/AxiosRestApiImpl";
import {RestApi} from "@/src/lib/infrastructure/rest/RestApi";
import {RoutingRestApi} from "@/src/lib/rest/routing/RoutingRestApi";
import {RecordingRestApi} from "@/src/lib/rest/recording/RecordingRestApi";


const {Header, Content, Footer, Sider} = Layout;

const menuItems: (SubMenuType | MenuItemType)[] = [
    {
        key: '/', icon: <HomeOutlined/>, label: <Link href="/">Home</Link>
    },
    {
        key: '/routing', icon: <MergeFilled/>, label: "Routing", children: [
            {key: "/routing/new", icon: <PlusOutlined/>, label: <Link href="/routing/new">New route</Link>},
            {
                key: "/routing/browse",
                icon: <UnorderedListOutlined/>,
                label: <Link href="/routing/browse">Browse routes</Link>
            }
        ]
    },
    {
        key: '/recording', icon: <SaveOutlined/>, label: "Recording", children: [
            {
                key: "/recording/browse",
                icon: <UnorderedListOutlined/>,
                label: <Link href="/recording/browse">Browse recordings</Link>
            }
        ]
    },
    {
        key: '/stats', icon: <LineChartOutlined/>, label: <Link href="/stats">Stats</Link>
    }
];


function getBreadcrumbItems(menuItems: (SubMenuType | MenuItemType)[], pathName: string): BreadcrumbItemType[] {
    for (const mi of menuItems) {
        const key = mi["key"]?.toString();
        if (key && pathName.startsWith(key)) {
            if (pathName === key) {
                return [{title: mi.label}] as BreadcrumbItemType[];
            }
            const children = (mi as SubMenuType)?.children as SubMenuType[];
            if (children?.length > 0) {
                return ([{title: mi.label}] as BreadcrumbItemType[]).concat(getBreadcrumbItems(children, pathName));
            }
        }
    }
    return [];
}

function getMenuOpenKeys(pathName: string) {
    const parts = pathName.split("/");
    const result = [];
    for (let i = 0; i < parts.length; i++) {
        result.push(parts.slice(0, i).join("/"))
    }
    return result.filter(value => value.length > 0);
}

export default function RootLayout({children}: React.PropsWithChildren) {
    const [notificationService, contextHolder] = getNotificationServiceImpl();
    const restApi: RestApi = new AxiosRestApiImpl();
    const layoutProps = {
        notificationService: notificationService,
        routingRestApi: new RoutingRestApi(restApi),
        recordingRestApi: new RecordingRestApi(restApi)
    };

    return (
        <html lang="en">
        <body>
        <Suspense fallback={<div>Loading...</div>}>
            <ConfigProvider theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: "#5f79e2",
                    colorInfo: "#5f79e2",
                    colorTextBase: "#e0e0e0",
                    colorBgBase: "#262626",
                    fontSize: 16
                },
                components: {
                    Menu: {
                        itemBg: "#00000000"
                    }
                }
            }}>
                <Layout>
                    <Sider breakpoint="lg" collapsedWidth="0" className={"min-h-screen z-10"}>
                        <Space orientation="vertical" size="large" className={"m-4"}>
                            <SkeletonInput size="medium"></SkeletonInput>
                        </Space>
                        <Menu mode="inline" items={menuItems} selectedKeys={[usePathname()]}
                              defaultOpenKeys={getMenuOpenKeys(usePathname())}/>
                    </Sider>
                    <Layout>
                        <Header>

                        </Header>
                        <Content>
                            <Space size="large" className={"m-4"}>
                                <Breadcrumb items={getBreadcrumbItems(menuItems, usePathname())}/>
                            </Space>
                            <AntdRegistry>
                                <LayoutPropsContext.Provider value={layoutProps}>
                                    {contextHolder}
                                    {children}
                                </LayoutPropsContext.Provider>
                            </AntdRegistry>
                        </Content>
                        <Footer>
                            API Time Travel UI 1.0.0
                        </Footer>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </Suspense>
        </body>
        </html>
    )
}