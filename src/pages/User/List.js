import React from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Button, Table, Pagination, Breadcrumb, Tag, Form, Row, Col, Avatar, Select, Input } from 'antd';
import CreateUserModal from '@/pages/User/components/CreateUserModal';
import EditUserModal from '@/pages/User/components/EditUserModal';
import { USER_LEVEL } from '../../../config/constant';
import { getFileURL } from '@/utils/transfer';

class UsersList extends React.Component {

  componentDidMount() {
    this.props.dispatch({
      type: 'userList/eGetDepartments',
      payload: { page_size: 10000 },
    });
    this.props.dispatch({ type: 'userList/eLoadUsers', payload: {} });
  }

  searchUserList = e => {
    const values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'userList/rUpdateState',
      payload: { searchParams: { ...values }, users: { current: 1, pageSize: 10 } },
    });
    this.props.dispatch({ type: 'userList/eLoadUsers' });
    e.preventDefault();
  };
  resetSearch = e => {
    this.props.form.setFieldsValue({
      name: undefined,
      department: undefined,
      level: undefined,
    });
    const values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'userList/rUpdateState',
      payload: { searchParams: { ...values }, users: { current: 1, pageSize: 10 } },
    });
    this.props.dispatch({ type: 'userList/eLoadUsers' });
    e.preventDefault();
  };
  showCreateUserModal = () => {
    this.props.dispatch({
      type: 'userList/rUpdateState',
      payload: { createUserModalVisible: true },
    });
  };
  showEditUserModal = (record) => {
    this.props.dispatch({
      type: 'userList/rUpdateState',
      payload: {
        editUserModalVisible: true,
        editUser: { ...record },
      },
    });
  };
  usersPaginationChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'userList/eLoadUsers',
      payload: { page, page_size: pageSize },
    });
  };

  render() {
    const { form: { getFieldDecorator }, fetchingUsers, routes, departments, searchParams, mine, total, current, pageSize, users } = this.props;
    return (
      <React.Fragment>
        <CreateUserModal/>
        <EditUserModal/>
        <div
          className={(mine.level === 9 || (mine.level > 1 && mine.department.name === '运营部')) ? 'headerWrapperWithCreate' : 'headerWrapper'}>
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
          {
            (mine.level === 9 || (mine.level > 1 && mine.department.name === '运营部'))
            &&
            <Button icon="plus-circle" onClick={this.showCreateUserModal}>创建用户</Button>
          }
        </div>
        <div className="contentWrapper">
          <h3>用户搜索</h3>
          <Form layout="horizontal" className="searchWrapper">
            <Row gutter={[80]}>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="姓名">
                  {getFieldDecorator('name', { initialValue: searchParams['name'] })(
                    <Input placeholder="请输入"/>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="部门">
                  {getFieldDecorator('department', { initialValue: searchParams['department'] })(
                    <Select placeholder="请选择" allowClear>
                      {departments.map(item =>
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>,
                      )}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="用户权限">
                  {getFieldDecorator('level', { initialValue: searchParams['level'] })(
                    <Select placeholder="请选择" allowClear>
                      {USER_LEVEL.map(item =>
                        <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>,
                      )}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <div className="searchButtons">
                  <Button type="primary" onClick={this.searchUserList}>搜索</Button>
                  <Button style={{ marginLeft: '1em' }} onClick={this.resetSearch}>重置</Button>
                </div>
              </Col>
            </Row>
          </Form>
          <h3>用户列表</h3>
          <Table tableLayout="fixed" size="middle" pagination={false} dataSource={users}
                 loading={fetchingUsers} rowKey={record => record.id}
                 rowClassName={(record, index) => {
                   if (index % 2 === 1) {
                     return 'zebraHighlight';
                   }
                 }}>
            <Table.Column title="头像" dataIndex="avatar" render={(text, record) => (
              <Avatar shape="square" size={64} icon="user"  src={getFileURL(text)}/>
            )} />
            <Table.Column title="姓名" dataIndex="name" />
            <Table.Column title="部门" dataIndex="department" render={(text, record) => (
              <React.Fragment>
                {text.name}
              </React.Fragment>
            )}/>
            <Table.Column title="权限" dataIndex="level" render={(text, record) => (
              <React.Fragment>
                {text === 9 && <Tag color="red">管理员</Tag>}
                {text === 2 && <Tag color="blue">主管</Tag>}
                {text === 1 && <Tag>普通</Tag>}
              </React.Fragment>
            )}/>
            <Table.Column title="手机号码" dataIndex="phone"/>
            <Table.Column title="邮箱" dataIndex="email"/>
            <Table.Column title="状态" dataIndex="alive" render={(text, record) => (
              <React.Fragment>
                {text ? <Tag color="green">在职</Tag> : <Tag color="orange">离职</Tag>}
              </React.Fragment>
            )}/>
            {
              (mine.level === 9 || (mine.level > 1 && mine.department.name === '运营部')) &&
              <Table.Column title="操作" dataIndex="action" width={150}
                            render={(text, record) => (
                              <Button disabled={record.level === 9} type="link" icon="edit"
                                      onClick={() => this.showEditUserModal(record)}>
                                编辑
                              </Button>
                            )}/>
            }
          </Table>
          <div className="paginationWrapper">
            <Pagination showQuickJumper total={total} current={current} pageSize={pageSize}
                        showTotal={() => `共 ${total} 条`}
                        onChange={this.usersPaginationChange}/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const WrappedForm = Form.create({ name: 'UsersList' })(UsersList);

export default connect(({ loading, common, userList }) => ({
  fetchingUsers: loading.effects['userList/eLoadUsers'],
  routes: userList.routes,
  mine: common.mine,
  createUserModalVisible: userList.createUserModalVisible,
  departments: userList.departments,
  searchParams: userList.searchParams,
  total: userList.users.total,
  current: userList.users.current,
  pageSize: userList.users.pageSize,
  users: userList.users.list,
}))(WrappedForm);
