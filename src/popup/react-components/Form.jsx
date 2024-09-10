import React from 'react';
import { Form } from '@douyinfe/semi-ui';

export default () => (
    <Form render={({ formState, formApi, values }) => (
        <>
            <Form.Select field="role" label='Role' style={{ width: 120 }}>
                <Form.Select.Option value="admin">Admin</Form.Select.Option>
                <Form.Select.Option value="user">User</Form.Select.Option>
                <Form.Select.Option value="guest">Guest</Form.Select.Option>
            </Form.Select>
            <Form.Input field='userName' label='UserName' />
            <Form.Input field='password' label='Password' />
            <code style={{ marginTop: 30 }}>{JSON.stringify(formState)}</code>
        </>
    )} layout='horizontal'>
    </Form>
);
