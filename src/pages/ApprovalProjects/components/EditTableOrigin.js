import React from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Spin, Col, InputNumber, Form, DatePicker, Input, Row, Select, Button, Icon } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { limitDecimals } from '@/utils/transfer';
import { TABLE_FOR_MAKING_PROJECT_CATEGORIES } from '../../../../config/constant';
import styles from './EditTableOrigin.less';

let companyOuterId = 0;

class EditTableOrigin extends React.Component {

  addCompanyOuterFormItem = () => {
    const keys = this.props.form.getFieldValue('keys');
    const nextKeys = keys.concat(companyOuterId++);
    this.props.form.setFieldsValue({
      keys: nextKeys,
    });
  };
  removeCompanyOuterFormItem = k => {
    const keys = this.props.form.getFieldValue('keys');
    if (keys.length === 0) {
      return;
    }

    this.props.form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };
  submit = () => {
    const { path, params } = this.props.match;
    const isEditing = path === '/approvalProject/edit/:id';
    if (isEditing) {
      const { id } = params;
      this.props.form.validateFields((err, values) => {
        if (!err) {
          if (values['sign_date']) {
            values['sign_date'] = moment(values['sign_date']).valueOf() / 1000;
          }
          const { keys } = values;
          const origin_outer = [];
          if (keys.length > 0) {
            const { company_name, price, contact } = values;
            keys.forEach(item => {
              origin_outer.push({
                company_name: company_name[item],
                price: price[item],
                contact: contact[item],
              });
            });
            values.origin_outer = origin_outer;
          }
          delete values['keys']
          delete values['company_name']
          delete values['price']
          delete values['contact']
          this.props.dispatch({ type: 'editApprovalProject/eUpdateOriginTable', id, payload: { ...values } });
        }
      });
    } else {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          if (values['sign_date']) {
            values['sign_date'] = moment(values['sign_date']).valueOf() / 1000;
          }
          const { keys } = values;
          const origin_outer = [];
          if (keys.length > 0) {
            const { company_name, price, contact } = values;
            keys.forEach(item => {
              origin_outer.push({
                company_name: company_name[item],
                price: price[item],
                contact: contact[item],
              });
            });
            values.origin_outer = origin_outer;
          }
          delete values['keys']
          delete values['company_name']
          delete values['price']
          delete values['contact']
          this.props.dispatch({ type: 'editApprovalProject/eCreateOriginTable', payload: { ...values } });
        }
      });
    }
  };
  submitConfirm = () => {
    const { confirm_list } = this.props.form.getFieldsValue();
    const { params: { id } } = this.props.match;
    this.props.dispatch({ type: 'editApprovalProject/eUpdateOriginConfirms', id, payload: { confirm_list } });
  };

  render() {
    const { form: { getFieldDecorator, getFieldValue }, submittingCreatedOrigin, submittingEditedOrigin, loadingOrigin, loadingUsers, usersList, managersList, editOrigin, match: { path } } = this.props;
    const isEditing = path === '/approvalProject/edit/:id';

    let initialValue = [];
    if (Object.keys(editOrigin).length > 0) {
      for (let i = 0; i < editOrigin['origin_outer'].length; i++) {
        initialValue.push(i);
        companyOuterId++;
      }
    }
    getFieldDecorator('keys', { initialValue });

    const keys = getFieldValue('keys');
    const companyOuterFormItems = keys.map((key) => (
      <Row gutter={[150]} type="flex" align="middle" key={`origin_outer${key}`}>
        <Col xl={6} md={10} sm={24}>
          <Form.Item label="??????????????????">
            {getFieldDecorator(`company_name[${key}]`, {
              initialValue: editOrigin['origin_outer'] && editOrigin['origin_outer'][key] && editOrigin['origin_outer'][key].company_name,
              rules: [{ required: true, message: '?????????' }],
            })(
              <Input placeholder="?????????"/>,
            )}
          </Form.Item>
        </Col>
        <Col xl={6} md={10} sm={24}>
          <Form.Item label="??????????????????">
            {getFieldDecorator(`price[${key}]`, {
              initialValue: editOrigin['origin_outer'] && editOrigin['origin_outer'][key] && editOrigin['origin_outer'][key].price,
              rules: [{ required: true, message: '?????????' }],
            })(
              <InputNumber min={0} style={{ width: '100%' }}/>,
            )}
          </Form.Item>
        </Col>
        <Col xl={6} md={10} sm={24}>
          <Form.Item label="?????????">
            {getFieldDecorator(`contact[${key}]`, {
              initialValue: editOrigin['origin_outer'] && editOrigin['origin_outer'][key] && editOrigin['origin_outer'][key].contact,
            })(
              <Input placeholder="?????????"/>,
            )}
          </Form.Item>
        </Col>
        <Col xl={6} md={4} sm={24}>
          {
            keys.length > 0 ?
              <Icon type="minus-circle-o" style={{ marginTop: '14px', fontSize: '1.5rem' }}
                    onClick={() => this.removeCompanyOuterFormItem(key)}/>
              :
              null
          }
        </Col>
      </Row>
    ));
    return (
      <Spin spinning={Boolean(submittingCreatedOrigin) || Boolean(submittingEditedOrigin) || Boolean(loadingOrigin)}>
        <Form layout="horizontal">
          <h3>????????????</h3>
          <Row gutter={[80]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="??????">
                {getFieldDecorator('num', { initialValue: editOrigin['num'] })(
                  <InputNumber min={1} formatter={limitDecimals} parser={limitDecimals} style={{ width: '100%' }}
                               placeholder="?????????"/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={12} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('name', {
                  initialValue: editOrigin['name'],
                  rules: [{ required: true, message: '?????????????????????' }],
                })(
                  <Input.TextArea placeholder="?????????" autoSize={{ minRows: 1, maxRows: 4 }}/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[80]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('act_org', { initialValue: editOrigin['act_org'] })(
                  <Input placeholder="?????????"/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('sign_date', { initialValue: editOrigin['sign_date'] && moment(editOrigin['sign_date'] * 1000) })(
                  <DatePicker style={{ width: '100%' }}/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('status', {
                  initialValue: editOrigin['status'] ? editOrigin['status'] : '?????????',
                  rules: [{ required: true, message: '?????????' }],
                })(
                  <Select placeholder="?????????">
                    <Select.Option key="?????????" value="?????????">?????????</Select.Option>
                    <Select.Option key="?????????" value="?????????">?????????</Select.Option>
                    <Select.Option key="?????????" value="?????????">?????????</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <h3>????????????</h3>
          <Row gutter={[80]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('category', {
                  initialValue: editOrigin['category'],
                  rules: [{ required: true, message: '?????????' }],
                })(
                  <Select placeholder="?????????">
                    {TABLE_FOR_MAKING_PROJECT_CATEGORIES.map((item, index) => {
                      return (
                        <Select.Option key={index} value={item}>{item}</Select.Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????????????????">
                {getFieldDecorator('cash', { initialValue: editOrigin['cash'] })(
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="?????????"/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Spin spinning={Boolean(loadingUsers)}>
                <Form.Item label="???????????????">
                  {getFieldDecorator('members', { initialValue: editOrigin['members'] })(
                    <Select mode="multiple" style={{ width: '100%' }} placeholder="?????????">
                      {usersList.map(item => {
                        return (
                          <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        );
                      })}
                    </Select>,
                  )}
                </Form.Item>
              </Spin>
            </Col>
          </Row>
          <Row gutter={[80]}>
            <Col xl={12} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('cash_detail', { initialValue: editOrigin['cash_detail'] })(
                  <Input.TextArea placeholder="?????????" autoSize={{ minRows: 4 }}/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[80]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('receipt_status', { initialValue: editOrigin['receipt_status'] })(
                  <Input.TextArea placeholder="?????????" autoSize={{ minRows: 2 }}/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('act_fee', { initialValue: editOrigin['act_fee'] })(
                  <Input.TextArea placeholder="?????????" autoSize={{ minRows: 2 }}/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('sales_fee', { initialValue: editOrigin['sales_fee'] })(
                  <Input.TextArea placeholder="?????????" autoSize={{ minRows: 2 }}/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[80]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('bid_info', { initialValue: editOrigin['bid_info'] })(
                  <Input.TextArea placeholder="?????????" autoSize={{ minRows: 2 }}/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="??????">
                {getFieldDecorator('memo', { initialValue: editOrigin['memo'] })(
                  <Input.TextArea placeholder="?????????" autoSize={{ minRows: 2 }}/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <h3>????????????</h3>
          {companyOuterFormItems}
          <Row gutter={[150]}>
            <Col xl={12} md={12} sm={24}>
              <Button type="dashed" block onClick={this.addCompanyOuterFormItem}>
                <Icon type="plus"/> ??????
              </Button>
            </Col>
          </Row>
          <Row>
            <Button type="primary" style={{ marginTop: '2rem' }} onClick={this.submit}>??????</Button>
          </Row>
          <Spin spinning={Boolean(loadingUsers)}>
            <h3 style={{ marginTop: '5em' }}>????????????</h3>
            <Row gutter={[80]}>
              <Col xl={6} md={12} sm={24}>
                <Form.Item>
                  {getFieldDecorator('confirm_list', {
                    initialValue: editOrigin['confirm_list'] && _.map(_.map(editOrigin['confirm_list'], 'confirm_user'), 'id'),
                  })(
                    <Select mode="multiple" style={{ width: '100%' }} placeholder="?????????">
                      {managersList.map(item => {
                        return (
                          <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        );
                      })}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xl={18} md={12} sm={24}>
                {
                  editOrigin['confirm_list'] &&
                  _.map(editOrigin['confirm_list'], (item, index) => (
                    <Col xl={8} md={12} sm={24} key={index}>
                      <div className={styles.confirmBox} key={item.id}>
                        <span>{item['confirm_user']['name']}</span>
                        {
                          item['confirmed'] ?
                            <span className={styles.hasConfirm}>?????????</span> :
                            <span className={styles.hasNotConfirm}>?????????</span>
                        }
                      </div>
                    </Col>
                  ))
                }
              </Col>
            </Row>
            {
              isEditing &&
              <Row gutter={[80]}>
                <Col xl={6} md={12} sm={24}>
                  <Button type="primary" style={{ marginTop: '1.5em' }} onClick={this.submitConfirm}>????????????</Button>
                </Col>
              </Row>
            }
          </Spin>
        </Form>
      </Spin>
    );
  }
}

const WrappedForm = Form.create({ name: 'EditTableOrigin' })(EditTableOrigin);

export default withRouter(connect(({ loading, common, editApprovalProject }) => ({
  submittingCreatedOrigin: loading.effects['editApprovalProject/eCreateOriginTable'],
  submittingEditedOrigin: loading.effects['editApprovalProject/eUpdateOriginTable'],
  loadingOrigin: loading.effects['editApprovalProject/eGetOriginTable'],
  loadingUsers: loading.effects['editApprovalProject/eGetUsers'],
  routes: editApprovalProject.routes,
  usersList: editApprovalProject.usersList,
  managersList: editApprovalProject.managersList,
  editOrigin: editApprovalProject.editOrigin,
}))(WrappedForm));
