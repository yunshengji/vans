import React from 'react';
import { connect } from 'dva';
import { Radio, Upload, Modal, Icon, Row, Button, Form, Input, message } from 'antd';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class GossipList extends React.Component {
  cancelPreview = () => {
    this.props.dispatch({
      type: 'gossipList/rUpdateState',
      payload: { uploadPicturePreviewModalVisible: false },
    });
  };
  handleSubmit = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({ type: 'gossipList/eWriteGossip', payload: { ...values, form } });
      }
    });
  };

  render() {
    const { dispatch, form, submittingGossip, gossipPicturesFileList, uploadPicturePreviewModalVisible, uploadPicturePreviewImage } = this.props;
    const { getFieldDecorator } = form;
    const uploadConfig = {
      listType: 'picture-card',
      multiple: true,
      showUploadList: true,
      fileList: gossipPicturesFileList,
      beforeUpload: file => {
        if (!file.type.startsWith('image')) {
          message.warn('图片只能是 PNG JPG JPEG SVG GIF 格式!');
        }
        return false;
      },
      onChange: ({ file, fileList }) => {
        dispatch({
          type: 'gossipList/rUpdateState',
          payload: { gossipPicturesFileList: fileList },
        });
      },
      onPreview: async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        dispatch({
          type: 'gossipList/rUpdateState',
          payload: { uploadPicturePreviewModalVisible: true, uploadPicturePreviewImage: file.preview },
        });
      },
    };
    return (
      <React.Fragment>
        <Form.Item>
          {getFieldDecorator('content', {
            initialValue: '',
            rules: [{ required: true, message: '请填写内容' }],
          })(
            <Input.TextArea autoSize={{ minRows: 6 }} placeholder="发表你的想法"/>,
          )}
        </Form.Item>
        <Row style={{ marginTop: '20px' }}>
          <Upload {...uploadConfig}>
            {gossipPicturesFileList.length <= 8 &&
            <div>
              <Icon type="plus"/>
              <div className="ant-upload-text">选择图片</div>
            </div>
            }
          </Upload>
          <Modal visible={uploadPicturePreviewModalVisible} footer={null} onCancel={this.cancelPreview}>
            <img style={{ width: '100%' }} src={uploadPicturePreviewImage}/>
          </Modal>
        </Row>
        <Row type="flex" justify="end" style={{ marginTop: '20px' }}>
          <Form.Item>
            {getFieldDecorator('isPrivate', {
              initialValue: true,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Radio.Group>
                <Radio value={false}>实名</Radio>
                <Radio value={true}>匿名</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Button type="primary" onClick={this.handleSubmit} loading={submittingGossip}>发布</Button>
        </Row>
      </React.Fragment>
    );
  }
}

const WrappedForm = Form.create({ name: 'GossipList' })(GossipList);

export default connect(({ loading, common, gossipList }) => ({
  submittingGossip: loading.effects['gossipList/eWriteGossip'],
  gossipPicturesFileList: gossipList.gossipPicturesFileList,
  uploadPicturePreviewModalVisible: gossipList.uploadPicturePreviewModalVisible,
  uploadPicturePreviewImage: gossipList.uploadPicturePreviewImage,
}))(WrappedForm);
