import React from 'react';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { Spin, Col, InputNumber, Form, DatePicker, Input, Row, Select, Button, Icon, Upload, List } from 'antd';
import moment from 'moment';
import { getFileURL } from '@/utils/transfer';

let publishDebtFormItemsId = 0;
let outsourceFormItemsId = 0;

class EditSpecialDebtInfo extends React.Component {
  componentDidMount() {
    this.props.dispatch({ type: 'editSpecialDebt/eGetUsers', payload: {} });
    const { id } = this.props.match.params;
    this.props.dispatch({ type: 'editSpecialDebt/eGetSpecialDebt', id });
  }

  addPublishDebtFormItem = () => {
    const publishDebtFormItemsKeys = this.props.form.getFieldValue('publishDebtFormItemsKeys');
    const nextKeys = publishDebtFormItemsKeys.concat(publishDebtFormItemsId++);
    this.props.form.setFieldsValue({
      publishDebtFormItemsKeys: nextKeys,
    });
  };
  removePublishDebtFormItem = k => {
    const publishDebtFormItemsKeys = this.props.form.getFieldValue('publishDebtFormItemsKeys');
    if (publishDebtFormItemsKeys.length === 0) {
      return;
    }

    this.props.form.setFieldsValue({
      publishDebtFormItemsKeys: publishDebtFormItemsKeys.filter(key => key !== k),
    });
  };

  addOutSourceFormItem = () => {
    const outSourceFormItemsKeys = this.props.form.getFieldValue('outSourceFormItemsKeys');
    const nextKeys = outSourceFormItemsKeys.concat(outsourceFormItemsId++);
    this.props.form.setFieldsValue({
      outSourceFormItemsKeys: nextKeys,
    });
  };
  removeOutSourceFormItem = k => {
    const outSourceFormItemsKeys = this.props.form.getFieldValue('outSourceFormItemsKeys');
    if (outSourceFormItemsKeys.length === 0) {
      return;
    }

    this.props.form.setFieldsValue({
      outSourceFormItemsKeys: outSourceFormItemsKeys.filter(key => key !== k),
    });
  };
  // deleteUploadedFile = (item) => {
  //   const { uploadedSummarizeFile } = this.props;
  //   let payload = [];
  //   uploadedSummarizeFile.forEach(value => {
  //     if (value.id !== item.id) {
  //       payload.push(value);
  //     }
  //   });
  //   this.props.dispatch({ type: 'editSpecialDebt/rUpdateState', payload: { uploadedSummarizeFile: payload } });
  // };
  submit = () => {
    const { dispatch, form, editSpecialDebt } = this.props;
    const { id } = editSpecialDebt;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'editSpecialDebt/eUpdateSpecialDebt',
          id,
          payload: { ...values },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      submittingCreatedProcess, submittingUpdatedProcess, loadingProcess,
      usersList, editSpecialDebt, uploadedSummarizeFile,
    } = this.props;

    const uploadConfig = {
      showUploadList: true,
      beforeUpload: () => false,
      onRemove: file => {
        const fileList = getFieldValue('fileList');
        fileList.splice(fileList.indexOf(file), 1);
        setFieldsValue({ fileList });
      },
    };

    let initialValue = [];
    for (let i = 0; i < editSpecialDebt['debtDetails'].length; i++) {
      initialValue.push(i);
      publishDebtFormItemsId++;
    }
    getFieldDecorator('publishDebtFormItemsKeys', { initialValue });
    const publishDebtFormItemsKeys = getFieldValue('publishDebtFormItemsKeys');
    const publishDebtFormItems = publishDebtFormItemsKeys.map((key) => (
      <Row gutter={[150]} type="flex" align="middle" key={`publishDebtFormItem${key}`}>
        <Col xl={6} md={10} sm={24}>
          <Form.Item label="????????????????????????">
            {getFieldDecorator(`publishDebtCash[${key}]`, {
              initialValue: editSpecialDebt['debtDetails'][key] && editSpecialDebt['debtDetails'][key].cash,
              rules: [{ required: true, message: '?????????' }],
            })(
              <InputNumber min={0} style={{ width: '100%' }}/>,
            )}
          </Form.Item>
        </Col>
        <Col xl={6} md={10} sm={24}>
          <Form.Item label="????????????">
            {getFieldDecorator(`publishDebtYear[${key}]`, {
              initialValue: editSpecialDebt['debtDetails'][key] && editSpecialDebt['debtDetails'][key].year,
              rules: [{ required: true, message: '?????????' }],
            })(
              <InputNumber min={0} style={{ width: '100%' }}/>,
            )}
          </Form.Item>
        </Col>
        <Col xl={4} md={10} sm={24}>
          <Form.Item label="????????????">
            {getFieldDecorator(`publishDebtDate[${key}]`, {
              initialValue: editSpecialDebt['debtDetails'][key] && moment(editSpecialDebt['debtDetails'][key].create * 1000),
              rules: [{ required: true, message: '?????????' }],
            })(
              <DatePicker style={{ width: '100%' }}/>,
            )}
          </Form.Item>
        </Col>
        <Col xl={8} md={4} sm={24}>
          {
            publishDebtFormItemsKeys.length > 0 ?
              <Icon type="minus-circle-o" style={{ marginTop: '14px', fontSize: '1.5rem' }}
                    onClick={() => this.removePublishDebtFormItem(key)}/>
              :
              null
          }
        </Col>
      </Row>
    ));

