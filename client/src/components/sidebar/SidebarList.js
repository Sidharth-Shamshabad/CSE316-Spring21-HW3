import React from 'react'
import SidebarEntry from './SidebarEntry'

const SidebarList = (props) => {
  const todolist = props.todolists.filter(
    (todolist) => props.activeid == todolist.id
  )
  const otherlists = props.todolists.filter(
    (todolist) => props.activeid != todolist.id
  )

  // for (let i = 0; i < props.todolists.length; i++) {
  //   const element = props.todolists[i]
  //   console.log(props.activeid, element.id)
  // }

  console.log(todolist)
  console.log(otherlists)

  return (
    <>
      {props.activeid &&
        todolist.map((todo) => (
          <SidebarEntry
            handleSetActive={props.handleSetActive}
            activeid={props.activeid}
            id={todo.id}
            key={todo.id}
            name={todo.name}
            _id={todo._id}
            updateListField={props.updateListField}
            tps={props.tps}
            setIsEditing={props.setIsEditing}
          />
        ))}

      {props.todolists &&
        otherlists.map((todo) => (
          <SidebarEntry
            handleSetActive={props.handleSetActive}
            activeid={props.activeid}
            id={todo.id}
            key={todo.id}
            name={todo.name}
            _id={todo._id}
            updateListField={props.updateListField}
            tps={props.tps}
            setIsEditing={props.setIsEditing}
          />
        ))}
    </>
  )
}

export default SidebarList
