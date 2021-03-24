import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import { AiFillEdit } from 'react-icons/ai'

const SearchAndButtton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SearchForm = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 10px;
`

const RemoveAllButton = styled.button`
  width: 16%;
  height: 40px;
  background: #f54242;
  border: none;
  font-weight: 500;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
`

const TodoName = styled.span`
  font-size: 27px;
  ${({ is_completed }) => is_completed && `
    opacity: 0.4;
  `}
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 7px auto;
  padding: 10px;
  font-size: 25px;
`

const CheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  color: green;
  cursor: pointer;
`

const UncheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  cursor: pointer;
`

const EditButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`

function TodoList() {
  const [todos, setTodos] = useState([]) //todosには現在のtodo全てが格納されます。
  const [searchName, setSearchName] = useState('') //空の文字列を初期値として与える
  //serchNameは検索機能を使う時に使用する

  useEffect(() => { //useEffectが一度だけ走ります
    axios.get('/api/v1/todos.json') //aixiosはサーバーとのHTTP通信を行うライブラリのこと
    //上記のようにすることで、appのcontrollerのapiのv1にアクセスされる
    .then(resp => {
      console.log(resp.data)
      setTodos(resp.data);
    })
    .catch(e => {
      console.log(e);
    })
  }, [])

  const removeAllTodos = () => {
    const sure = window.confirm('Are you sure?');//delteAllが主要になりのでユーザーに確認させることをしている。ダイアログボックス
    if (sure) {
      axios.delete('/api/v1/todos/destroy_all')//routhingを確認
      .then(resp => {
        setTodos([])
      })
      .catch(e => {
        console.log(e)
      })
    }
  }

  const updateIsCompleted = (index, val) => { //valっていうのが更新しようとしているレコードそのもの 
    //indexには0,1,2,というように数字が格納されている
    var data = { //dataを定義している。
      id: val.id,
      name : val.name,
      is_completed: !val.is_completed //反転させた値
    }
    axios.patch(`/api/v1/todos/${val.id}`, data)
    .then(resp => {
      const newTodos = [...todos]
      newTodos[index].is_completed = resp.data.is_completed
      setTodos(newTodos)
    })
  }
  return (
    <>
      <h1>Todo List</h1>
      <SearchAndButtton>
        <SearchForm
          type="text"
          placeholder="Search todo..."
          onChange={event => {
            setSearchName(event.target.value)
          }}
        />
        <RemoveAllButton onClick={removeAllTodos}>
          Remove All
        </RemoveAllButton>
      </SearchAndButtton>

      <div>
        {todos.filter((val) => { //todosというのをふるいにかけている。todosを一つ一つ取り出して、valという変数に入れている
          if(searchName === "") { //検索のとこの文字が空っぽだった場合にはそのままValを返すのだが、もしからじゃなかったらLowerCaseで小文字にして、その文字をvalのnameを含んでいたらそのvalを返す
            return val 
          } else if (val.name.toLowerCase().includes(searchName.toLowerCase())) {
            return val
          }
        }).map((val, key) => { //そうするといくつかのtodoが返されるので、そちらをmapで展開している。rubyのeach文みたいに一つ一つ取り出しているvalの変数に入れている
          //keyは1,2,3,4,5など数字が格納
          return (
            <Row key={key}>
              {val.is_completed ? (
                <CheckedBox>
                  <ImCheckboxChecked onClick={() => updateIsCompleted(key, val) } />
                </CheckedBox>
              ) : (
                <UncheckedBox>
                  <ImCheckboxUnchecked onClick={() => updateIsCompleted(key, val) } />
                </UncheckedBox>
              )}
              <TodoName is_completed={val.is_completed}> 
                {val.name}
              </TodoName>
              <Link to={"/todos/" + val.id + "/edit"}>
                <EditButton>
                  <AiFillEdit />
                </EditButton>
              </Link>
            </Row>
          )
        })}
      </div>
    </>
  )
}
export default TodoList
