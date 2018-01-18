import React, { PropTypes } from 'react';
import {  Popconfirm, Pagination,Dropdown,Popover,Button,Icon,Menu,Modal,Checkbox,Badge} from 'antd';
import TransferForm from './TransferForm'
import Receive from './Receive'
function Approve(props){
	return <div>Approve TODO</div>
}
function Convert(props){
	return <div>Convert TODO</div>
}
function ListLayer({ modal={},children}){
  
  const modalState = modal.state
  const modalActions = modal.actions

  const getModalProps = type => {
    let thisLayer = modalState[type] || {}
    return {
      visible:thisLayer.visible,
      // title:thisLayer.title
      footer:null,
      closable:true,
      maskClosable:true,
      wrapClassName:"rs",
      onCancel:modalActions.hideModal.bind(this,type),
    }
  }

  let _this = this;
  return (
    <div>
      <Modal {...getModalProps('transfer')} title="Transfer"  >
        <TransferForm modal={modal} />
      </Modal>
      <Modal {...getModalProps('receive')} title="My Ethereum Address"  >
        <Receive modal={modal} />
      </Modal>
      <Modal {...getModalProps('approve')} title="Approve"  >
        <Approve modal={modal} />
      </Modal>
      <Modal {...getModalProps('convert')} title="Convert"  >
        <Approve modal={modal} />
      </Modal>
    </div>
  );
}

export default ListLayer;
