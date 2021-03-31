import React, { useState } from 'react' //useStateを使うので追加
import axios from 'axios' //HTPPS通信も行うので追加
import styled from 'styled-components'
import { toast } from 'react-toastify' //フラッシュメッセージ用
import 'react-toastify/dist/ReactToastify.css' //フラッシュメッセージのcss用
import { FiSend } from 'react-icons/fi' //送信ボタンをReacticonsから使用するため

const InputAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`

const InputName = styled.input` 
  font-size: 20px;
  width: 100%;
  height: 40px;
  padding: 2px 7px;
`
//Todoを投稿する際のインプットタグになる

const Button = styled.button`
  font-size: 20px;
  border: none;
  border-radius: 3px; 
  margin-left: 10px;
  padding: 2px 10px;
  background: #1E90FF;
  color: #fff;
  text-align: center;
  cursor: pointer;
  ${({ disabled }) => disabled && `
    opacity: 0.5;
    cursor: default;
  `}
`
//ボタンの作成
//border-radiusは角の丸める

const Icon = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`
//アイコンの設定

toast.configure() //フラッシュメッセージを表示するための記述

function AddTodo(props) {
  const initialTodoState = {
    id: null,
    name: "",  //からの文字列
    is_completed: false
  };

  const [todo, setTodo] = useState(initialTodoState); //初期値に先ほどのinitialTodoStateを記述

  const notify = () => { //81行目で関数を使ったが定義していなかったので
    toast.success('Todo successfully created!', { //表示させたい文字
      position: 'bottom-center', //ポジションをデフォルトでは右上になっているが中央にする
      hideProgressBar: true //デフォルトで出てくるバーを隠す
    })
  }
  
  const handleInputChange = event => {
    const { name, value } = event.target; //カラムと値を定義する
    setTodo({ ...todo, [name]: value }); //スプレッド構文で展開して、カラム名を指定して、そのvalueを更新する
  };
  const saveTodo = () => {
    var data = {
      name: todo.name,
    };

    axios.post('/api/v1/todos', data) 
    .then(resp => {
      setTodo({
        id: resp.data.id,
        name: resp.data.name,
        is_completed: resp.data.is_completed
      });
      notify(); //フラッシュメッセージを表示する関数
      props.history.push("/todos"); //リダイレクトを行いたいため
    })
    .catch(e => {
      console.log(e) // エラーが起きたら
    })
  };
  return (
    <>
      <h1>New Todo</h1>
      <InputAndButton>
        <InputName
          type="text"
          required
          value={todo.name}
          name="name"
          onChange={handleInputChange}
        />
        <Button
          onClick={saveTodo}
          disabled={(!todo.name || /^\s*$/.test(todo.name))}
        >
          <Icon>
            <FiSend />
          </Icon>
        </Button>
      </InputAndButton>
    </>
  )
}

export default AddTodo