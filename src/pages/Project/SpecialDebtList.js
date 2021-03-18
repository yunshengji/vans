import React from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import {
  Button,
  Breadcrumb,
  Form,
  Row,
  Col,
  Input,
  Table,
  Pagination,
  Modal,
  Dropdown,
  Menu,
  Icon, Tag,
} from 'antd';

class SpecialDebtList extends React.Component {
  componentDidMount() {
    const { dispatch, current, pageSize } = this.props;
    dispatch({
      type: 'specialDebtList/eLoadSpecialDebtList',
      payload: { page: current, page_size: pageSize },
    });
  }

  searchSpecialDebtList = e => {
    const values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'specialDebtList/rUpdateState',
      payload: { searchParams: { ...values }, specialDebtList: { current: 1, pageSize: 10 } },
    });
    this.props.dispatch({ type: 'specialDebtList/eLoadSpecialDebtList' });
    e.preventDefault();
  };
  resetSearch = e => {
    this.props.form.setFieldsValue({
      name: undefined,
      location: undefined,
    });
    const values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'specialDebtList/rUpdateState',
      payload: { searchParams: { ...values }, specialDebtList: { current: 1, pageSize: 10 } },
    });
    this.props.dispatch({ type: 'specialDebtList/eLoadSpecialDebtList' });
    e.preventDefault();
  };
  changeStatus = ({ id, status }, updatedStatus) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定修改', content: <p>确定将项目状态修改为 <b>{updatedStatus}</b></p>,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (updatedStatus !== status) {
          dispatch({ type: 'specialDebtList/eUpdateSpecialDebtStatus', id, payload: { status: updatedStatus } });
        }
      },
    });
  };
  paginationChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'specialDebtList/eLoadSpecialDebtList',
      payload: { page, page_size: pageSize },
    });
  };

  render() {
    const { form: { getFieldDecorator }, fetchingSpecialDebtList, routes, searchParams, total, current, pageSize, specialDebtList } = this.props;
    return (
      <React.Fragment>
        <div className="headerWrapper">
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
          <h3 style={{ marginTop: '1em' }}>专项债搜索</h3>
          <Form layout="horizontal" className="searchWrapper">
            <Row gutter={[80]}>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="项目名称">
                  {getFieldDecorator('name', { initialValue: searchParams['name'] })(
                    <Input placeholder="请输入"/>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="项目地区">
                  {getFieldDecorator('location', { initialValue: searchParams['location'] })(
                    <Input placeholder="请输入"/>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <div className="searchButtons">
                  <Button type="primary" onClick={this.searchSpecialDebtList}>搜索</Button>
                  <Button style={{ marginLeft: '1em' }} onClick={this.resetSearch}>重置</Button>
                </div>
              </Col>
            </Row>
          </Form>
          <h3 style={{ marginBottom: '2em' }}>专项债项目</h3>
          <Table size="middle" tableLayout="fixed" pagination={false} dataSource={specialDebtList}
                 loading={fetchingSpecialDebtList} rowKey={record => record.id}
                 rowClassName={(record, index) => {
                   if (index % 2 === 1) {
                     return 'zebraHighlight';
                   }
                 }}>
            <Table.Column title="项目名称" dataIndex="name"/>
            <Table.Column title="项目状态" dataIndex="status" width={150} render={(status, record) => (
              (true === true) ?
                <Dropdown trigger={['click']} overlay={
                  <Menu>
                    <Menu.Item onClick={() => this.changeStatus(record, '执行中')}>执行中</Menu.Item>
                    <Menu.Item onClick={() => this.changeStatus(record, '已完结')}>已完结</Menu.Item>
                    <Menu.Item onClick={() => this.changeStatus(record, '已废弃')}>已废弃</Menu.Item>
                  </Menu>
                }>
                  <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    {status} <Icon type="down"/>
                  </a>
                </Dropdown>
                :
                <React.Fragment>
                  {status === '执行中' && <Tag color="blue">{status}</Tag>}
                  {status === '已废弃' && <Tag color="orange">{status}</Tag>}
                  {status === '已完结' && <Tag color="green">{status}</Tag>}
                </React.Fragment>
            )}/>
            <Table.Column title="操作" dataIndex="action" width={100}
                          render={(text, record) => (
                            <div className="actionGroup">
                              <Button type="link" icon="edit"
                                      onClick={() => window.location.href = `/specialDebt/edit/${record.id}`}>
                                修改
                              </Button>
                            </div>
                          )}/>
          </Table>
          <div className="paginationWrapper">
            <Pagination showQuickJumper defaultCurrent={1} total={total} current={current} pageSize={pageSize}
                        showTotal={() => `共 ${total} 条`} onChange={this.paginationChange}/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const WrappedForm = Form.create({ name: 'SpecialDebtList' })(SpecialDebtList);

export default connect(({ loading, common, specialDebtList }) => ({
  fetchingSpecialDebtList: loading.effects['specialDebtList/eLoadSpecialDebtList'],
  routes: specialDebtList.routes,
  mine: common.mine,
  searchParams: specialDebtList.searchParams,
  total: specialDebtList.specialDebtList.total,
  current: specialDebtList.specialDebtList.current,
  pageSize: specialDebtList.specialDebtList.pageSize,
  specialDebtList: specialDebtList.specialDebtList.list,
}))(WrappedForm);
