import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card,Tabs,Icon,Popover,Input } from 'antd';
import intl from 'react-intl-universal';
import TickerTrend from 'Loopr/TickerTrend'
import {configs} from '../../../common/config/data'
const tickerFm = window.uiFormatter.TickerFormatter

const TickerTable = (props)=>{
  const {tickers,market,dispatch} = props
  const favors =  window.STORAGE.markets.getFavors()
  let newMarkets =  []
  if(window.REMOTE_CONFIG && window.REMOTE_CONFIG.newMarkets) {
    newMarkets = window.REMOTE_CONFIG.newMarkets
  }
  const isInNewMarket = (market) => {
    const m = market.toLowerCase().split('-')
    return newMarkets.find((i)=> {
      return (i.tokenx.toLowerCase() === m[0] && i.tokeny.toLowerCase() === m[1]) || (i.tokeny.toLowerCase() === m[0] && i.tokenx.toLowerCase() === m[1])
    })
  }
  let items = []
  if(market === 'favorites'){
    items = tickers.items.filter(item=>{
      return favors[item.market]
    })
  } else if(market === 'innovate') {
    items = tickers.items.filter(item=>{
      return isInNewMarket(item.market)
    })
  } else {
    items = tickers.items.filter(item=>{
      return item.market.toLowerCase().split('-')[1] === market.toLowerCase() && !isInNewMarket(item.market)
    })
  }
  const keywords = tickers.filters && tickers.filters.token
  if(keywords){
    items = items.filter(item=>{
        return item.market.toUpperCase().indexOf(keywords.toUpperCase()) > -1
    })
  }
  const sorter = (a,b)=>{
    if(a.vol === b.vol ){
      if(a.last === b.last){
        return b.market > a.market ? -1 : 1
      }else{
        return Number(b.last) - Number(a.last)
      }
    }else{
      return Number(b.vol) - Number(a.vol)
    }
  }
  items.sort(sorter)
  const updateOrders = (pair)=>{
    dispatch({
      type:'orders/filtersChange',
      payload:{
        id:'orders/trade',
        filters:{
          market:pair
        }
      }
    })

  }
  const updateTrades = (pair)=>{
    dispatch({
      type:'orders/filtersChange',
      payload:{
        id:'orders/trade',
        filters:{
          market:pair
        }
      }
    })
  }

  const gotoTrade = (pair,e)=>{
    e.preventDefault()
    updateOrders(pair)
    updateTrades(pair)
    window.STORAGE.markets.setCurrent(pair)
    window.routeActions.gotoPath(`/trade/${pair}`)
  }
  const toggleFavor= (pair,e)=>{
    e.preventDefault()
    e.stopPropagation()
    tickers.toggleFavor(pair)
  }

  return (
    <div className="mb15" style={{minWidth:'400px',maxHeight:'400px',overflow:'auto'}}>
      {market === 'innovate' && <div className="fs12 p10 bg-blue-50 mb10 ">
        <div className="row no-gutters">
          <div className="col">
            {intl.get('ticker.new_listing')}
          </div>
          <div className="col-auto">
            <a href='https://goo.gl/forms/2RUdyJxOPTdSBkbZ2' target="_blank">{intl.get('ticker.apply')}</a>
          </div>
        </div>
      </div>}
      <table className="ticker-list-table">
        <tbody>
          <tr className="">
            <th className="fs14 border-0 color-black-3" style={{paddingLeft:"28px"}}>{intl.get('ticker.market')}</th>
            <th className="fs14 border-0 color-black-3">{intl.get('ticker.last')}</th>
            <th className="fs14 border-0 color-black-3">{intl.get('ticker.change')}/24H</th>
            <th className="fs14 border-0 color-black-3">{intl.get('ticker.vol')}/24H</th>
          </tr>
          {
            items.length>0 && items.map((item,index)=>
              <tr key={index} className="cursor-pointer" onClick={gotoTrade.bind(this,item.market)}>
                <td className="fs12 border-0 ">
                  {
                    favors[item.market] &&
                      <Icon className="pointer color-yellow-700 fs12 mr5" onClick={toggleFavor.bind(this,item.market)} type="star" />
                  }
                  {
                    !favors[item.market] &&
                    <Icon className="pointer color-grey-300 fs12 mr5" onClick={toggleFavor.bind(this,item.market)} type="star" />
                  }
                  {item.market}
                </td>
                <td className="fs12 border-0 color-balck-2">
                  <TickerTrend side={tickerFm.getChangeSide(item.change)}>
                    {item.last || 0.00}
                  </TickerTrend>
                </td>
                <td className="fs12 border-0 color-balck-2">
                  <TickerTrend side={tickerFm.getChangeSide(item.change)}>
                    {item.change || 0}
                  </TickerTrend>
                </td>
                <td className="fs12 border-0 color-black-2">{Number(item.vol).toFixed(4)} {item.market.split('-')[1]}</td>
              </tr>
            )
          }
          {
            items.length === 0 &&
            <tr >
              <td colSpan="10" className="fs12 border-0 text-center color-black-3">{intl.get('global.no_data')}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

  )
}

const TickerTabs = ({tickersByLoopring:tickers,dispatch})=>{
  const search = (e)=>{
    const value = e.target.value
    const filters = {
      token:value.toUpperCase(),
    }
    tickers.filtersChange({filters})
  }
  let markets = [...window.CONFIG.getSupportedMarketsTokenR()]
  const keywords = tickers.filters && tickers.filters.token
  const SearchInput = (
      <div className="pr10 pl25 tickers-search-input" style={{paddingTop:'5px'}}>
       <Input
        style={{width:'100px'}} className="" size="small" onChange={search} value={keywords}
        prefix={<Icon type="search" />}
       />
      </div>
  )
  const favors =  window.STORAGE.markets.getFavors()
  let favoredNumber = 0
  for (let key in favors ){
    if(favors[key]){
      favoredNumber += 1
    }
  }
  const activeTab = favoredNumber > 0 ? 'favorites' : 'WETH'
  // tab(intl.get('ticker.favorites'))
  const tab = (text)=> <div className="fs16 font-weight-bold">{text}</div>
  return (
    <Tabs className="tickers-market-tabs" defaultActiveKey={activeTab} animated={false} tabBarExtraContent={SearchInput}>
      <Tabs.TabPane tab={tab(intl.get('global.favorites'))} key="favorites">
        <div className="pl10 pr10">
          <TickerTable tickers={tickers} market="favorites" dispatch={dispatch} />
        </div>
      </Tabs.TabPane>
      {
        markets.map((market,index)=>
          <Tabs.TabPane tab={tab(market)} key={market}>
            <div className="pl10 pr10">
              <TickerTable tickers={tickers} market={market} dispatch={dispatch}  />
            </div>
          </Tabs.TabPane>
        )
      }
      {
        window.REMOTE_CONFIG && window.REMOTE_CONFIG.newMarkets && window.REMOTE_CONFIG.newMarkets.length >0 &&
        <Tabs.TabPane tab={tab(intl.get('global.new_listing'))} key="bulb">
          <div className="pl10 pr10">
            <TickerTable tickers={tickers} market="innovate" dispatch={dispatch} />
          </div>
        </Tabs.TabPane>
      }

    </Tabs>
  )
}

export default TickerTabs

