import React from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Button, Table, Pagination, Breadcrumb, Row, Form, Col, Select, Modal } from 'antd';
import moment from 'moment';
import { getFileURL } from '@/utils/transfer';
import UploadPerformance from '@/pages/Brochure/components/UploadPerformance';

class Performance extends React.Component {
  componentDidMount() {
    const { dispatch, current, pageSize } = this.props;
    dispatch({
      type: 'performanceList/eGetPerformances',
      payload: { page: current, page_size: pageSize },
    });
  }

  showUploadPerformancesModal = () => {
    this.props.dispatch({
      type: 'performanceList/rUpdateState',
      payload: { uploadPerformancesModalVisible: true },
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
        dispatch({ type: 'performanceList/eDeletePerformance', id });
      },
    });
  };
  performancesPaginationChange = (page, pageSize) => {
    const values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'performanceList/eGetPerformances',
      payload: { page, page_size: pageSize, ...values },
    });
  };

  render() {
    const { fetchingPerformances, deletingPerformance, routes, level, belong_to, total, current, pageSize, performanceList } = this.props;
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
          <Button icon="plus-circle" onClick={this.showUploadPerformancesModal}>上传</Button>
        </div>
        <UploadPerformance/>
        <div className="contentWrapper">
          <h3>业绩表</h3>
          <Table tableLayout="fixed" size="middle" pagination={false} dataSource={performanceList}
                 loading={fetchingPerformances || deletingPerformance} rowKey={record => record.id}>
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
                        onChange={this.performancesPaginationChange}/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const WrappedForm = Form.create({ name: 'Performance' })(Performance);

export default connect(({ loading, common, performanceList }) => ({
  fetchingPerformances: loading.effects['performanceList/eGetPerformances'],
  deletingPerformance: loading.effects['performanceList/eDeletePerformance'],
  level: common.mine.level,
  routes: performanceList.routes,
  belong_to: performanceList.searchParams.belong_to,
  total: performanceList.performances.total,
  current: performanceList.performances.current,
  pageSize: performanceList.performances.pageSize,
  performanceList: performanceList.performances.list,
}))(WrappedForm);
