import React from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Button, Table, Pagination, Breadcrumb, Row, Form, Col, Select, Modal, Input, List, Typography } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { getFileURL, selectYearList } from '@/utils/transfer';
import UploadContractArchive from '@/pages/Archive/components/EditContractArchive';
import { TABLE_FOR_MAKING_PROJECT_CATEGORIES } from '../../../config/constant';

class ContractArchive extends React.Component {
  componentDidMount() {
    this.props.dispatch({ type: 'contractArchiveList/eLoadContracts' });
    this.props.dispatch({
      type: 'contractArchiveList/eGetOriginList',
      payload: { page: 1, page_size: 10000 },
    });
  }

  expandedRowRender = (record) => {
    const { attachment, template } = record;
    return (
      <React.Fragment>
        {
          attachment.length > 0 ?
            <List dataSource={attachment} header={<h5>合同文件</h5>} renderItem={item => (
              <List.Item key={item.id}>
                <p>
                  <a href={getFileURL(item.id)} target="_blank">{item['file_name_local']}</a>
                </p>
              </List.Item>
            )}
            />
            : null
        }
        {
          template.length > 0 ?
            <List dataSource={template} header={<h5>合同模板</h5>} renderItem={item => (
              <List.Item key={item.id}>
                <p>
                  <a href={getFileURL(item.id)} target="_blank">{item['file_name_local']}</a>
                </p>
              </List.Item>
            )}
            />
            : null
        }
      </React.Fragment>
    );
  };
  searchContractList = e => {
    const values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'contractArchiveList/rUpdateState',
      payload: { searchParams: { ...values }, staffs: { current: 1, pageSize: 10 } },
    });
    this.props.dispatch({ type: 'contractArchiveList/eLoadContracts' });
    e.preventDefault();
  };
  resetSearch = e => {
    this.props.form.setFieldsValue({
      name: undefined,
      category: undefined,
      settlement: undefined,
      time: undefined,
    });
    const values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'contractArchiveList/rUpdateState',
      payload: { searchParams: { ...values }, staffs: { current: 1, pageSize: 10 } },
    });
    this.props.dispatch({ type: 'contractArchiveList/eLoadContracts' });
    e.preventDefault();
  };
  showUploadContractArchive = () => {
    this.props.dispatch({
      type: 'contractArchiveList/rUpdateState',
      payload: {
        isEditing: false,
        editContractArchiveVisible: true,
      },
    });
  };
  showEditContractArchive = record => {
    this.props.dispatch({
      type: 'contractArchiveList/rUpdateState',
      payload: {
        isEditing: true,
        editContractArchiveVisible: true,
        editContractArchive: record,
      },
    });
  };
  showDeleteConfirm = ({ id, name }) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定删除此档案',
      content: <p>合同档案 <b>《{name}》</b> 删除后将无法恢复</p>,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({ type: 'contractArchiveList/eDeleteContractArchive', id });
      },
    });
  };
  contractArchivesPaginationChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'contractArchiveList/eLoadContracts',
      payload: { page, page_size: pageSize },
    });
  };

  render() {
    const { form, fetchingContractArchives, deletingContractArchive, routes, searchParams, total, current, pageSize, contractArchiveList } = this.props;
    return (
      <React.Fragment>
        <div className="headerWrapperWithCreate">
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
          <Button icon="plus-circle" onClick={this.showUploadContractArchive}>上传</Button>
        </div>
        <UploadContractArchive/>
        <div className="contentWrapper">
          <h3>合同筛选</h3>
          <Form layout="horizontal" className="searchWrapper">
            <Row gutter={[80]}>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="合同名称">
                  {form.getFieldDecorator('name', {
                    initialValue: searchParams['name'],
                  })(
                    <Input placeholder="请输入"/>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="档案类型">
                  {form.getFieldDecorator('category', {
                    initialValue: searchParams['category'],
                  })(
                    <Select placeholder="请选择" allowClear>
                      {TABLE_FOR_MAKING_PROJECT_CATEGORIES.map(item =>
                        <Select.Option key={item} value={item}>{item}</Select.Option>,
                      )}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="是否结算">
                  {form.getFieldDecorator('settlement', {
                    initialValue: searchParams['settlement'],
                  })(
                    <Select placeholder="请选择" allowClear>
                      <Select.Option key="已结算" value="已结算">已结算</Select.Option>
                      <Select.Option key="未结算" value="未结算">未结算</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="合同年份">
                  {form.getFieldDecorator('time', {
                    initialValue: searchParams['time'],
                  })(
                    <Select allowClear>
                      {_.map(selectYearList, item => <Select.Option key={item} value={item}>{item}</Select.Option>)}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <div className="searchButtons">
                  <Button type="primary" onClick={this.searchContractList}>搜索</Button>
                  <Button style={{ marginLeft: '1em' }} onClick={this.resetSearch}>重置</Button>
                </div>
              </Col>
            </Row>
          </Form>
          <h3>合同列表</h3>
          <Table tableLayout="fixed" size="middle" pagination={false} dataSource={contractArchiveList}
                 expandedRowRender={this.expandedRowRender}
                 loading={fetchingContractArchives || deletingContractArchive} rowKey={record => record.id}
                 rowClassName={(record, index) => {
                   if (index % 2 === 1) {
                     return 'zebraHighlight';
                   }
                 }}>
            <Table.Column title="编号" dataIndex="number" width={100} render={(text, record) => (
              <span>
                {
                  text ?
                    record.time ? moment(record.time * 1000).get('year') + '-' + text : text
                    :
                    ''
                }
              </span>
            )}/>
            <Table.Column title="合同名称" dataIndex="name" width={300}/>
            <Table.Column title="关联项目" dataIndex="origin" width={300}
                          render={(origin) => (
                            origin &&
                            <a target="_blank" href={`/approvalProject/profile/${origin.id}`}>{origin.name}</a>
                          )}/>
            <Table.Column title="档案类型" dataIndex="category" width={150}/>
            <Table.Column title="结算情况" dataIndex="settlement" width={80}/>
            <Table.Column title="合同金额（元）" dataIndex="cash" width={110}/>
            <Table.Column title="操作" dataIndex="action" width={120}
                          render={(text, record) => (
                            <div className="actionGroup">
                              <Button type="link" icon="edit" onClick={() => this.showEditContractArchive(record)}>
                                修改
                              </Button>
                              <Button type="link" icon="delete" className="redButton"
                                      onClick={() => this.showDeleteConfirm(record)}>
                                删除
                              </Button>
                            </div>
                          )}/>
          </Table>
          <div className="paginationWrapper">
            <Pagination showQuickJumper total={total} current={current} pageSize={pageSize}
                        showTotal={() => `共 ${total} 条`}
                        onChange={this.contractArchivesPaginationChange}/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const WrappedForm = Form.create({ name: 'ContractArchive' })(ContractArchive);

export default connect(({ loading, common, contractArchiveList }) => ({
  fetchingContractArchives: loading.effects['contractArchiveList/eLoadContracts'],
  deletingContractArchive: loading.effects['contractArchiveList/eDeleteContractArchive'],
  level: common.mine.level,
  routes: contractArchiveList.routes,
  searchParams: contractArchiveList.searchParams,
  total: contractArchiveList.contractArchives.total,
  current: contractArchiveList.contractArchives.current,
  pageSize: contractArchiveList.contractArchives.pageSize,
  contractArchiveList: contractArchiveList.contractArchives.list,
}))(WrappedForm);
