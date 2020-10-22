import React, { useEffect, useState } from 'react';
import { Grid, Table } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main(props) {
    const { api } = useSubstrate();
    const { finalized } = props;
    const [latestBlock, setLatestBlock] = useState(null);

    useEffect(() => {
        let unsubscribeAll = null;

        // make a call to retrieve the current network head
        api.rpc.chain.subscribeNewHeads((header) => {
            console.log(`Chain is at #${header}`);
            setLatestBlock(header);
        }).then(unsub => {
            unsubscribeAll = unsub;
        }).catch(console.error);

        return () => unsubscribeAll && unsubscribeAll();
    }, []);

    return (
        <Grid.Column>
            <h1>Block Data</h1>
            {latestBlock && (
                <Table celled striped size='small'>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell><b>Block</b></Table.Cell>
                            <Table.Cell><b>#{latestBlock.number.toNumber()}</b></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><b>Hash</b></Table.Cell>
                            <Table.Cell>{latestBlock.hash.toHuman()}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><b>ParentHash</b></Table.Cell>
                            <Table.Cell>{latestBlock.parentHash.toHuman()}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><b>Extrinsics Root</b></Table.Cell>
                            <Table.Cell>{latestBlock.extrinsicsRoot.toHuman()}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><b>State Root</b></Table.Cell>
                            <Table.Cell>{latestBlock.stateRoot.toHuman()}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            )}
        </Grid.Column>
    );
}

export default function LatestBlock(props) {
    const { api } = useSubstrate();
    return api.rpc &&
        api.rpc.chain &&
        api.rpc.chain.subscribeNewHeads ? (
            <Main {...props} />
        ) : null;
}
