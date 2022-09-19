import { createStore, Commit } from 'vuex'
import axios from 'axios'

interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: string;
  column?: string;
}

interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}

export interface ColumnProps {
  _id?: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}

export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}

export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: [],
    posts: [],
    user: { isLogin: true, name: 'xing', column: '1' }
  },
  mutations: {
    login (state) {
      state.user = { ...state.user, isLogin: true, name: 'xing' }
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.data.list
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      getAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      getAndCommit(`/columns/${cid}`, 'fetchColum', commit)
    },
    fetchPosts ({ commit }, cid) {
      getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    }
  }
})

export default store
