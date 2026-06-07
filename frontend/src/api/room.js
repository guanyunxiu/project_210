import request from '@/utils/request'

export const getRoomList = () => {
  return request({
    url: '/rooms',
    method: 'get'
  })
}

export const getRoomDetail = (id) => {
  return request({
    url: `/rooms/${id}`,
    method: 'get'
  })
}

export const createRoom = (data) => {
  return request({
    url: '/rooms',
    method: 'post',
    data
  })
}

export const joinRoom = (id, data) => {
  return request({
    url: `/rooms/${id}/join`,
    method: 'post',
    data
  })
}

export const leaveRoom = (id) => {
  return request({
    url: `/rooms/${id}/leave`,
    method: 'post'
  })
}

export const readyRoom = (id) => {
  return request({
    url: `/rooms/${id}/ready`,
    method: 'post'
  })
}

export const startGame = (id) => {
  return request({
    url: `/rooms/${id}/start`,
    method: 'post'
  })
}

export const endGame = (id, data) => {
  return request({
    url: `/rooms/${id}/end`,
    method: 'post',
    data
  })
}

export const getRoomMessages = (id) => {
  return request({
    url: `/rooms/${id}/messages`,
    method: 'get'
  })
}

export const getMyRole = (id) => {
  return request({
    url: `/rooms/${id}/role`,
    method: 'get'
  })
}

export const sendVote = (id, data) => {
  return request({
    url: `/rooms/${id}/vote`,
    method: 'post',
    data
  })
}

export const getVoteResult = (id) => {
  return request({
    url: `/rooms/${id}/votes`,
    method: 'get'
  })
}
