import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Select } from 'antd';

class EditGroup extends React.Component {
  hideEditProject = () => {
    this.props.dispatch({
      type: 'experts/rUpdateState',
      payload: { editProjectVisible: false },
    });
  };
  submitEditedProject = () => {
    const { dispatch, form, editProject: { id } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'experts/eEditProject',
          id,
          payload: { ...values },
        });
      }
    });
  };

  render() {
    const { form, submittingEditedProject, editProjectVisible, editProject } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal title="编辑项目" width={500} visible={editProjectVisible} afterClose={() => this.props.form.resetFields()}
             confirmLoading={submittingEditedProject}
             onOk={this.submitEditedProject} onCancel={this.hideEditProject}>
        <Form layout="horizontal" labelCol={{ xs: 5 }} wrapperCol={{ xs: 17 }}>
          <Form.Item label="记录表名称">
            {getFieldDecorator('name', {
              initialValue: editProject['name'],
              rules: [{ required: true, message: '记录表名称不能为空' }],
            })(
              <Input placeholder="如：四川省采购评审专家抽取结果记录表"/>,
            )}
          </Form.Item>
          <Form.Item label="项目编号">
            {getFieldDecorator('project_num', {
              initialValue: editProject['project_num'],
              rules: [{ required: true, message: '项目编号不能为空' }],
            })(
              <Input placeholder="请输入"/>,
            )}
          </Form.Item>
          <Form.Item label="项目名称">
            {getFieldDecorator('project_name', {
              initialValue: editProject['project_name'],
              rules: [{ required: true, message: '项目名称不能为空' }],
            })(
              <Input placeholder="请输入"/>,
            )}
          </Form.Item>
          <Form.Item label="专家类型">
            {getFieldDecorator('roll_type', {
              initialValue: editProject['roll_type'],
              rules: [{ required: true, message: '专家类型不能为空' }],
            })(
              <Select placeholder="请选择" disabled>
                <Select.Option key="发改专家摇号" value="发改专家摇号">发改专家</Select.Option>
                <Select.Option key="采购专家摇号" value="采购专家摇号">采购专家</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const WrappedForm = Form.create({ name: 'editProject' })(EditGroup);

export default connect(({ loading, experts }) => ({
  submittingEditedProject: loading.effects['experts/eEditProject'],
  editProjectVisible: experts.editProjectVisible,
  editProject: experts.editProject,
}))(WrappedForm);
