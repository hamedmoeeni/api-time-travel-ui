'use client';
import React from 'react';
import {Card, Flex} from "antd";
import {PlusOutlined, UnorderedListOutlined} from '@ant-design/icons';
import Link from "next/link";

const routeActions: React.ReactNode[] = [
    <><Link href="/routing/new"><PlusOutlined key="add"/></Link></>,
    <><Link href="/routing/browse"><UnorderedListOutlined key="search"/></Link></>,
];

const recordingActions: React.ReactNode[] = [
    <><Link href="/recording/browse"><UnorderedListOutlined key="search"/></Link></>,
];

const statsActions: React.ReactNode[] = [
    <><Link href="/stats"><UnorderedListOutlined key="search"/></Link></>,
];

export default function Home() {
    return (
        <Flex wrap gap="large" justify="center" align="center" className={"min-h-full"}>
            <Card actions={routeActions} className={"min-w-64"}>
                <Card.Meta
                    title="Routing"
                    description={
                        <>
                            <p>View and modify routing rules</p>
                        </>
                    }
                />
            </Card>

            <Card actions={recordingActions} className={"min-w-64"}>
                <Card.Meta
                    title="Recording"
                    description={
                        <>
                            <p>View recordings</p>
                        </>
                    }
                />
            </Card>

            <Card actions={statsActions} className={"min-w-64"}>
                <Card.Meta
                    title="Stats"
                    description={
                        <>
                            <p>View stats</p>
                        </>
                    }
                />
            </Card>
        </Flex>
    )
}