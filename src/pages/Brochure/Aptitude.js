import React from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Button, Table, Pagination, Breadcrumb, Row, Form, Col, Select, Modal } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { getFileURL } from '@/utils/transfer';
import UploadAptitude from '@/pages/Brochure/components/UploadAptitude';

const { Column } = Table;
const { Option } = Select;
const { confirm } = Modal;


class Aptitude extends React.Component {
  componentDidMount() {
    const { dispatch, current, pageSize } = this.props;
    dispatch({
      type: 'aptitudeList/eGetAptitudes',
      payload: { page: current, page_size: pageSize },
    });
  }

  showUploadAptitudesModal = () => {
    this.props.dispatch({
      type: 'aptitudeList/rUpdateState',
      payload: { uploadAptitudesModalVisible: true },
    });
  };

  showDeleteConfirm = ({ id, attachment: { file_name_local } }) => {
    const { dispatch } = this.props;
    confirm({
      title: '确定删除此资质',
      content: <p>文件 <b>《{file_name_local}》</b> 删除后将无法恢复</p>,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({ type: 'aptitudeList/eDeleteAptitude', id });
      },
    });
  };
  aptitudesPaginationChange = (page, pageSize) => {
    const values = this.props.form.getFieldsValue();
    this.props.dispatch({
      type: 'aptitudeList/eGetAptitudes',
      payload: { page, page_size: pageSize, ...values },
    });
  };

  render() {
    const {  fetchingAptitudes, deletingAptitude, routes, total, current, pageSize, aptitudeList } = this.props;
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
          <Button icon="plus-circle" onClick={this.showUploadAptitudesModal}>上传</Button>
        </div>
        <UploadAptitude/>
        <div className="contentWrapper">
          <h3>资质列表</h3>
          <Table tableLayout="fixed" size="middle" pagination={false} dataSource={aptitudeList}
                 loading={fetchingAptitudes || deletingAptitude} rowKey={record => record.id}
                 rowClassName={(record, index) => {
                   if (index % 2 === 1) {
                     return 'zebraHighlight';
                   }
                 }}>
            <Column title="资质名称" dataIndex="name"/>
            <Column title="资质描述" dataIndex="remark"/>
            <Column title="相关文件" dataIndex="attachment" render={(attachment) => {
              return (
                _.map(attachment, (value, key) => {
                  return (
                    <p key={key}>
                      <a href={getFileURL(value.id)} target="_blank">{value['file_name_local']}</a>
                    </p>
                  );
                })
              );
            }}/>
            <Column title="创建日期" dataIndex="created_at"
                    render={(text) => (<span>{moment(1000 * text).format('YYYY-MM-DD')}</span>)}/>
            <Column title="操作" dataIndex="action"
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
                        onChange={this.aptitudesPaginationChange}/>
          </div>
        </div>
      </React.Fragment>
    )
      ;
  }
}

const WrappedForm = Form.create({ name: 'Aptitude' })(Aptitude);

export default connect(({ loading, common, aptitudeList }) => ({
  fetchingAptitudes: loading.effects['aptitudeList/eGetAptitudes'],
  deletingAptitude: loading.effects['aptitudeList/eDeleteAptitude'],
  level: common.mine.level,
  routes: aptitudeList.routes,
  belong_to: aptitudeList.searchParams.belong_to,
  total: aptitudeList.aptitudes.total,
  current: aptitudeList.aptitudes.current,
  pageSize: aptitudeList.aptitudes.pageSize,
  aptitudeList: aptitudeList.aptitudes.list,
}))(WrappedForm);
