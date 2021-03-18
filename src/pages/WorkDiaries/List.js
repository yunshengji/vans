import React from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Row, List, Input, Col, Button, Pagination, Form, Spin, Rate, Breadcrumb } from 'antd';
import moment from 'moment';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import styles from './List.less';
import EditWorkDiaryDrawer from './components/EditWorkDiaryDrawer';

class WorkDiariesList extends React.Component {

  componentDidMount() {
    const { dispatch, current, pageSize } = this.props;
    dispatch({
      type: 'workDiariesList/eGetWorkDiaries',
      payload: { page: current, page_size: pageSize },
    });
  }

  workDiariesPaginationChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'workDiariesList/eGetWorkDiaries',
      payload: { page, page_size: pageSize },
    });
  };
  handleSubmit = e => {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'workDiariesList/eCreateWorkDiary',
          form,
          payload: {
            title: values.title,
            points: values.points,
            content: values.content.toRAW(),
          },
        });
      }
    });
  };
  showEditDrawer = item => {
    item.displayContent = BraftEditor.createEditorState(item.content);
    this.props.dispatch({
      type: 'workDiariesList/rUpdateState',
      payload: {
        editWorkDiaryDrawerVisible: true,
        editWorkDiary: item,
      },
    });
  };

  render() {
    const { fetchingWorkDiaries, submittingWorkDiary, routes, form: { getFieldDecorator }, editWorkDiaryDrawerVisible, total, current, pageSize, workDiariesList } = this.props;
    const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link'];
    return (
      <React.Fragment>
        {editWorkDiaryDrawerVisible && <EditWorkDiaryDrawer/>}
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
          <Row gutter={[80]}>
            <Col md={8} sm={24}>
              <h3 style={{ marginBottom: '1.5em' }}>日志列表</h3>
              <Spin spinning={Boolean(fetchingWorkDiaries)}>
                <List itemLayout="vertical" dataSource={workDiariesList}
                      renderItem={item => (
                        <List.Item className={styles.listItem}
                                   onClick={() => {
                                     this.showEditDrawer(item);
                                   }}>
                          <List.Item.Meta
                            title={moment(1000 * item['created_at']).format('YYYY-MM-DD HH:mm') + ' ' + item.title}
                            description={
                              <React.Fragment>
                                重要性：<Rate disabled count={3} value={item.points}/>
                              </React.Fragment>}/>
                          <div className={styles.content}
                               dangerouslySetInnerHTML={{ __html: BraftEditor.createEditorState(item.content).toHTML() }}/>
                        </List.Item>
                      )}
                />
              </Spin>
              <div className="paginationWrapper">
                <Pagination defaultCurrent={1} total={total} current={current} pageSize={pageSize}
                            onChange={this.workDiariesPaginationChange}/>
              </div>
            </Col>
            <Col md={16} sm={24}>
              <h3 style={{ marginBottom: '1.5em' }}>写日志</h3>
              <Spin spinning={Boolean(submittingWorkDiary)}>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Item label="日志标题">
                    {getFieldDecorator('title', {
                      initialValue: '',
                    })(
                      <Input placeholder="请输入标题"/>,
                    )}
                  </Form.Item>
                  <Form.Item label="重要性">
                    {getFieldDecorator('points', {
                      initialValue: 0,
                    })(
                      <Rate count={3}/>,
                    )}
                  </Form.Item>
                  <Form.Item label="日志正文">
                    {getFieldDecorator('content', {
                      initialValue: '',
                      validateTrigger: 'onBlur',
                      rules: [{
                        required: true,
                        validator: (_, value, callback) => {
                          if (value.isEmpty()) {
                            callback('请输入正文内容');
                          } else {
                            callback();
                          }
                        },
                      }],
                    })(
                      <BraftEditor controls={controls} contentStyle={{ height: '30vh' }}
                                   className={styles.editWrapper}
                                   placeholder="请输入正文内容"/>,
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={this.handleSubmit}>提交</Button>
                  </Form.Item>
                </Form>
              </Spin>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

const WrappedForm = Form.create({ name: 'WorkDiariesList' })(WorkDiariesList);

export default connect(({ loading, workDiariesList }) => ({
  fetchingWorkDiaries: loading.effects['workDiariesList/eGetWorkDiaries'],
  submittingWorkDiary: loading.effects['workDiariesList/eCreateWorkDiary'],
  routes: workDiariesList.routes,
  editWorkDiaryDrawerVisible: workDiariesList.editWorkDiaryDrawerVisible,
  total: workDiariesList.workDiaries.total,
  current: workDiariesList.workDiaries.current,
  pageSize: workDiariesList.workDiaries.pageSize,
  workDiariesList: workDiariesList.workDiaries.list,
}))(WrappedForm);
