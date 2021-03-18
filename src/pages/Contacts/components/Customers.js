import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Table, Form, Input, Pagination, Modal, Tag } from 'antd';
import CustomerProfileModal from './CustomerProfileModal';

class Customers extends React.Component {

  componentDidMount() {
    this.props.dispatch({ type: 'contactsList/eLoadCustomers' });
  }

  searchCustomerList = e => {
    const values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'contactsList/rUpdateState',
      payload: { searchParamsCustomer: { ...values }, customers: { current: 1, pageSize: 10 } },
    });
    this.props.dispatch({ type: 'contactsList/eLoadCustomers' });
    e.preventDefault();
  };
  resetSearch = e => {
    this.props.form.setFieldsValue({
      name: undefined,
      area: undefined,
      company: undefined,
    });
    const values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'contactsList/rUpdateState',
      payload: { searchParamsCustomer: { ...values }, customers: { current: 1, pageSize: 10 } },
    });
    this.props.dispatch({ type: 'contactsList/eLoadCustomers' });
    e.preventDefault();
  };
  showEditForm = (record) => {
    this.props.dispatch({
      type: 'contactsList/rUpdateState',
      payload: {
        editCustomerModalVisible: true,
        editCustomerForm: { ...record },
      },
    });
  };

  deleteCustomer = ({ id, name }) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定删除此客户信息', content: `若客户 ${name} 有关联的项目，将导致删除失败`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({ type: 'contactsList/eDeleteCustomer', id });
      },
    });
  };
  customersPaginationChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'contactsList/eLoadCustomers',
      payload: { page, page_size: pageSize },
    });
  };

  render() {
    const { form: { getFieldDecorator }, fetchingCustomers, deletingCustomer, mine, searchParamsCustomer, total, current, pageSize, customersList } = this.props;
    return (
      <React.Fragment>
        <CustomerProfileModal/>
        <h3>客户搜索</h3>
        <Form layout="horizontal" className="searchWrapper">
          <Row gutter={[80]}>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="姓名">
                {getFieldDecorator('name', { initialValue: searchParamsCustomer['name'] })(
                  <Input placeholder="请输入"/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="地区">
                {getFieldDecorator('area', { initialValue: searchParamsCustomer['area'] })(
                  <Input placeholder="请输入"/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <Form.Item label="公司名称">
                {getFieldDecorator('company', { initialValue: searchParamsCustomer['company'] })(
                  <Input placeholder="请输入"/>,
                )}
              </Form.Item>
            </Col>
            <Col xl={6} md={12} sm={24}>
              <div className="searchButtons">
                <Button type="primary" onClick={this.searchCustomerList}>搜索</Button>
                <Button style={{ marginLeft: '1em' }} onClick={this.resetSearch}>重置</Button>
              </div>
            </Col>
          </Row>
        </Form>
        <h3 style={{ marginBottom: '2em' }}>客户列表</h3>
        <Table size="middle" tableLayout="fixed" pagination={false} dataSource={customersList}
               loading={fetchingCustomers || deletingCustomer} rowKey={record => record.id}>
          <Table.Column title="姓名" dataIndex="name" render={(name, record) => (
            <Button type="link" onClick={() => {
              this.props.dispatch({
                type: 'contactsList/rUpdateState',
                payload: { customerProfileModalVisible: true, customerProfile: record },
              });
            }}>
              {name}
            </Button>
          )}/>
          <Table.Column title="性别" dataIndex="gender" render={(text) => (<span>{text === 'male' ? '男' : '女'}</span>)}/>
          <Table.Column title="地区" dataIndex="area"/>
          <Table.Column title="公司及职务" dataIndex="companyAndJob"
                        render={(text, record) => (
                          <React.Fragment>
                            <span>{record['company']} </span>
                            <span>{record['job_title']}</span>
                          </React.Fragment>
                        )}/>
          <Table.Column title="手机号码" dataIndex="phone"/>
          <Table.Column title="微信" dataIndex="wx"/>
          <Table.Column title="邮箱" dataIndex="email"/>
          <Table.Column title="状态" dataIndex="private"
                        render={text => (text ? <Tag color="green">不公开</Tag> : <Tag color="orange">公开</Tag>)}/>
          <Table.Column title="创建人" dataIndex="creator" render={(creator) => creator.name}/>
          <Table.Column title="操作" dataIndex="action"
                        render={(text, record) => (
                          <div className="actionGroup">
                            <Button type="link" icon="edit"
                                    disabled={!(record['creator']['id'] === mine['id'] || mine.level > 1)}
                                    onClick={() => {
                                      this.showEditForm(record);
                                    }}>
                              修改
                            </Button>
                            <Button type="link" icon="delete"
                                    className={!(record['creator']['id'] === mine['id'] || mine.level > 1) ? 'disabledRedButton' : 'redButton'}
                                    disabled={!(record['creator']['id'] === mine['id'] || mine.level > 1)}
                                    onClick={() => {
                                      this.deleteCustomer(record);
                                    }}>
                              删除
                            </Button>
                          </div>
                        )}/>
        </Table>
        <div className="paginationWrapper">
          <Pagination showQuickJumper defaultCurrent={1} total={total} current={current} pageSize={pageSize}
                      showTotal={() => `共 ${total} 条`} onChange={this.customersPaginationChange}/>
        </div>
      </React.Fragment>
    );
  }
}

const WrappedForm = Form.create({ name: 'Customers' })(Customers);

export default connect(({ loading, common, contactsList }) => ({
  fetchingCustomers: loading.effects['contactsList/eLoadCustomers'],
  deletingCustomer: loading.effects['contactsList/eDeleteCustomer'],
  mine: common.mine,
  searchParamsCustomer: contactsList.searchParamsCustomer,
  total: contactsList.customers.total,
  current: contactsList.customers.current,
  pageSize: contactsList.customers.pageSize,
  customersList: contactsList.customers.list,
}))(WrappedForm);
