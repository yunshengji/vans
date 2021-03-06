import React from 'react';
import { Link, withRouter } from 'umi';
import { connect } from 'dva';
import {
  Spin, Col, Form, Input, Row, Icon, Button, InputNumber, Select, DatePicker, Upload, message, List,
  Breadcrumb,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { getFileURL } from '@/utils/transfer';

class EditStaff extends React.Component {

  componentDidMount() {
    this.props.dispatch({ type: 'editStaff/eGetDepartments' });
    this.props.dispatch({ type: 'editStaff/eGetUsers' });
    const { match: { path, params } } = this.props;
    if (path === '/staff/edit/:id') {
      this.props.dispatch({
        type: 'editStaff/eGetStaff',
        id: params['id'],
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'editStaff/rUpdateState',
      payload: {
        staff: {},
        uploadIDCardFrontFile: null,
        uploadIDCardFrontPreview: null,
        uploadIDCardBackFile: null,
        uploadIDCardBackPreview: null,
        uploadDiplomaFile: null,
        uploadDiplomaPreview: null,
        uploadedContractFiles: [],
        uploadedCertificateFiles: [],
      },
    });
  }

  deleteUploadedFile = (item) => {
    const { uploadedContractFiles } = this.props;
    this.props.dispatch({
      type: 'editStaff/rUpdateState',
      payload: {
        uploadedContractFiles: _.filter(uploadedContractFiles, (value) => value.id !== item.id),
      },
    });
  };
  deleteUploadedCertificateFile = (item) => {
    const { uploadedCertificateFiles } = this.props;
    this.props.dispatch({
      type: 'editStaff/rUpdateState',
      payload: {
        uploadedCertificateFiles: _.filter(uploadedCertificateFiles, (value) => value.id !== item.id),
      },
    });
  };
  submit = () => {
    const { dispatch, form, match: { path, params } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (path === '/staff/edit') {
          dispatch({ type: 'editStaff/eCreateStaff', payload: { ...values } });
        }
        if (path === '/staff/edit/:id') {
          const { id } = params;
          dispatch({ type: 'editStaff/eUpdateStaff', id, form, payload: { ...values } });
        }
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue, setFieldsValue }, match: { path }, dispatch, routes,
      loadingDepartments, loadingStaff, submittingCreatedStaff, submittingUpdatedStaff,
      departments, users, staff, uploadIDCardFrontPreview, uploadIDCardBackPreview, uploadDiplomaPreview, uploadedContractFiles, uploadedCertificateFiles,
    } = this.props;

    const generateUploadConfig = (fileName, filePreviewName) => {
      return {
        showUploadList: false,
        multiple: false,
        beforeUpload: file => {
          const reader = new FileReader();
          const isImage = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/svg';
          if (!isImage) {
            message.warn('??????????????? PNG JPG JPEG SVG GIF ??????!');
            return false;
          }
          reader.readAsDataURL(file);
          reader.onload = e => {
            dispatch({
              type: 'editStaff/rUpdateState',
              payload: {
                [fileName]: file,
                [filePreviewName]: e.target.result,
              },
            });
          };
          return false;
        },
      };
    };
    const uploadIDCardFront = generateUploadConfig('uploadIDCardFrontFile', 'uploadIDCardFrontPreview');
    const uploadIDCardBack = generateUploadConfig('uploadIDCardBackFile', 'uploadIDCardBackPreview');
    const uploadDiploma = generateUploadConfig('uploadDiplomaFile', 'uploadDiplomaPreview');
    const uploadContracts = {
      showUploadList: true,
      multiple: true,
      beforeUpload: () => false,
      onRemove: file => {
        const contract = getFieldValue('contract');
        contract.splice(contract.indexOf(file), 1);
        setFieldsValue({ contract });
      },
    };

    return (
      <React.Fragment>
        <div className='headerWrapper'>
          <Breadcrumb>
            {routes.map((item, index) => {
              const { path, breadcrumbName } = item;
              if (path) {
                return (
                  <Breadcrumb.Item key={index}>
                    <Link to={path}>{breadcrumbName}</Link>
                  </Breadcrumb.Item>
                );
              } else {
                return (
                  <Breadcrumb.Item key={index}>
                    <span>{breadcrumbName}</span>
                  </Breadcrumb.Item>
                );
              }
            })}
          </Breadcrumb>
        </div>
        <div className="contentWrapper">
          <Spin spinning={Boolean(loadingStaff)}>
            <Form layout="horizontal">
              <h3>????????????</h3>
              <Row gutter={[150]}>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="??????">
                    {getFieldDecorator('name', {
                      initialValue: staff.name,
                      rules: [{ required: true, message: '???????????????' }],
                    })(
                      <Input placeholder="?????????"/>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={6} md={12} sm={24}>
                  <Spin spinning={Boolean(loadingDepartments)}>
                    <Form.Item label="??????">
                      {getFieldDecorator('department', { initialValue: staff.department })(
                        <Select placeholder="?????????" allowClear={true}>
                          {departments.map(item => {
                            return (
                              <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            );
                          })}
                        </Select>,
                      )}
                    </Form.Item>
                  </Spin>
                </Col>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="??????/??????">
                    {getFieldDecorator('recruit', { initialValue: staff['recruit'] })(
                      <Select placeholder="?????????" allowClear={true}>
                        <Select.Option key="??????" value="??????">??????</Select.Option>
                        <Select.Option key="??????" value="??????">??????</Select.Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[150]}>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="??????">
                    {getFieldDecorator('position', { initialValue: staff.position })(
                      <Input placeholder="?????????"/>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="????????????">
                    {getFieldDecorator('status', { initialValue: staff.status })(
                      <Select placeholder="?????????" allowClear={true}>
                        <Select.Option key="??????" value="??????">??????</Select.Option>
                        <Select.Option key="?????????" value="?????????">?????????</Select.Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="????????????">
                    {getFieldDecorator('phone', { initialValue: staff.phone })(
                      <Input placeholder="?????????"/>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[150]}>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="????????????">
                    {getFieldDecorator('number', { initialValue: staff.number })(
                      <Input placeholder="?????????"/>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="????????????">
                    {getFieldDecorator('address', { initialValue: staff.address })(
                      <Input placeholder="?????????"/>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="????????????">
                    {getFieldDecorator('entry_time', { initialValue: staff['entry_time'] && moment(staff['entry_time'] * 1000) })(
                      <DatePicker style={{ width: '100%' }}/>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[150]}>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="????????????">
                    {getFieldDecorator('user', { initialValue: staff.user && staff.user.id })(
                      <Select placeholder="?????????" allowClear={true}
                              showSearch
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }>
                        {users.map(item => {
                          return (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                          );
                        })}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <h3>????????????</h3>
              <Row gutter={[150]}>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="???????????????">
                    {getFieldDecorator('salary', { initialValue: staff['salary'] })(
                      <InputNumber min={0} style={{ width: '100%' }}/>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="???????????????">
                    {getFieldDecorator('social_security', { initialValue: staff['social_security'] })(
                      <InputNumber min={0} style={{ width: '100%' }}/>,
                    )}
                  </Form.Item>
                </Col>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="??????????????????">
                    {getFieldDecorator('reserved_funds', { initialValue: staff['reserved_funds'] })(
                      <InputNumber min={0} style={{ width: '100%' }}/>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <h3>????????????</h3>
              <Row gutter={[150]}>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="???????????????">
                    <Upload.Dragger {...uploadIDCardFront}>
                      {
                        uploadIDCardFrontPreview &&
                        <img src={uploadIDCardFrontPreview} style={{ width: '100%' }}/>
                      }
                      {
                        !uploadIDCardFrontPreview && staff['credentials_front'] &&
                        <img src={getFileURL(staff['credentials_front']['id'])} style={{ width: '100%' }}/>
                      }
                      {
                        !uploadIDCardFrontPreview && !staff['credentials_front'] &&
                        <div style={{ padding: '3em 0' }}>
                          <p className="ant-upload-drag-icon">
                            <img src="/staff/?????????-???.svg" style={{ width: '30%' }}/>
                          </p>
                          <p>???????????????????????????</p>
                        </div>
                      }
                    </Upload.Dragger>
                  </Form.Item>
                </Col>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="???????????????">
                    <Upload.Dragger {...uploadIDCardBack}>
                      {
                        uploadIDCardBackPreview &&
                        <img src={uploadIDCardBackPreview} style={{ width: '100%' }}/>
                      }
                      {
                        !uploadIDCardBackPreview && staff['credentials_back'] &&
                        <img src={getFileURL(staff['credentials_back']['id'])} style={{ width: '100%' }}/>
                      }
                      {
                        !uploadIDCardBackPreview && !staff['credentials_back'] &&
                        <div style={{ padding: '3em 0' }}>
                          <p className="ant-upload-drag-icon">
                            <img src="/staff/?????????-???.svg" style={{ width: '30%' }}/>
                          </p>
                          <p>???????????????????????????</p>
                        </div>
                      }
                    </Upload.Dragger>
                  </Form.Item>
                </Col>
                <Col xl={6} md={12} sm={24}>
                  <Form.Item label="????????????">
                    <Upload.Dragger {...uploadDiploma}>
                      {
                        uploadDiplomaPreview &&
                        <img src={uploadDiplomaPreview} style={{ width: '100%' }}/>
                      }
                      {
                        !uploadDiplomaPreview && staff['diploma'] &&
                        <img src={getFileURL(staff['diploma']['id'])} style={{ width: '100%' }}/>
                      }
                      {
                        !uploadDiplomaPreview && !staff['diploma'] &&
                        <div style={{ padding: '3em 0' }}>
                          <p className="ant-upload-drag-icon">
                            <img src="/staff/??????.svg" style={{ width: '30%' }}/>
                          </p>
                          <p>???????????????????????????</p>
                        </div>
                      }
                    </Upload.Dragger>
                  </Form.Item>
                </Col>
              </Row>
              <h3>????????????</h3>
              <Row gutter={[150]}>
                <Col xl={12} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('certificate_other', {
                      valuePropName: 'fileList',
                      getValueFromEvent: ({ file, fileList }) => fileList,
                    })(
                      <Upload {...uploadContracts}>
                        <Button block>
                          ???????????? <Icon type="cloud-upload"/>
                        </Button>
                      </Upload>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {
                path === '/staff/edit/:id' &&
                <React.Fragment>
                  <h4>????????????????????????</h4>
                  <Row gutter={[150]}>
                    <Col xl={12} md={12} sm={24}>
                      <List itemLayout="horizontal" dataSource={uploadedCertificateFiles}
                            renderItem={(item, index) => (
                              <List.Item
                                key={item.id}
                                actions={[
                                  <Button type="link" icon="delete" className="redButton"
                                          onClick={() => this.deleteUploadedCertificateFile(item)}>
                                    ??????
                                  </Button>]}
                              >
                                <a href={getFileURL(item.id)} target="_blank">{item['file_name_local']}</a>
                              </List.Item>
                            )}
                      />
                    </Col>
                  </Row>
                </React.Fragment>
              }
              <h3>????????????</h3>
              <Row gutter={[150]}>
                <Col xl={12} md={12} sm={24}>
                  <Form.Item>
                    {getFieldDecorator('contract', {
                      valuePropName: 'fileList',
                      getValueFromEvent: ({ file, fileList }) => fileList,
                    })(
                      <Upload {...uploadContracts}>
                        <Button block>
                          ???????????? <Icon type="cloud-upload"/>
                        </Button>
                      </Upload>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {
                path === '/staff/edit/:id' &&
                <React.Fragment>
                  <h4>????????????????????????</h4>
                  <Row gutter={[150]}>
                    <Col xl={12} md={12} sm={24}>
                      <List itemLayout="horizontal" dataSource={uploadedContractFiles}
                            renderItem={(item, index) => (
                              <List.Item
                                key={item.id}
                                actions={[
                                  <Button type="link" icon="delete" className="redButton"
                                          onClick={() => this.deleteUploadedFile(item)}>
                                    ??????
                                  </Button>]}
                              >
                                <a href={getFileURL(item.id)} target="_blank">{item['file_name_local']}</a>
                              </List.Item>
                            )}
                      />
                    </Col>
                  </Row>
                </React.Fragment>
              }
              <Row>
                <Button type="primary" onClick={this.submit} loading={submittingCreatedStaff || submittingUpdatedStaff}>
                  ??????
                </Button>
              </Row>
            </Form>
          </Spin>
        </div>
      </React.Fragment>
    );
  }
}

const WrappedForm = Form.create({ name: 'EditStaff' })(EditStaff);

export default withRouter(connect(({ loading, common, editStaff }) => ({
  loadingDepartments: loading.effects['editStaff/eGetDepartments'],
  submittingCreatedStaff: loading.effects['editStaff/eCreateStaff'],
  submittingUpdatedStaff: loading.effects['editStaff/eUpdateStaff'],
  loadingStaff: loading.effects['editStaff/eGetStaff'],
  routes: editStaff.routes,
  departments: editStaff.departments,
  users: editStaff.users,
  staff: editStaff.staff,
  uploadIDCardFrontPreview: editStaff.uploadIDCardFrontPreview,
  uploadIDCardBackPreview: editStaff.uploadIDCardBackPreview,
  uploadDiplomaPreview: editStaff.uploadDiplomaPreview,
  uploadedCertificateFiles: editStaff.uploadedCertificateFiles,
  uploadedContractFiles: editStaff.uploadedContractFiles,
}))(WrappedForm));
