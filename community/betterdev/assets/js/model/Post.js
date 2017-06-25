const m = require('mithril')

import session from '../session'
import Url from '../util/url'

const Post = {
  errors: [],
  list: [],
  pagination: [],

  params : {},

  loadList: () => {
    Post.postStatus = 'loading'

    return m.request({
      method: "GET",
      url: "/api/links" + Url.serialize(Post.params),
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })
    .then(function(result) {
      if (result && result.data) {
        Post.list = result.data
        Post.pagination = result.pagination
      }
      Post.postStatus = 'ready'
    })
    .catch((e) => {
      Post.errors = ["Cannot fetch links from server. Try again"]
      Post.postStatus = 'ready'
    })
  },

  postStatus: "init",
  draft: "",
  loadDraft: () => {
    Post.draft = ""
  },

  create: (uri) => {
    Post.postStatus = "posting"
    return m.request({
      method: "POST",
      url: "/api/links",
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      },
      data: {link: {uri: uri}},
    }).then(response => {
      Post.draft = ""
      Post.postStatus = "ready"
      session.flash({message: "Thank you for sharing knowledge with community", type: 'success'})
      //{"data":{"uri":"https://github.com/bryanjos/joken","title":"GitHub","picture":"https://avatars1.githubusercontent.com/u/1257573?v=3&s=400","id":44,"description":"joken - Elixir JWT library"}}
      Post.list = [response.data].concat(Post.list)
    }).catch((e) => {
      Post.errors = ["Cannot save"]
      Post.draft = ""
      Post.postStatus = "ready"
      session.flash({message: "Your link cannot save now. Please contact us", type: 'error'})
    })
  }
}

export default Post