    let outsourceInitialValue = [];
    for (let i = 0; i < editSpecialDebt['outsourcings'].length; i++) {
      outsourceInitialValue.push(i);
      outsourceFormItemsId++;
    }
    getFieldDecorator('outSourceFormItemsKeys', { initialValue: outsourceInitialValue });
    const outSourceFormItemsKeys = getFieldValue('outSourceFormItemsKeys');
    const outSourceFormItems = outSourceFormItemsKeys.map((key) => (
      <Row gutter={[150]} type="flex" align="middle" key={`outSourceFormItem${key}`}>
        <Col xl={6} md={10} sm={24}>
          <Form.Item label="????????????">
            {getFieldDecorator(`outSourceUser[${key}]`, {
              initialValue: editSpecialDebt['outsourcings'][key] && editSpecialDebt['outsourcings'][key].user.id,
              rules: [{ required: true, message: '?????????' }],
            })(
              <Select placeholder="?????????" allowClear={true}>
                {usersList.map(item => {
                  return (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col xl={6} md={10} sm={24}>
          <Form.Item label="????????????">
            {getFieldDecorator(`outSourceCategory[${key}]`, {
              initialValue: editSpecialDebt['outsourcings'][key] && editSpecialDebt['outsourcings'][key].category,
              rules: [{ required: true, message: '?????????' }],
            })(
              <Input placeholder="?????????"/>,
            )}
          </Form.Item>
        </Col>
        <Col xl={4} md={10} sm={24}>
          <Form.Item label="????????????">
            {getFieldDecorator(`outSourceContact[${key}]`, {
              initialValue: editSpecialDebt['outsourcings'][key] && editSpecialDebt['outsourcings'][key].contact,
              rules: [{ required: true, message: '?????????' }],
            })(
              <Input placeholder="?????????"/>,
            )}
          </Form.Item>
        </Col>
        <Col xl={8} md={4} sm={24}>
          {
            outSourceFormItemsKeys.length > 0 ?
              <Icon type="minus-circle-o" style={{ marginTop: '14px', fontSize: '1.5rem' }}
                    onClick={() => this.removeOutSourceFormItem(key)}/>
              :
              null
          }
        </Col>
      </Row>
    ));
    return (
      <Spin
        spinning={Boolean(submittingCreatedProcess) || Boolean(loadingProcess) || Boolean(submittingUpdatedProcess)}>
        <Form layout="horizontal">
          <h3>????????????</h3>
          <Row gutter={[150]}>
            <Col xl={12} md={12} sm={24}>
              <Form.Item label="????????????">
                <Input value={editSpecialDebt.origin && editSpecialDebt.origin.name} disabled/>
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                <Input placeholder="?????????" value={editSpecialDebt['category']} disabled/>,
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[150]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('location', { initialValue: editSpecialDebt['location'] })(
                  <Input placeholder="?????????"/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('industry', { initialValue: editSpecialDebt['industry'] })(
                  <Input placeholder="?????????"/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="??????????????????">
                {getFieldDecorator('manager_department', { initialValue: editSpecialDebt['manager_department'] })(
                  <Input placeholder="?????????"/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[150]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('client', { initialValue: editSpecialDebt['client'] })(
                  <Input placeholder="?????????"/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('signatory', { initialValue: editSpecialDebt['signatory'] })(
                  <Input placeholder="?????????"/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[150]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="?????????????????????">
                {getFieldDecorator('invest', { initialValue: editSpecialDebt['invest'] })(
                  <InputNumber min={0} style={{ width: '100%' }}/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????????????????">
                {getFieldDecorator('debt_cash', { initialValue: editSpecialDebt['debt_cash'] })(
                  <InputNumber min={0} style={{ width: '100%' }}/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????????????????">
                {getFieldDecorator('cash', { initialValue: editSpecialDebt['cash'] })(
                  <InputNumber min={0} style={{ width: '100%' }}/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[150]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="??????????????????">
                {getFieldDecorator('period', { initialValue: editSpecialDebt['period'] })(
                  <DatePicker.RangePicker placeholder="?????????"/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[150]}>
            <Col xl={12} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('pay_terms', { initialValue: editSpecialDebt['pay_terms'] })(
                  <Input.TextArea placeholder="?????????" autoSize={{ minRows: 4, maxRows: 4 }}/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <h3>????????????</h3>
          {publishDebtFormItems}
          <Row gutter={[150]}>
            <Col xl={12} md={12} sm={24}>
              <Button type="dashed" block onClick={this.addPublishDebtFormItem}>
                <Icon type="plus"/> ??????
              </Button>
            </Col>
          </Row>
          <Row gutter={[150]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????????????????">
                {getFieldDecorator('debt_total', { initialValue: editSpecialDebt['debt_total'] })(
                  <InputNumber min={0} style={{ width: '100%' }}/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[150]}>
            <Col xl={12} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('debt_remark', { initialValue: editSpecialDebt['debt_remark'] })(
                  <Input.TextArea placeholder="?????????" autoSize={{ minRows: 4, maxRows: 4 }}/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <h3>????????????</h3>
          <Row gutter={[150]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('menber_a', { initialValue: editSpecialDebt['menber_a'] })(
                  <Select mode="multiple" placeholder="?????????" allowClear={true}>
                    {usersList.map(item => {
                      return (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('level', { initialValue: editSpecialDebt['level'] })(
                  <Input placeholder="?????????"/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="???????????????">
                {getFieldDecorator('contact_up', { initialValue: editSpecialDebt['contact_up'] })(
                  <Input placeholder="?????????"/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[150]}>
            <Col xl={12} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('remark_situation', { initialValue: editSpecialDebt['remark_situation'] })(
                  <Input.TextArea placeholder="?????????" autoSize={{ minRows: 4, maxRows: 4 }}/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <h3>????????????</h3>
          <Row gutter={[150]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="???????????????">
                {getFieldDecorator('menber_b', { initialValue: editSpecialDebt['menber_b'] })(
                  <Select mode="multiple" placeholder="?????????" allowClear={true}>
                    {usersList.map(item => {
                      return (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="??????">
                {getFieldDecorator('menber_c', { initialValue: editSpecialDebt['menber_c'] })(
                  <Select mode="multiple" placeholder="?????????" allowClear={true}>
                    {usersList.map(item => {
                      return (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('menber_d', { initialValue: editSpecialDebt['menber_d'] })(
                  <Select mode="multiple" placeholder="?????????" allowClear={true}>
                    {usersList.map(item => {
                      return (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[150]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('start', { initialValue: editSpecialDebt['start'] && moment(editSpecialDebt['start'] * 1000) })(
                  <DatePicker style={{ width: '100%' }}/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('menber_e', { initialValue: editSpecialDebt['menber_e'] })(
                  <Select mode="multiple" placeholder="?????????" allowClear={true}>
                    {usersList.map(item => {
                      return (
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                      );
                    })}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <h3>??????</h3>
          <Row gutter={[150]}>
            <Col xl={12} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('remark', { initialValue: editSpecialDebt['remark'] })(
                  <Input.TextArea placeholder="?????????" autoSize={{ minRows: 4, maxRows: 4 }}/>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <h3>????????????</h3>
          {outSourceFormItems}
          <Row gutter={[150]}>
            <Col xl={12} md={12} sm={24}>
              <Button type="dashed" block onClick={this.addOutSourceFormItem}>
                <Icon type="plus"/> ??????
              </Button>
            </Col>
          </Row>
          <h3>????????????</h3>
          <Row gutter={[150]}>
            <Col xl={12} md={12} sm={24}>
              <Form.Item>
                {getFieldDecorator('fileList', {
                  valuePropName: 'fileList',
                  getValueFromEvent: ({ file }) => [file],
                })(
                  <Upload {...uploadConfig}>
                    <Button block>
                      ???????????? <Icon type="cloud-upload"/>
                    </Button>
                  </Upload>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <h3>?????????????????????</h3>
          <Row gutter={[150]}>
            <Col xl={12} md={12} sm={24}>
              <List itemLayout="horizontal" dataSource={uploadedSummarizeFile}
                    renderItem={(item, index) => (
                      <List.Item
                        key={item.id}
                        // actions={[
                        //   <Button type="link" icon="delete" className="redButton" onClick={() => {
                        //     this.deleteUploadedFile(item);
                        //   }}>
                        //     ??????
                        //   </Button>,
                        // ]}
                      >
                        <a href={getFileURL(item.id)} target="_blank">{item['file_name_local']}</a>
                      </List.Item>
                    )}
              />
            </Col>
          </Row>
          <Row>
            <Button type="primary" onClick={this.submit}>??????</Button>
          </Row>
        </Form>
      </Spin>
    );
  }
}

const WrappedForm = Form.create({ name: 'EditSpecialDebtInfo' })(EditSpecialDebtInfo);

export default withRouter(connect(({ loading, common, editSpecialDebt }) => ({
  submittingCreatedProcess: loading.effects['editSpecialDebt/eCreateEasyProcess'],
  submittingUpdatedProcess: loading.effects['editSpecialDebt/eUpdateEasyProcess'],
  loadingProcess: loading.effects['editSpecialDebt/eGetEasyProcess'],
  usersList: editSpecialDebt.usersList,
  editSpecialDebt: editSpecialDebt.editSpecialDebt,
  uploadedSummarizeFile: editSpecialDebt.uploadedSummarizeFile,
}))(WrappedForm));
