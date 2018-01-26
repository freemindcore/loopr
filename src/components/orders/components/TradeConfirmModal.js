import React from 'react';
import { Modal,Collapse,Button,Input} from 'antd';

const TradeConfirm = ({
  }) => {
  const MetaItem = (props)=>{
    const {label,value}=props
    return (
      <div className="row zb-b-b pt10 pb10 no-gutters">
        <div className="col">
          <div className="fs14 color-grey-500">{label}</div>
        </div>
        <div className="col-auto">
          <div className="fs14 color-grey-900">{value}</div>
        </div>
      </div>
    )
  }
  return (
      <Modal title="Buy LRC" visible={false} footer={null}>
        <div className="caption zb-b-b text-center p25 pt0">
          <div className="fs16 color-grey-500 mb5">You are buying</div>
          <div className="fs28 color-grey-900">5,260.88 LRC</div>
          <div className="fs14 color-grey-500 mt5">0.0013108 x 5,260.88 = 10.35 ETH </div>
        </div>

        <MetaItem label="LRC Fee" value="2100" />
        <MetaItem label="Margin Split" value="50%" />
        <MetaItem label="Valid Since " value="xx" />
        <MetaItem label="Valid Until " value="xx" />
        <Collapse bordered={false} defaultActiveKey={[]}>
          <Collapse.Panel className="" 
            style={{border:'none',margin:'0px -15px',padding:'0px -15px'}} 
            header={<div style={{}}>Sign</div>} 
            key="1"
          >
            <div className="row">
              <div className="col">
                <div className="fs12 color-grey-500">Raw Order</div>
                <Input.TextArea disabled rows="4" className="d-block w-100 bg-grey-100 border-0" placeholder="" size="large" />
              </div>
              <div className="col">
                <div className="fs12 color-grey-500">Signed Order</div>
                <Input.TextArea disabled rows="4" className="d-block w-100 bg-grey-100 border-0" placeholder="" size="large" />
              </div>
            </div>
          </Collapse.Panel>
        </Collapse>

        <div className="pt15 text-center">
          <Button type="primary" className="d-block w-100" size="large">
            Submit Order
          </Button>
          <div className="fs12 color-grey-500 mt10">
            Submit order is free and does no consume gas
          </div>
        </div>
        

      </Modal>
  );
};


export default TradeConfirm

 
