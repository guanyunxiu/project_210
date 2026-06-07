import request from '@/utils/request'

export const getGameInfo = (id) => {
  return request({
    url: `/rooms/${id}`,
    method: 'get'
  })
}

export const sendMessage = (id, data) => {
  return request({
    url: `/rooms/${id}/messages`,
    method: 'post',
    data
  })
}

export const endGame = (id, data) => {
  return request({
    url: `/rooms/${id}/end`,
    method: 'post',
    data
  })
}
