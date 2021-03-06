import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Select, Switch } from 'antd';

class EditUserModal extends React.Component {

  hideCreateUserModal = () => {
    this.props.dispatch({
      type: 'userList/rUpdateState',
      payload: { editUserModalVisible: false },
    });
  };

  submitCreatedUser = () => {
    const { dispatch, form, editUser } = this.props;
    const { id } = editUser;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'userList/eEditUser',
          id,
          payload: { ...values },
        });
      }
    });
  };

  render() {
    const { submittingEditedUser, form, departments, editUserModalVisible, editUser } = this.props;
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Modal title="编辑用户" width={420} visible={editUserModalVisible}
               afterClose={() => this.props.form.resetFields()}
               confirmLoading={submittingEditedUser}
               onOk={this.submitCreatedUser} onCancel={this.hideCreateUserModal}>
          <Form layout="horizontal" labelCol={{ xs: 5 }} wrapperCol={{ xs: 17 }}>
            <Form.Item label="姓名">
              {getFieldDecorator('name', {
                initialValue: editUser.name,
                rules: [
                  { required: true, message: '姓名不能为空' },
                ],
              })(
                <Input placeholder="请输入"/>,
              )}
            </Form.Item>
            <Form.Item label="部门">
              {getFieldDecorator('department', {
                initialValue: editUser['department']['id'],
                rules: [
                  { required: true, message: '部门不能为空' },
                ],
              })(
                <Select placeholder="请选择">
                  {departments.map(item =>
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>,
                  )}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="权限">
              {getFieldDecorator('level', {
                initialValue: editUser['level'],
                rules: [
                  { required: true, message: '权限不能为空' },
                ],
              })(
                <Select placeholder="请选择">
                  <Select.Option value={1}>普通权限</Select.Option>
                  <Select.Option value={2}>主管权限</Select.Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="账号">
              {getFieldDecorator('username', {
                initialValue: editUser['username'],
                rules: [
                  { required: true, message: '请输入账号！' },
                  { min: 5, message: '账号长度不能少于 5 位！' },
                  { max: 20, message: '账号长度不能多于 20 位！！' },
                ],
              })(
                <Input placeholder="请输入"/>,
              )}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                initialValue: editUser['password'],
                rules: [{ min: 5, message: '密码长度不能少于 5 位！' }],
              })(
                <Input placeholder="请输入" type="password"/>,
              )}
            </Form.Item>
            <Form.Item label="手机号码">
              {getFieldDecorator('phone', {
                initialValue: editUser['phone'],
                rules: [
                  { required: true, message: '请填写符合格式的手机号码' },
                ],
              })(
                <Input placeholder="请输入"/>,
              )}
            </Form.Item>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                initialValue: editUser['email'],
                rules: [
                  { type: 'email', message: '请填写符合格式的邮箱地址' },
                ],
              })(
                <Input placeholder="请输入"/>,
              )}
            </Form.Item>
            <Form.Item label="状态">
              {getFieldDecorator('alive', {
                valuePropName: 'checked',
                initialValue: editUser['alive'],
                rules: [{ required: true }],
              })(
                <Switch checkedChildren="在职" unCheckedChildren="离职"/>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

const WrappedForm = Form.create({ name: 'EditUserModal' })(EditUserModal);

export default connect(({ loading, userList }) => ({
  submittingEditedUser: loading.effects['userList/eEditUser'],
  departments: userList.departments,
  editUserModalVisible: userList.editUserModalVisible,
  editUser: userList.editUser,
}))(WrappedForm);
