import React from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Button, Table, Pagination, Breadcrumb, Tag, Row, Form, Col, Input, Select, DatePicker, Modal } from 'antd';
import moment from 'moment';
import UploadLaws from '@/pages/Laws/components/UploadLaws';
import { getFileURL } from '@/utils/transfer';
import { LAWS_LABELS } from '../../../config/constant';

const { Column } = Table;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;


class LawsList extends React.Component {
  componentDidMount() {
    const { dispatch, current, pageSize } = this.props;
    dispatch({
      type: 'lawsList/eGetLaws',
      payload: { page: current, page_size: pageSize },
    });
  }

  showUploadLawsModal = () => {
    this.props.dispatch({
      type: 'lawsList/rUpdateState',
      payload: { uploadLawsModalVisible: true },
    });
  };
  showDeleteConfirm = ({ id, creator: { name }, attachment: { file_name_local } }) => {
    const { dispatch } = this.props;
    confirm({
      title: '确定删除此资料',
      content: <p>{name} 上传的的资料 <Tag>{file_name_local}</Tag></p>,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({ type: 'lawsList/eDeleteLaw', id });
      },
    });
  };
  lawsPaginationChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'lawsList/eGetLaws',
      payload: { page, page_size: pageSize },
    });
  };

  render() {
    const { fetchingLaws, deletingLaw, routes, level, total, current, pageSize, lawsList } = this.props;
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
          {level > 1 && <Button type="primary" size="small" onClick={this.showUploadLawsModal}>上传</Button>}
        </div>
        <UploadLaws/>
        <div className="contentWrapper">
          <h3>资料筛选</h3>
          <Form layout="horizontal" className="searchWrapper">
            <Row gutter={[80]}>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="类别">
                  <Select placeholder="请选择">
                    {LAWS_LABELS.map((item) =>
                      <Option key={item} value={item}>{item}</Option>,
                    )}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="文件名"><Input placeholder="请输入"/></Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <Form.Item label="上传时间">
                  <RangePicker/>
                </Form.Item>
              </Col>
              <Col xl={6} md={12} sm={24}>
                <div className="searchButtons">
                  <Button type="primary">搜索</Button>
                  <Button style={{ marginLeft: '1em' }}>重置</Button>
                </div>
              </Col>
            </Row>
          </Form>
          <h3>法律法规资料列表</h3>
          <Table tableLayout="fixed" size="middle" pagination={false} dataSource={lawsList}
                 loading={fetchingLaws || deletingLaw} rowKey={record => record.id}>
            <Column title="文件名" dataIndex="attachment" render={(text, record) => (
              <a href={getFileURL(record['attachment']['id'])}
                 target="_blank">{record['attachment']['file_name_local']}</a>
            )}/>
            <Column title="类别" dataIndex="belong_to" render={text => (<Tag>{text}</Tag>)}/>
            <Column title="上传者" dataIndex="creator" render={text => (<React.Fragment>{text['name']}</React.Fragment>)}/>
            <Column title="上传时间" dataIndex="created_at"
                    render={text => (<React.Fragment>{moment(text * 1000).format('YYYY-MM-DD')}</React.Fragment>)}/>
            {
              level > 1 &&
              <Column title="操作" dataIndex="action"
                      render={(text, record) => (
                        <div className="actionGroup">
                          <Button type="link" icon="edit">归类</Button>
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
                        onChange={this.lawsPaginationChange}/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(({ loading, common, lawsList }) => ({
  fetchingLaws: loading.effects['lawsList/eGetLaws'],
  deletingLaw: loading.effects['lawsList/DeleteLaw'],
  level: common.mine.level,
  routes: lawsList.routes,
  total: lawsList.laws.total,
  current: lawsList.laws.current,
  pageSize: lawsList.laws.pageSize,
  lawsList: lawsList.laws.list,
}))(LawsList);
