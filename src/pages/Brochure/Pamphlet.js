import React from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Button, Table, Pagination, Breadcrumb, Form, Modal } from 'antd';
import moment from 'moment';
import UploadPamphlet from '@/pages/Brochure/components/UploadPamphlet';
import { getFileURL } from '@/utils/transfer';

class Pamphlet extends React.Component {
  componentDidMount() {
    const { dispatch, current, pageSize } = this.props;
    dispatch({
      type: 'pamphletList/eGetPamphlets',
      payload: { page: current, page_size: pageSize },
    });
  }

  showUploadPamphletsModal = () => {
    this.props.dispatch({
      type: 'pamphletList/rUpdateState',
      payload: { uploadPamphletsModalVisible: true },
    });
  };
  showDeleteConfirm = ({ id, attachment: { file_name_local } }) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确定删除此宣传册',
      content: <p>文件 <b>《{file_name_local}》</b> 删除后将无法恢复</p>,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({ type: 'pamphletList/eDeletePamphlet', id });
      },
    });
  };
  pamphletsPaginationChange = (page, pageSize) => {
    const values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'pamphletList/eGetPamphlets',
      payload: { page, page_size: pageSize, ...values },
    });
  };

  render() {
    const {  fetchingPamphlets, deletingPamphlet, routes, level, total, current, pageSize, pamphletList } = this.props;
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
          <Button icon="plus-circle" onClick={this.showUploadPamphletsModal}>上传</Button>
        </div>
        <UploadPamphlet/>
        <div className="contentWrapper">
          <h3>宣传册列表</h3>
          <Table tableLayout="fixed" size="middle" pagination={false} dataSource={pamphletList}
                 loading={fetchingPamphlets || deletingPamphlet} rowKey={record => record.id}>
            <Table.Column title="文件名" dataIndex="attachment" render={(text, record) => (
              <a href={getFileURL(record['attachment']['id'])}
                 target="_blank">{record['attachment']['file_name_local']}</a>
            )}/>
            <Table.Column title="类别" dataIndex="category" render={text => (<b>{text}</b>)}/>
            <Table.Column title="上传者" dataIndex="creator" render={(text, record) => (
              <React.Fragment>{record['attachment']['creator']['name']}</React.Fragment>)}/>
            <Table.Column title="上传时间" dataIndex="created_at"
                          render={text => (
                            <React.Fragment>{moment(text * 1000).format('YYYY-MM-DD')}</React.Fragment>)}/>
            {
              level > 1 &&
              <Table.Column title="操作" dataIndex="action"
                            render={(text, record) => (
                              <div className="actionGroup">
                                <Button type="link" icon="delete" className="redButton"
                                        onClick={() => {
                                          this.showDeleteConfirm(record);
                                        }}>
                                  删除
                                </Button>
                              </div>
                            )}/>
            }
          </Table>
          <div className="paginationWrapper">
            <Pagination showQuickJumper total={total} current={current} pageSize={pageSize}
                        showTotal={() => `共 ${total} 条`}
                        onChange={this.pamphletsPaginationChange}/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const WrappedForm = Form.create({ name: 'Pamphlet' })(Pamphlet);

export default connect(({ loading, common, pamphletList }) => ({
  fetchingPamphlets: loading.effects['pamphletList/eGetPamphlets'],
  deletingPamphlet: loading.effects['pamphletList/eDeletePamphlet'],
  level: common.mine.level,
  routes: pamphletList.routes,
  belong_to: pamphletList.searchParams.belong_to,
  total: pamphletList.pamphlets.total,
  current: pamphletList.pamphlets.current,
  pageSize: pamphletList.pamphlets.pageSize,
  pamphletList: pamphletList.pamphlets.list,
}))(WrappedForm);
