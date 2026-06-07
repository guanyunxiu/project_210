import request from '@/utils/request'

export const getScriptList = (params) => {
  return request({
    url: '/scripts',
    method: 'get',
    params
  })
}

export const getScriptsByCategory = (category) => {
  return request({
    url: `/scripts/category/${category}`,
    method: 'get'
  })
}

export const getScriptDetail = (id) => {
  return request({
    url: `/scripts/${id}`,
    method: 'get'
  })
}
