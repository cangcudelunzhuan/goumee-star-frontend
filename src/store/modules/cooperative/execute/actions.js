/**
 * 协同模块-执行项目Actions
 */
import {getCooperationAE, getCurrentAEAccount, getDocumentaryList} from '@/api/cooperative'
import {GET_CooperationAE, GET_CurrentAE, GET_CurrentAERecordList} from './actiontypes'
import { Message } from 'element-ui'

// 获取查询跟单AE记录
const GetCooperationAE = ({commit, dispatch}, data) => {
  getCooperationAE(data).then((res) => {
    if (res.data.success) {
      let cooperationAElist = res.data.data
      commit(GET_CooperationAE, cooperationAElist)
      dispatch('GetCurrentAE', cooperationAElist.length > 0 ? cooperationAElist[0] : [])
    } else {
      if (res.data.error_code !== 200) { // error_code: 200 权限不足
        Message.error(res.data.message)
      }
      commit(GET_CooperationAE, [])
      dispatch('GetCurrentAE', null)
    }
  }).catch((err) => {
    Message.error(err)
    commit(GET_CooperationAE, [])
    dispatch('GetCurrentAE', null)
  })
}

// 获取当前执行AE
const GetCurrentAE = ({commit, state, dispatch}, data) => {
  if (data != null) {
    getCurrentAEAccount({
      cooperation_id: state.CooperationDetail.cooperation_id,
      ae_id: data.ae_id
    }).then(res => {
      let _account = res.data.data
      let newdata = {}
      if (data.hasOwnProperty('ae_name')) {
        newdata = {...JSON.parse(JSON.stringify(data)), ..._account}
      } else {
        newdata = {...JSON.parse(JSON.stringify(state.CurrentAE)), ..._account}
      }
      commit(GET_CurrentAE, newdata)
      dispatch('GetCurrentAERecordList', {cooperation_id: state.CooperationDetail.cooperation_id, ae_id: data.ae_id})
    })
  } else {
    commit(GET_CurrentAE, data)
  }
}

// 获取当前AE的跟单记录
const GetCurrentAERecordList = ({commit}, data) => {
  if (!(data.hasOwnProperty('page_num') && data.hasOwnProperty('page_num'))) {
    data = {...data, ...{num: 10, page_num: 1}}
  }
  getDocumentaryList(data).then(res => {
    if (res.data.success) {
      let aerecordlist = res.data.data
      commit(GET_CurrentAERecordList, aerecordlist)
    } else {
      if (res.data.error_code !== 200) { // error_code: 200 权限不足
        Message.error(res.data.message)
      }
      commit(GET_CurrentAERecordList, null)
    }
  })
}

export default {
  GetCooperationAE,
  GetCurrentAE,
  GetCurrentAERecordList
}
